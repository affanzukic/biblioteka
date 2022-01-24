import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import { fetchAudioData } from "../../../utils/firebase/firebaseStorage";
import BookPreviewAudio from "../../../components/BookPreviewAudio";
import AOS from "aos";
import "aos/dist/aos.css";

interface AudioData {
  title: string;
  description: string;
  publisher: string;
  audioFile: File | null;
  coverFile: File | null;
}

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<(object | AudioData)[] | undefined>(
    undefined
  );
  useEffect(() => {
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    AOS.init({
      duration: 400,
    });
    fetchAudioData()
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div
      id="audio-biblioteka"
      className={darkMode ? "dark flex flex-col" : "flex flex-col"}
    >
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2">
          <div
            id="title"
            className="flex justify-center content-center mt-8 mx-auto"
          >
            <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">
              Audio biblioteka
            </h1>
          </div>
          <div
            id="data"
            className="flex flex-row flex-wrap mt-12 justify-center content-center space-y-6 space-x-6"
            data-aos="fadeIn"
          >
            {data !== undefined
              ? data?.map((unos, idx) => {
                  return (
                    <div data-aos="fadeIn" key={idx}>
                      <BookPreviewAudio
                        aosData="fadeIn"
                        // @ts-ignore
                        bookData={unos}
                        key={idx}
                      />
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
