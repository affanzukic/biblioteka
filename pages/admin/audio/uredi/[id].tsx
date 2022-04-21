import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { fetchAudioBook } from "../../../../utils/firebase/public/firestore";
import { DocumentData } from "firebase/firestore";

export default function Id() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  useEffect(() => {
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
      // @ts-ignore
      fetchAudioBook(id).then(dataToSet => setData(dataToSet))
  }, [id]);
  return (
    <>
      <div
        id="admin-audio-edit"
        className={darkMode ? "dark flex flex-col" : "flex flex-col"}
      >
        <Head>
          <title>
            Online biblioteka - Admin management - Uredi audio knjigu
          </title>
        </Head>
        <AdminSidebar />
        <div className="content-container">
          <div className="content-list mt-4">
            <div id="title">
              {data !== undefined && (
                <h1 className="text-xl font-bold">
                  Uredi audio knjigu - {data.id}
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
