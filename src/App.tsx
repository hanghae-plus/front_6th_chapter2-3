import { Layout } from '@/app/layouts';
import { QueryProvider, RouterProvider } from '@/app/providers';
import PostsManagerPage from '@/pages/PostsManagerPage';

const App = () => {
  return (
    <QueryProvider devtools>
      <RouterProvider>
        <Layout>
          <PostsManagerPage />
        </Layout>
      </RouterProvider>
    </QueryProvider>
  );
};

export default App;
