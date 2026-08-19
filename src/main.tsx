import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
