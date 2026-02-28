import './assets/main.css'
import './assets/base.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeProvider'

console.log('Renderer starting...');

window.onerror = (msg, url, line, col, error) => {
  console.error('RENDERER ERROR:', { msg, url, line, col, error });
  alert(`Renderer Error: ${msg}`);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
