import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DialogPortal } from '@/shared/utils';
import { queryClient } from '@/shared/api';
import { PostsManagerPage } from '@/pages/home';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-grow container mx-auto px-4 py-8'>
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
        <DialogPortal />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
