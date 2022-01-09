import { useState, useEffect } from "react";
import Head from "next/head";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
  }, []);
  return (
    <>
      <div id="admin-audio" className={darkMode ? "dark flex" : "flex"}>
        <Head>
          <title>
            Online biblioteka - Admin management - Uredi audio biblioteku
          </title>
        </Head>
        <AdminSidebar />
        <div className="content-container">
          <div className="content-list mt-4">
            <div id="title">
              <h1 className="text-xl font-bold">Uredi audio biblioteku</h1>
            </div>
            <div id="description"></div>
          </div>
        </div>
      </div>
    </>
  );
}
