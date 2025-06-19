import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-8xl font-bold text-gray-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-500 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-400 mb-8">
        The page you're looking for doesn't exist.
      </p>

      <div className="flex gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white/70 hover:bg-white/50 text-black px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Home size={20} />
          Go Home
        </Link>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 border hover:border-gray-400 text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
    </div>
  );
}
