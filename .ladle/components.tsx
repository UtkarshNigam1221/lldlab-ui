import type { GlobalProvider } from '@ladle/react';
import './ladle.css';

export const Provider: GlobalProvider = ({ children }) => <div className="min-h-screen bg-surface p-space-md text-on-surface">{children}</div>;
