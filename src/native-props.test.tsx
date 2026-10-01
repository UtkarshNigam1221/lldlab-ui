import { render, screen } from '@testing-library/react';
import { cloneElement, type ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Avatar, Badge, Breadcrumbs, Callout, Card, CheckList, Chip, Code, CodeBlock, Countdown, Dialog, FullScreen, Dot, EditorTabs, EmptyState,
  Eyebrow, FileTree, Kbd, Markdown, Menu, Message, MetricTile, ProgressBar, ResultRow, SectionHeader, SegmentedControl, Split,
  Stat, StatusBar, TabPanel, Tabs, TextField, Workbench,
} from './index';

// Every public component forwards native props (id, data-*, aria-*) to its root element.
const CASES: Array<[string, ReactElement]> = [
  ['Split', <Split id="t" aside={null}>x</Split>],
  ['Eyebrow', <Eyebrow id="t">x</Eyebrow>],
  ['Code', <Code id="t">x</Code>],
  ['CodeBlock', <CodeBlock id="t">x</CodeBlock>],
  ['Markdown', <Markdown id="t">x</Markdown>],
  ['Badge', <Badge id="t">x</Badge>],
  ['Chip', <Chip id="t">x</Chip>],
  ['Dot', <Dot id="t" />],
  ['Stat', <Stat id="t" icon="bolt" label="l" value="v" />],
  ['ProgressBar', <ProgressBar id="t" label="l" value={1} />],
  ['SectionHeader', <SectionHeader id="t" title="x" />],
  ['Callout', <Callout id="t">x</Callout>],
  ['ResultRow', <ResultRow id="t" status="pass" title="x" />],
  ['Message', <Message id="t">x</Message>],
  ['EmptyState', <EmptyState id="t" title="x" />],
  ['CheckList', <CheckList id="t" items={['a']} />],
  ['Kbd', <Kbd id="t">x</Kbd>],
  ['Card.Media', <Card.Media id="t" />],
  ['Card.Footer', <Card.Footer id="t">x</Card.Footer>],
  ['Tabs', <Tabs id="t" label="l" items={[{ id: 'a', label: 'A' }]} value="a" />],
  ['TabPanel', <TabPanel id="t" active>x</TabPanel>],
  ['SegmentedControl', <SegmentedControl id="t" label="l" options={[{ value: 'a', label: 'A' }]} value="a" onChange={() => {}} />],
  ['Menu', <Menu id="t" label="l" items={[]} trigger={(p) => <button type="button" {...p}>m</button>} />],
  ['Dialog', <Dialog id="t" open onClose={() => {}} title="x" />],
  ['FullScreen', <FullScreen id="t" open onClose={() => {}} label="x">x</FullScreen>],
  ['Breadcrumbs', <Breadcrumbs id="t" items={[{ label: 'a' }]} />],
  ['StatusBar', <StatusBar id="t" />],
  ['StatusBar.Item', <StatusBar.Item id="t">x</StatusBar.Item>],
  ['MetricTile', <MetricTile id="t" label="l" value="v" />],
  ['Avatar', <Avatar id="t" name="Ada" />],
  ['EditorTabs', <EditorTabs id="t" tabs={[{ id: 'a', label: 'a.ts' }]} activeId="a" onSelect={() => {}} />],
  ['Countdown', <Countdown id="t" seconds={5} />],
  ['FileTree', <FileTree id="t" label="l" nodes={[{ path: 'a.ts', kind: 'file' }]} onOpen={() => {}} />],
  ['Workbench', <Workbench id="t" main={null} />],
];

describe('native props', () => {
  it.each(CASES)('%s forwards id and data-* to its root', (_name, el) => {
    render(cloneElement(el, { 'data-x': '1' } as never));
    const node = document.getElementById('t');
    expect(node).not.toBeNull();
    expect(node).toHaveAttribute('data-x', '1');
  });

  it('TextField merges a caller aria-describedby with its error message', () => {
    render(
      <>
        <p id="help">Use your work email</p>
        <TextField label="Email" aria-describedby="help" error="Required" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Use your work email Required');
  });
  it('TextField keeps a caller aria-describedby when there is no error', () => {
    render(
      <>
        <p id="help">Use your work email</p>
        <TextField label="Email" aria-describedby="help" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Use your work email');
  });
});
