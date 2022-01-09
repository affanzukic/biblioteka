import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
  }, []);
  return (
    <div id="audio-biblioteka" className={darkMode ? "dark" : ""}>
      <Navbar />
      <div className="content">
        <h1>Audio biblioteka</h1>
      </div>
    </div>
  );
}
