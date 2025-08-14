import { BrowserRouter as Router } from 'react-router-dom';
import { DialogPortal } from '@/shared/utils';
import { PostsManagerPage } from '@/pages/home';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export function App() {
  return (
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
  );
}
