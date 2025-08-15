import React from 'react';

import { PostsManagerPage } from '@/pages';
import { Footer, Header } from '@/widgets';

export const App = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container mx-auto px-4 py-8'>
        <PostsManagerPage />
      </main>
      <Footer />
    </div>
  );
};
