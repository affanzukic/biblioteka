import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Index() {
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
  return <div>{loading ? loadingTitle : <Content />}</div>;
}

function Content() {
  return (
    <div id="home">
      <Navbar />
      <div className="content">
        <h1>Početna stranica</h1>
      </div>
    </div>
  );
}
