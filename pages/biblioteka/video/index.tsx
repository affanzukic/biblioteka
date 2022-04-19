import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../../../components/Navbar";
import { fetchVideo } from "../../../utils/firebase/firebaseStorage";
import BookPreviewVideo from "../../../components/BookPreviewVideo";
import { DocumentData } from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Index() {
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    async function fetchData() {
      const videoData = await fetchVideo();
      setData(videoData);
    }
    fetchData();
  }, []);
  return (
    <div
      id="video"
      className={darkMode ? "dark flex flex-col" : "flex flex-col"}
    >
      <Navbar />
      <Head>
        <title>Online biblioteka - Video biblioteka</title>
      </Head>
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2">
          <div
            id="title"
            className="flex justify-center content-center mt-8 mx-auto"
          >
            <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">
              Video biblioteka
            </h1>
          </div>
          <div
            id="data"
            className="grid sm:grid-cols-3 md:grid-cols-6 grid-cols-2 gap-8 mt-12 justify-center content-center mx-auto px-6"
            data-aos="fadeIn"
          >
            {data !== undefined ? (
              data!.length !== 0 ? (
                // @ts-ignore
                data?.map((data, idx) => {
                  return (
                    <div data-aos="fadeIn" key={idx}>
                      <BookPreviewVideo
                        bookData={data}
                        // @ts-ignore
                        aosData="fadeIn"
                        key={idx}
                      />
                    </div>
                  );
                })
              ) : (
                <p>Trenutno nema sadržaja!</p>
              )
            ) : null}
          </div>
          <div
            id="copyright"
            className="flex flex-row justify-content content-center bottom-0 mt-8 mb-4"
          >
            <p className="italic text-center mx-auto">
              {new Date().getFullYear()}&copy; Četvrta gimnazija Ilidža. Sva
              prava rezervisana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
