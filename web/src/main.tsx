import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { applyTheme } from './lib/theme';

applyTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
