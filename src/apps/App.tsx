import { BrowserRouter as Router } from 'react-router-dom';

import PostsManagerPage from '../pages/PostsManagerPage';
import Footer from '../widgets/Footer';
import Header from '../widgets/Header';

const App = () => {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <PostsManagerPage />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
