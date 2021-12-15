import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface StyleProps {
  darkMode: Boolean
}

export default function Index({darkMode}: StyleProps) {
  const [loading, setLoading] = useState<boolean>(true);
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
    darkMode = JSON.parse(localStorage.getItem("currentUser") ||"{}").darkMode
  }
  
  return {
    props: {
      darkMode
    }
  }
}
