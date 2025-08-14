import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { App, AppProvider } from '@/app';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
