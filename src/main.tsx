import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import ReactQueryProvider from './app/provider/ReactQueryProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <ReactQueryProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ReactQueryProvider>
);
