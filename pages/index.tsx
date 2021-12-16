import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface StyleProps {
  darkMode: Boolean
}

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(true)
  let loadingTitle: String | JSX.Element = ""
  const router = useRouter();
  useEffect(() => {
    try {
      if (
        Object.keys(JSON.parse(localStorage.getItem("currentUser") || "{}"))
          .length === 0
      ) {
        router.push("/login");
      } else {
        setDarkMode(JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode)
        setLoading(false);
      }
    } catch (err) {
      throw new Error("Error parsing JSON");
    }
  }, [router]);
  return <div>{loading ? loadingTitle : <Content darkMode={darkMode} />}</div>;
}

function Content({darkMode}: StyleProps) {
  return (
    <div id="home" className={darkMode ? "dark" : ""}>
      <Navbar />
      <div className="content">
        <h1>Početna stranica</h1>
      </div>
    </div>
  );
}

export function getStaticProps() {
  let darkMode = true;

  if (typeof window !== "undefined") {
    console.log()
  }
  
  return {
    props: {
      darkMode
    }
  }
}
