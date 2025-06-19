import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home";
import PrivacyNoticePage from "@/pages/privacy-notice";
import Footer from "@/components/footer";
import Header from "@/components/navbar";
import { BeamsBackground } from "./components/beams-background";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <BeamsBackground intensity="medium">
      <div className="flex flex-col min-h-screen text-white">
        <Header />

        <main className="flex-grow flex items-center justify-center">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-notice" element={<PrivacyNoticePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BeamsBackground>
  );
}

export default App;
