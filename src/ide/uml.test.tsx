import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { UmlClass, UmlDiagram, type UmlEdge, type UmlNode } from '../index';
import { describeDiagram } from './UmlDiagram';

const NODES: UmlNode[] = [
  { id: 'ctx', name: 'PricingContext', attributes: ['- strategy: Strategy'], methods: ['+ price(): Money'] },
  { id: 'strat', name: 'Strategy', stereotype: 'interface', methods: ['+ compute(): Money'], emphasis: 'brand' },
  { id: 'hourly', name: 'HourlyStrategy' },
];
const EDGES: UmlEdge[] = [
  { from: 'ctx', to: 'strat', kind: 'aggregation', fromMultiplicity: '1', toMultiplicity: '1' },
  { from: 'hourly', to: 'strat', kind: 'realization' },
];

describe('UmlClass', () => {
  it('renders stereotype, name, attributes and methods', () => {
    const { container } = render(<UmlClass name="Strategy" stereotype="interface" attributes={['- id: int']} methods={['+ run()']} emphasis="brand" dashed />);
    expect(screen.getByText('«interface»')).toBeInTheDocument();
    expect(screen.getByText('Strategy')).toHaveClass('font-semibold');
    expect(screen.getByText('- id: int')).toBeInTheDocument();
    expect(screen.getByText('+ run()')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('border-2', 'border-brand-cobalt', 'border-dashed');
  });
});

describe('describeDiagram', () => {
  it('describes classes and relationships in words', () => {
    expect(describeDiagram('Strategy pattern', NODES, EDGES)).toBe(
      'Strategy pattern. Classes: PricingContext, Strategy (interface), HourlyStrategy. Relationships: PricingContext aggregates Strategy (1 to 1); HourlyStrategy implements Strategy.',
    );
  });
});

describe('UmlDiagram', () => {
  it('lays out nodes with dagre and draws one path per edge with UML markers', async () => {
    const { container } = render(<UmlDiagram label="Strategy pattern" nodes={NODES} edges={EDGES} />);
    await waitFor(() => expect(container.querySelectorAll('path[data-edge]')).toHaveLength(2));
    const boxes = [...container.querySelectorAll<HTMLElement>('[data-node]')];
    expect(boxes).toHaveLength(3);
    expect(boxes.every((b) => b.style.left !== '' && b.style.top !== '')).toBe(true);
    const [agg, real] = [...container.querySelectorAll('path[data-edge]')];
    expect(agg.getAttribute('marker-start')).toContain('diamond-hollow');
    expect(real.getAttribute('stroke-dasharray')).toBe('6 4');
    expect(real.getAttribute('marker-end')).toContain('triangle');
    expect(screen.getByRole('img', { name: 'Strategy pattern' })).toHaveAccessibleDescription(/PricingContext aggregates Strategy/);
  });
  it('zooms in 25% steps between 50% and 200%', async () => {
    render(<UmlDiagram label="d" nodes={NODES} edges={EDGES} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    for (let i = 0; i < 6; i++) await userEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByText('200%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Reset zoom' }));
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
  it('reserves space above the canvas so the zoom controls never cover a class', () => {
    render(<UmlDiagram label="d" nodes={NODES} edges={EDGES} />);
    expect(screen.getByRole('region', { name: 'd diagram' })).toHaveClass('pt-space-2xl');
  });
  it('compact hides the zoom controls; the viewport is focusable for panning', () => {
    render(<UmlDiagram label="mini" nodes={NODES} edges={EDGES} compact />);
    expect(screen.queryByRole('button', { name: 'Zoom in' })).toBeNull();
    expect(screen.getByRole('region', { name: 'mini diagram' })).toHaveAttribute('tabindex', '0');
  });
});
