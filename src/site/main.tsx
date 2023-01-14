import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App.js';

const container = document.getElementById('root');
if (!container) throw new Error('No root container found');

const root = createRoot(container);
root.render(<App />);
