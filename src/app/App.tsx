import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateMessage from "../pages/CreateMessage";
import ViewMessage from "../pages/ViewMessage";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate a 2-second loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateMessage />} />
        <Route path="/view" element={<ViewMessage />} />
      </Routes>
    </Router>
  );
}