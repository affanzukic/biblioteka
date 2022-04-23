import { useState, useEffect, SyntheticEvent, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { fetchAudioBook } from "../../../../utils/firebase/public/firestore";
import { DocumentData } from "firebase/firestore";
import { storage } from "../../../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";
import AOS from "aos"

import "aos/dist/aos.css"

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
  const [showDeleteCover, setShowDeleteCover] = useState(false)
  const coverRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    AOS.init({
      duration: 200
    })
  }, [])
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
  async function handleUpdate(event: SyntheticEvent) {
    event.preventDefault();
    const fd = new FormData(event.target as HTMLFormElement);
    const newData = Object.fromEntries(fd);
    console.log(newData);
  }
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
            </div>
            {data !== undefined && (
              <form className="flex flex-col" onSubmit={handleUpdate}>
                <div id="buttons" className="flex flex-row space-x-2 mb-2">
                  <button
                    id="update-button"
                    className="px-4 py-2 add-button w-[10vw] text-center"
                    type="submit"
                  >
                    Ažuriraj sadržaj
                  </button>
                  <button
                    id="back-button"
                    className="cancel-button w-[10vw] px-4 py-2"
                    onClick={() => router.push("/admin/audio")}
                    type="button"
                  >
                    Nazad
                  </button>
                </div>
                <div
                  id="content"
                  className="flex flex-row space-x-16 justify-between content-center mx-auto mt-10 dark:bg-gray-800 p-4 rounded-md"
                >
                  <div
                    id="cover-photo"
                    className="flex flex-col justify-center content-center space-y-4 my-auto"
                  >
                    <img
                      src={imgURL}
                      alt="cover photo"
                      width="300vw"
                      height="100vh"
                    />
                    <button
                      id="change-cover"
                      onClick={() => coverRef?.current?.click()}
                    >
                      Promjeni
                    </button>
                    <input
                      id="coverFile"
                      name="coverFile"
                      type="file"
                      accept="image/*"
                      ref={coverRef}
                      onChange={(event) => {
                        if (event.target.files!.length !== 0) {
                          setShowDeleteCover(true)
                        }
                      }}
                      hidden
                    />
                    {showDeleteCover && (
                        <div
                          id="new-cover-added"
                          className="flex flex-col space-y-1"
                          data-aos="fadeInOut"
                        >
                          <p className="mx-auto">Novi cover je dodan</p>
                          <button
                            id="delete-new-cover"
                            className="bg-red-600 rounded-md px-2 py-1"
                            // @ts-ignore
                            onClick={() => {coverRef?.current?.value = null; setShowDeleteCover(false)}}
                          >
                            Izbriši novi cover
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
