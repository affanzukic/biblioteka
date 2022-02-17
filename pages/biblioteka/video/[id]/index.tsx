import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { DocumentData } from "firebase/firestore";
import { fetchVideoBook } from "../../../../utils/firebase/public/firestore";
import AOS from "aos";
import "aos/dist/aos.css";
import { storage } from "../../../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../../../../components/Navbar";

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    if (id !== undefined) {
      // @ts-ignore
      fetchVideoBook(id)
        .then((videoData) => setData(videoData))
        .catch((err) => console.log(err));
    }
    async function fetchData() {
      if (id !== undefined && data?.coverFile !== undefined) {
        const curl = await getDownloadURL(
          ref(storage, `video/${id}/${data?.coverFile}`)
        );
        setCoverUrl(curl);
      }
      if (id !== undefined && data?.videoFile !== undefined) {
        const vurl = await getDownloadURL(
          ref(storage, `video/${id}/${data?.videoFile}`)
        );
        setVideoUrl(vurl);
      }
    }
    fetchData();
  }, [id, data?.coverFile, data?.videoFile]);
  return (
    <div
      id="videos"
      className={darkMode ? "dark flex flex-col" : "flex flex-col"}
    >
      <Navbar />
      <Head>
        {data !== undefined ? (
          <title>Online biblioteka - {data.title}</title>
        ) : (
          <title>Online biblioteka</title>
        )}
      </Head>
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2 h-full flex flex-col">
          {data !== undefined ? (
            <>
              <div
                id="title"
                className="flex flex-row content-center justify-center mt-8 mx-auto"
                data-aos="fadeIn"
              >
                <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">
                  {data?.title}
                </h1>
              </div>
              <div
                id="content"
                className="flex flex-row mt-16 space-x-64 justify-evenly content-center"
                data-aos="fadeIn"
              >
                <div
                  id="cover"
                  className="p-2 dark:bg-gray-900 bg-gray-400 rounded-lg"
                >
                  {coverUrl !== "" && <img src={coverUrl} alt="cover" />}
                  <p className="mt-2 text-center">Cover</p>
                </div>
                <div
                  id="info"
                  className="flex flex-col space-y-8 justify-center content-center"
                >
                  <div id="publisher">
                    <h2 className="uppercase font-bold">
                      Izdavač i godina izdanja
                    </h2>
                    <p>{data?.publisher}</p>
                  </div>
                  <div id="description">
                    <h2 className="uppercase font-bold">Kratki opis</h2>
                    <p>{data?.description}</p>
                  </div>
                </div>
              </div>
              <div id="video" className="flex flex-col content-center justify-center space-y-8 mt-16 pb-8 mx-auto">
                    <h2 className="uppercase mx-auto font-bold">Video</h2>
                <video src={videoUrl} controls width="600px" height="300px" />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
