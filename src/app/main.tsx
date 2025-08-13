import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ReactQueryProvider from './provider/ReactQueryProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <ReactQueryProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ReactQueryProvider>
);
