import { useState, useEffect, SyntheticEvent, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { fetchAudioBook } from "../../../../utils/firebase/public/firestore";
import { DocumentData } from "firebase/firestore";
import { storage } from "../../../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";
import AOS from "aos";
import LoadingIcons from "react-loading-icons";
import { updateAudio } from "../../../../utils/firebase/firebaseStorage";

import "aos/dist/aos.css";

interface AudioData {
  title: string;
  description: string;
  author: string;
  language: string;
  publisher: string;
  audioFile: File | null;
  coverFile: File | null;
}

export default function Id() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [imgURL, setImgURL] = useState<string | undefined>(undefined);
  const [audioURL, setAudioURL] = useState<string | undefined>(undefined);
  const [showDeleteCover, setShowDeleteCover] = useState(false);
  const [showDeleteAudio, setShowDeleteAudio] = useState(false);
  const [loading, setLoading] = useState(false)
  const coverRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    AOS.init({
      duration: 200,
    });
  }, []);
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
      setAudioURL(audioUrl);
    }
    if (data !== undefined) {
      fetchData();
    }
  }, [data]);
  async function handleUpdate(event: SyntheticEvent) {
    event.preventDefault();
    const fd = new FormData(event.target as HTMLFormElement);
    const newData = Object.fromEntries(fd) as unknown;
    setLoading(true)
    await updateAudio(id as string, newData as AudioData)
    router.push("/admin/audio")
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
                    disabled={loading}
                  >
                    Ažuriraj sadržaj
                  </button>
                  <button
                    id="back-button"
                    className="cancel-button w-[10vw] px-4 py-2"
                    onClick={() => router.push("/admin/audio")}
                    type="button"
                    disabled={loading}
                  >
                    Nazad
                  </button>
                </div>
                {loading ? <div id="loading-div" data-aos="fadeInOut" className="flex justify-center content-center rounded-md h-[50vh] w-[94vw] dark:bg-gray-900 bg-gray-400">
                  <LoadingIcons.TailSpin className="my-auto" />
                </div> :
                <div
                  id="content"
                  className="flex flex-col sm:flex-row space-x-16 space-y-8 sm:space-y-0 justify-evenly py-8 content-center min-h-[50vh] h-fit w-[94vw] mt-10 dark:bg-gray-900 bg-gray-400 p-4 rounded-md"
                >
                  <div
                    id="cover-photo"
                    className="flex flex-col justify-center content-center flex-shrink-0 space-y-4 my-auto"
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
                      className="text-left sm:text-center bg-green-600 text-white rounded-md px-2 py-1"
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
                          setShowDeleteCover(true);
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
                          onClick={() => {
                            // @ts-ignore
                            coverRef?.current?.value = null;
                            setShowDeleteCover(false);
                          }}
                        >
                          Izbriši novi cover
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    id="book-data"
                    className="flex flex-col space-y-2 w-[40vw]"
                  >
                    <div id="book-title" className="flex flex-col space-y-1">
                      <label htmlFor="title">Naslov</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={data?.title}
                        className="admin-input px-2 py-1"
                      />
                    </div>
                    <div id="book-author" className="flex flex-col space-y-1">
                      <label htmlFor="author">Autor</label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        defaultValue={data?.author}
                        className="admin-input px-2 py-1"
                      />
                    </div>
                    <div
                      id="book-publisher"
                      className="flex flex-col space-y-1"
                    >
                      <label htmlFor="publisher">Izdavač</label>
                      <input
                        type="text"
                        id="publisher"
                        name="publisher"
                        defaultValue={data?.publisher}
                        className="admin-input px-2 py-1"
                      />
                    </div>
                    <div id="book-language" className="flex flex-col space-y-1">
                      <label htmlFor="language">Jezik</label>
                      <select
                        id="language"
                        name="language"
                        defaultValue={data?.language}
                        className="admin-input px-2 py-1"
                      >
                        <option value="Bosanski">Bosanski</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                    <div
                      id="book-description"
                      className="flex flex-col space-y-1"
                    >
                      <label htmlFor="description">Kratka deskripcija</label>
                      <textarea
                        rows={8}
                        spellCheck={false}
                        style={{ resize: "vertical", height: "auto" }}
                        id="description"
                        name="description"
                        defaultValue={data?.description}
                        className="admin-input px-2 py-1"
                      />
                    </div>
                  </div>
                  <div
                    id="book-audio"
                    className="flex flex-col justify-center content-center space-y-8"
                  >
                    <div
                      id="current-audio-file"
                      className="flex flex-col space-y-1"
                    >
                      <p className="mx-auto">Audio fajl</p>
                      {audioURL !== "" && (
                        <audio
                          className="mt-4 p-2 rounded-full bg-gray-800"
                          controls
                        >
                          <source src={audioURL} />
                        </audio>
                      )}
                    </div>
                    <div id="add-new-audio-wrapper" className="flex flex-col">
                      <button
                        id="add-new-audio"
                        className="bg-green-600 text-white rounded-md px-2 py-1"
                        onClick={() => audioRef?.current?.click()}
                      >
                        Promjeni
                      </button>
                      <input
                        type="file"
                        accept="audio/*"
                        id="audioFile"
                        name="audioFile"
                        hidden
                        onChange={(event) => {
                          if (event.target.files!.length !== 0) {
                            setShowDeleteAudio(true);
                          }
                        }}
                        ref={audioRef}
                      />
                    </div>
                    {showDeleteAudio && (
                      <div
                        id="new-audio-added"
                        className="flex flex-col space-y-1"
                        data-aos="fadeInOut"
                      >
                        <p className="mx-auto">Novi audio fajl je dodan</p>
                        <button
                          id="delete-new-audio"
                          className="bg-red-600 rounded-md px-2 py-1"
                          onClick={() => {
                            // @ts-ignore
                            audioRef?.current?.value = null;
                            setShowDeleteAudio(false);
                          }}
                        >
                          Izbriši novi audio fajl
                        </button>
                      </div>
                    )}
                  </div>
                </div> }
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
