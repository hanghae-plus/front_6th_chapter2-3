/**
 * 애플리케이션 푸터 컴포넌트
 *
 * 역할:
 * - 애플리케이션 하단의 저작권 정보 및 부가 정보를 표시하는 UI 컴포넌트
 * - 페이지의 마무리 영역으로 시각적 완성도 제공
 *
 * 로직:
 * 1. 저작권 정보 표시:
 *    - 연도와 시스템 이름을 포함한 저작권 문구
 *    - 중앙 정렬로 공식적이고 균형잡힌 느낌 연출
 *
 * 2. 스타일링:
 *    - 연한 회색 배경으로 메인 콘텐츠와 구분
 *    - 상단 마진으로 본문과의 시각적 분리
 *    - 반응형 컨테이너로 다양한 화면 크기 대응
 */
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gray-100 text-gray-600 py-4 mt-8'>
      <div className='container mx-auto text-center'>
        <p>&copy; 2023 Post Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
