import { BrowserRouter as Router } from 'react-router-dom';

import AdminPage from './pages/AdminPage.tsx';
import Footer from './widgets/footer/ui/Footer.tsx';
import Header from './widgets/header/ui/Header.tsx';

const App = () => {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-grow container mx-auto px-4 py-8'>
          <AdminPage />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
