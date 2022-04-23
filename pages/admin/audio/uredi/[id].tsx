import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { fetchAudioBook } from "../../../../utils/firebase/public/firestore";
import { DocumentData } from "firebase/firestore";
import { storage } from "../../../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";

/**
 * ! FIX EVERYTHING AFTER A MASSIVE FUCK-UP !
 */

export default function Id() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [imgURL, setImgURL] = useState<string | undefined>(undefined);
  const [audioURL, setAudioUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    if (id !== undefined) {
      // @ts-ignore
      fetchAudioBook(id).then((dataToSet) => setData(dataToSet));
    }
  }, [id]);
  useEffect(() => {
    async function fetchData() {
      const imgUrl = await getDownloadURL(
        ref(storage, `audio/${id}/${data!.coverFile}`)
      );
      const audioUrl = await getDownloadURL(
        ref(storage, `audio/${id}/${data!.audioFile}`)
      );
      setImgURL(imgUrl);
      setAudioUrl(audioUrl);
    }
    if (data !== undefined) {
      fetchData();
    }
  }, [data]);
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
                  Uredi audio knjigu - {data.title}
                </h1>
              )}
            </div>
            <div id="description">
              <p className="mb-4">
                Da spasite novi sadržaj knjige, pritisnite na dugme
                &#34;Ažuriraj sadržaj&#34;.
              </p>
              <button
                className="mb-2 mt-4 px-4 py-2 add-button"
                onClick={() => console.log("clicked")}
              >
                Ažuriraj sadržaj
              </button>
            </div>
            {data !== undefined && (
              <div
                id="content"
                className="flex flex-row space-x-16 justify-between content-center mx-auto mt-10 dark:bg-gray-800 p-4 rounded-md"
              >
                <div
                  id="cover-photo"
                  className="flex justify-center content-center my-auto"
                >
                  <img
                    src={imgURL}
                    alt="cover photo"
                    width="300vw"
                    height="100vh"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
