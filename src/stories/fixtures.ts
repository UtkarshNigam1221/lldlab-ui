import type { FileNode } from '../index';

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
