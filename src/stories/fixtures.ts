import type { FileNode, UmlEdge, UmlNode } from '../index';

export const LONG_WORD = 'AbstractSingletonProxyFactoryBeanConfigurationRegistryImplementation';
export const LONG_PATH = 'src/internal/very/long/package/name/with/many/segments/AbstractSingletonProxyFactoryBean.ts';

export const FILES: FileNode[] = [
  { path: 'src/ParkingLot.ts', kind: 'file', modified: true },
  { path: 'src/models/Car.ts', kind: 'file' },
  { path: 'src/models/Spot.ts', kind: 'file' },
  { path: 'tests/parking.test.ts', kind: 'file', readOnly: true },
  { path: 'README.md', kind: 'file', readOnly: true },
  { path: LONG_PATH, kind: 'file' },
];


export const STRATEGY_NODES: UmlNode[] = [
  { id: 'ctx', name: 'PricingContext', attributes: ['- strategy: Strategy'], methods: ['+ price(hours): Money'], emphasis: 'strong' },
  { id: 'strat', name: 'Strategy', stereotype: 'interface', methods: ['+ compute(hours): Money'], emphasis: 'brand' },
  { id: 'hourly', name: 'HourlyStrategy', methods: ['+ compute(hours): Money'] },
  { id: 'daily', name: 'DailyStrategy', methods: ['+ compute(hours): Money'] },
];
export const STRATEGY_EDGES: UmlEdge[] = [
  { from: 'ctx', to: 'strat', kind: 'aggregation', fromMultiplicity: '1', toMultiplicity: '1' },
  { from: 'hourly', to: 'strat', kind: 'realization' },
  { from: 'daily', to: 'strat', kind: 'realization' },
];
