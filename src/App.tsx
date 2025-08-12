/**
 * 메인 애플리케이션 컴포넌트
 *
 * 역할:
 * - 전체 애플리케이션의 레이아웃 구조를 정의하는 최상위 컴포넌트
 * - React Router를 통한 클라이언트 사이드 라우팅 설정
 * - 공통 레이아웃(Header, Main, Footer) 구성
 *
 * 로직:
 * 1. BrowserRouter로 전체 앱을 감싸서 라우팅 기능 활성화
 * 2. Flexbox를 이용한 세로 방향 전체 화면 레이아웃 구성
 *    - Header: 상단 고정
 *    - Main: 중앙 확장 영역 (flex-grow)
 *    - Footer: 하단 고정
 * 3. 반응형 컨테이너와 패딩을 통한 콘텐츠 영역 설정
 */
import { BrowserRouter as Router } from 'react-router-dom';

import Footer from '@/components/Footer.tsx';
import Header from '@/components/Header.tsx';
import PostsManagerPage from '@/pages/PostsManagerPage.tsx';

const App = () => {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-grow container mx-auto px-4 py-8'>
          <PostsManagerPage />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
