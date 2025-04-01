import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/themeContext';
import { AuthProvider } from './context/authContext';
import { MessageProvider } from './context/MessageContext';
import { GlobalMessage } from './components/GlobalMessage';
import App from './App';

window.global ||= window;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <MessageProvider>
          <GlobalMessage />
          <App />
        </MessageProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
