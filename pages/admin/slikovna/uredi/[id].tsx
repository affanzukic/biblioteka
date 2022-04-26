import { memo, useState, useEffect, SyntheticEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import AOS from "aos";
import { fetchImageBook } from "../../../../utils/firebase/public/firestore";
import { DocumentData } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/clientApp";

import "aos/dist/aos.css";
interface ImageData {
  title: string;
  description: string;
  author: string;
  language: string;
  publisher: string;
  imageFiles: FileList | null;
  coverFile: File | null;
}

const Id = memo(() => {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [coverURL, setCoverURL] = useState("");
  const [imagesURL, setImagesURL] = useState<string[] | undefined>(undefined);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
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
      fetchImageBook(id).then((dataToSet) => setData(dataToSet));
    }
  }, [id]);
  useEffect(() => {
    async function fetch() {
      let URLArray: string[] = [];
      data?.imageFiles.forEach(async (file: string) => {
        const url = await getDownloadURL(ref(storage, `image/${id}/${file}`));
        URLArray = [...URLArray, url];
      });
      const curl = await getDownloadURL(
        ref(storage, `image/${id}/${data?.coverFile}`)
      );
      setCoverURL(curl);
      setImagesURL(URLArray);
    }
    if (data !== undefined) fetch()
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
        id="admin-image-edit"
        className={darkMode ? "dark flex flex-col" : "flex flex-col"}
      >
        <Head>
          <title>
            Online biblioteka - Admin management - Uredi slikovnu knjigu
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
                    onClick={() => router.push("/admin/slikovna")}
                    type="button"
                    disabled={loading}
                  >
                    Nazad
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default Id;
