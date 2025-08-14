import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'jotai';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { PostsManagerPage } from '@/pages';
import { Footer, Header } from '@/widgets';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <Router>
          <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow container mx-auto px-4 py-8'>
              <PostsManagerPage />
            </main>
            <Footer />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
