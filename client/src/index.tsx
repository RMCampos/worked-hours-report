import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/themeContext';
import App from './App';

window.global ||= window;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
