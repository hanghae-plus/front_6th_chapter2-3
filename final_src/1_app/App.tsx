import React from 'react';

import { PostsManagerPage } from '@/pages';
import { Footer, Header } from '@/widgets';

/**
 * 메인 애플리케이션 컴포넌트
 *
 * FSD Best Practice:
 * - 레이아웃 구조만 담당
 * - 비즈니스 로직 제외
 * - 위젯과 페이지 조합
 * - 반응형 디자인 적용
 */
export const App: React.FC = () => {
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
