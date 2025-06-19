import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home";
import PrivacyNoticePage from "@/pages/privacy-notice";
import NotFoundPage from "./pages/not-found";
import Header from "@/components/navbar";
import Footer from "@/components/footer";
import { BeamsBackground } from "./components/beams-background";

function App() {
  return (
    <BeamsBackground intensity="medium">
      <div className="flex flex-col min-h-screen text-white">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <main className="flex-grow">
                <HomePage />
              </main>
            }
          />
          <Route
            path="/privacy-notice"
            element={
              <main className="flex-grow">
                <PrivacyNoticePage />
              </main>
            }
          />
          <Route
            path="*"
            element={
              <main className="flex-grow flex items-center justify-center">
                <NotFoundPage />
              </main>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BeamsBackground>
  );
}

export default App;
