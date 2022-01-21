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
    <div id="slikovna-biblioteka" className={darkMode ? "dark flex flex-col" : "flex flex-col"}>
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2">
        <div id="title" className="flex justify-center content-center mt-8 mx-auto">
            <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">Slikovna biblioteka</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
