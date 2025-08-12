import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/app/layouts';
import PostsManagerPage from '@/pages/PostsManagerPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <PostsManagerPage />
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
