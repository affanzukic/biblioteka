import Head from "next/head";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    async function checkIfAdmin() {
      const q = query(
        collection(db, "admins"),
        where(
          "email",
          "==",
          JSON.parse(localStorage.getItem("currentUser") || "").email
        )
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (!doc.data().email) {
          router.push("/")
        }
      });
    }
    checkIfAdmin()
  }, [router]);
  return (
    <div id="admin" className={darkMode ? "dark flex" : "flex"}>
      <Head>
        <title>Online biblioteka - Admin management</title>
      </Head>
      <AdminSidebar />
      <div className="content-container">
        <div className="content-list">
          <h1 className="font-bold uppercase text-xl my-4">
            Dobro došli na upravljačku ploču online biblioteke Četvrte gimnazije Ilidža
          </h1>
          <p>Da upravljate sadržajem, molimo koristite meni sa lijeve strane.</p>
        </div>
      </div>
    </div>
  );
}
