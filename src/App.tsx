import { BrowserRouter as Router } from 'react-router-dom';

import AdminPage from './pages/AdminPage.tsx';
import { ErrorToast } from './shared/ui/ErrorToast/ErrorToast.tsx';
import { Header, Footer } from './widgets';

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
      <ErrorToast />
    </Router>
  );
};

export default App;
