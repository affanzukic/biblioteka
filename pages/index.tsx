import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface StyleProps {
  darkMode: Boolean;
}

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(true);
  let loadingTitle: String | JSX.Element = "";
  const router = useRouter();
  useEffect(() => {
    try {
      if (
        Object.keys(JSON.parse(localStorage.getItem("currentUser") || "{}"))
          .length === 0
      ) {
        router.push("/login");
      } else {
        setDarkMode(
          JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
        );
        setLoading(false);
      }
    } catch (err) {
      throw new Error("Error parsing JSON");
    }
  }, [router]);
  return <div>{loading ? loadingTitle : <Content darkMode={darkMode} />}</div>;
}

function Content({ darkMode }: StyleProps) {
  return (
    <div
      id="home"
      className={darkMode ? "dark flex flex-col" : "flex flex-col"}
    >
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2">
          <div
            id="title"
            className="flex justify-center content-center mt-8 mx-auto"
          >
            <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">
              Online biblioteka Četvrte gimnazije
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
