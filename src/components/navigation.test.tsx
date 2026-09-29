import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavList, Pagination } from '../index';
import { pageRange } from './Pagination';

describe('NavList', () => {
  it('renders links with aria-current on the current item, icons and counts', () => {
    render(
      <NavList
        label="Workspace"
        heading="Navigation"
        current="problems"
        items={[
          { id: 'home', label: 'Home', icon: 'home', href: '/' },
          { id: 'problems', label: 'Problems', icon: 'code', href: '/problems', count: 142 },
        ]}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    const current = screen.getByRole('link', { name: /Problems/ });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('bg-surface-container-high', 'rounded-lg');
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
  it('toc variant uses a left accent; button items call onSelect', async () => {
    const onSelect = vi.fn();
    render(<NavList label="On this page" variant="toc" current="a" items={[{ id: 'a', label: 'Intent', href: '#a' }, { id: 'b', label: 'Structure', onSelect }]} />);
    expect(screen.getByRole('link', { name: 'Intent' })).toHaveClass('border-l-2', 'border-brand-cobalt');
    await userEvent.click(screen.getByRole('button', { name: 'Structure' }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('pageRange', () => {
  it('lists every page when there are few', () => {
    expect(pageRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it('inserts gaps around the sibling window', () => {
    expect(pageRange(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12]);
    expect(pageRange(1, 12)).toEqual([1, 2, 'gap', 12]);
    expect(pageRange(12, 12)).toEqual([1, 'gap', 11, 12]);
  });
  it('clamps out-of-range pages', () => {
    expect(pageRange(0, 12)).toEqual(pageRange(1, 12));
    expect(pageRange(99, 12)).toEqual(pageRange(12, 12));
    expect(pageRange(1, 0)).toEqual([]);
  });
});

describe('Pagination', () => {
  it('marks the current page, disables prev on page 1 and moves with next', async () => {
    const onChange = vi.fn();
    render(<Pagination page={1} pageCount={12} onChange={onChange} summary="Showing 12 of 142" />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveTextContent('Showing 12 of 142');
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).toHaveBeenCalledWith(2);
    await userEvent.click(screen.getByRole('button', { name: 'Page 12' }));
    expect(onChange).toHaveBeenCalledWith(12);
  });
  it('clamps out-of-range pages and renders nothing for a single page', () => {
    const { container, rerender } = render(<Pagination page={40} pageCount={3} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    rerender(<Pagination page={1} pageCount={1} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
