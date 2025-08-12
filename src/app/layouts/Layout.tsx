import { MessageSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <h1 className="text-xl font-bold">게시물 관리 시스템</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:underline">
                  홈
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  대시보드
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  설정
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-100 text-gray-600 py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Post Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
