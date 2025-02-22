import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
} from "./components";

const App = () => {
  const [buttonText, setButtonText] = useState("Login");
  const clickTimeoutRef = useRef(null);

  const handleButtonClick = () => {
    // If there's already a timer, then this is the second click (double click)
    if (clickTimeoutRef.current !== null) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setButtonText("Logging");
      localStorage.removeItem("userDetails");
      window.location.href = "http://localhost:3001/";
    } else {
      // Start a timer to wait for a possible second click
      clickTimeoutRef.current = setTimeout(() => {
        setButtonText("Logging");
        localStorage.removeItem("userDetails");
        window.location.href = "http://localhost:3000/";
        clickTimeoutRef.current = null;
      }, 250); // 250ms delay to differentiate single vs. double click
    }
  };

  // New logout handler function
  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    window.location.href = "http://localhost:3003/"; // Change URL if needed
  };

  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <nav className="w-full flex items-center py-5 fixed top-0 z-20 bg-primary">
          <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-white text-[18px] font-bold cursor-pointer flex">
              Welcome, User
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handleButtonClick}
                className="bg-violet-600 py-2 px-4 rounded-md text-white hover:bg-violet-700"
              >
                {buttonText}
              </button>
              {/* Added Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 py-2 px-4 rounded-md text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        <Hero />
      </div>
      <About />
      <Experience />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
    </div>
  );
};

export default App;
