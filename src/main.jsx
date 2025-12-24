import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Keep this so Tailwind still loads
import App from './App.jsx'

// --- NUCLEAR OVERRIDE START ---
// This forces the element to ignore any stubborn CSS
const rootElement = document.getElementById('root');
const bodyElement = document.body;

if (rootElement && bodyElement) {
  // 1. Force Body
  bodyElement.style.margin = '0';
  bodyElement.style.padding = '0';
  bodyElement.style.width = '100vw';
  bodyElement.style.display = 'block'; // Stops centering
  
  // 2. Force Root (The Blue Box)
  rootElement.style.width = '100%';
  rootElement.style.maxWidth = 'none'; // Kills the restriction
  rootElement.style.margin = '0';
  rootElement.style.padding = '0';
  rootElement.style.boxSizing = 'border-box';
}
// --- NUCLEAR OVERRIDE END ---

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)