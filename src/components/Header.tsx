/**
 * 애플리케이션 헤더 컴포넌트
 *
 * 역할:
 * - 애플리케이션 상단의 브랜딩과 네비게이션을 담당하는 UI 컴포넌트
 * - 사용자에게 현재 위치와 주요 기능 접근점을 제공
 *
 * 로직:
 * 1. 브랜드 영역:
 *    - MessageSquare 아이콘과 앱 제목으로 브랜드 아이덴티티 표시
 *    - 좌측 정렬로 시각적 시작점 역할
 *
 * 2. 네비게이션 영역:
 *    - 주요 페이지로의 링크 메뉴 제공 (홈, 대시보드, 설정)
 *    - 우측 정렬로 액션 영역 구분
 *    - 호버 효과로 사용자 인터랙션 피드백 제공
 *
 * 3. 레이아웃:
 *    - flexbox를 이용한 좌우 정렬 구성
 *    - 반응형 컨테이너로 다양한 화면 크기 대응
 *    - 그림자 효과로 헤더와 본문 영역 구분
 */
import React from 'react';

import { MessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className='bg-blue-600 text-white p-4 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <MessageSquare className='w-6 h-6' />
          <h1 className='text-xl font-bold'>게시물 관리 시스템</h1>
        </div>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <a href='#' className='hover:underline'>
                홈
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                대시보드
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                설정
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
