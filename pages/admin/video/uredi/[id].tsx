import { useState, useEffect, memo, SyntheticEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import LoadingIcons from "react-loading-icons";
import { fetchVideoBook } from "../../../../utils/firebase/public/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/clientApp";
import AOS from "aos";

import "aos/dist/aos.css";
import { DocumentData } from "firebase/firestore";

const Id = memo(() => {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [videoURL, setVideoURL] = useState("");
  const [coverURL, setCoverURL] = useState("");
  const [loading, setLoading] = useState(false);
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
      fetchVideoBook(id).then((dataToSet) => setData(dataToSet));
    }
  }, [id]);
  useEffect(() => {
    async function fetchData() {
      const imgUrl = await getDownloadURL(
        ref(storage, `video/${id}/${data!.coverFile}`)
      );
      const videoUrl = await getDownloadURL(
        ref(storage, `video/${id}/${data!.videoFile}`)
      );
      setCoverURL(imgUrl);
      setVideoURL(videoUrl);
    }
    if (data !== undefined) {
      fetchData();
    }
  }, [data]);
  async function handleUpdate(event: SyntheticEvent) {
    event.preventDefault();
    const fd = new FormData(event.target as HTMLFormElement);
    const newData = Object.fromEntries(fd) as unknown;
    console.log(newData);
  }
  return (
    <>
      <div
        id="admin-video-edit"
        className={darkMode ? "dark flex flex-col" : "flex flex-col"}
      >
        <Head>
          <title>
            Online biblioteka - Admin management - Uredi video knjigu
          </title>
        </Head>
        <AdminSidebar />
        <div className="content-container">
          <div className="content-list mt-4">
            <div id="title">
              {data !== undefined && (
                <h1 className="text-xl font-bold">
                  Uredi video knjigu - {data.title}
                </h1>
              )}
            </div>
            <div id="description">
              <p className="mb-4">
                Da spasite novi sadržaj knjige, pritisnite na dugme
                &#34;Ažuriraj sadržaj&#34;.
              </p>
            </div>
            {!!data && (
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
                    onClick={() => router.push("/admin/video")}
                    type="button"
                    disabled={loading}
                  >
                    Nazad
                  </button>
                </div>
                <div id="book-data" className="flex flex-col space-y-2 w-[40vw] justify-center content-center">
                  {/* TODO: add remaining video edit page */}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

Id.displayName = "Id";

export default Id;
