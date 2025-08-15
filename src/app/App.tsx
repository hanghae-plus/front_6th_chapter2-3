import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../shared/ui/layout/Header.tsx';
import Footer from '../shared/ui/layout/Footer.tsx';
import { DialogRoot } from '../widgets/dialog/DialogRoot.tsx';
import PostManagePage from '../pages/ui/PostManagePage.tsx';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <DialogRoot />
          <PostManagePage />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
