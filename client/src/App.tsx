import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home';
import PrivacyNoticePage from '@/pages/privacy-notice'; 
import Footer from '@/components/footer'; 
import Header from '@/components/navbar'; 
import { BeamsBackground } from './components/beams-background'; 

function App() {
  return (
    <BeamsBackground intensity="medium">
      <div className="flex flex-col min-h-screen text-white">
        <Header /> 
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-notice" element={<PrivacyNoticePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BeamsBackground>
  );
}

export default App;
