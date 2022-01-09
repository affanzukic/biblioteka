import Navbar from "../../../components/Navbar";
import { useEffect, useState } from "react";

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
  }, []);
  return (
    <div id="slikovna-biblioteka" className={darkMode ? "dark" : ""}>
      <Navbar />
      <div className="content">
        <h1>Slikovna biblioteka</h1>
      </div>
    </div>
  );
}
