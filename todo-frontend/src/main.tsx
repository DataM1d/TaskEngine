import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';

const rootElemet = document.getElementById('root');

if (!rootElemet) {
  throw new Error('Failed to find the root element. Ensure there is a <div id="root"></div> in your index.html');
}

createRoot(rootElemet).render(
  <StrictMode>
    <App />
  </StrictMode>,
);