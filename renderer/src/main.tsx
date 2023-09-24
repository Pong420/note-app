import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/spotlight/styles.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
