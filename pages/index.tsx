import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import {
  fetchAudioData,
  fetchImage,
  fetchVideo,
} from "../utils/firebase/firebaseStorage";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import AllBooksPreview from "../components/AllBooksPreview";

interface StyleProps {
  darkMode: Boolean;
}

export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(true);
  let loadingTitle: String | JSX.Element = "";
  const router = useRouter();
  useEffect(() => {
    try {
      if (
        Object.keys(JSON.parse(localStorage.getItem("currentUser") || "{}"))
          .length === 0
      ) {
        router.push("/login");
      } else {
        setDarkMode(
          JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
        );
        setLoading(false);
      }
    } catch (err) {
      throw new Error("Error parsing JSON");
    }
  }, [router]);
  return <div>{loading ? loadingTitle : <Content darkMode={darkMode} />}</div>;
}

function Content({ darkMode }: StyleProps) {
  const [audioData, setAudioData] = useState<DocumentData | undefined>(
    undefined
  );
  const [imageData, setImageData] = useState<DocumentData | undefined>(
    undefined
  );
  const [videoData, setVideoData] = useState<DocumentData | undefined>(
    undefined
  );
  useEffect(() => {
    AOS.init({
      duration: 500,
    });
    fetchAudioData()
      .then((res) => {
        res?.slice(0, 5);
        setAudioData(res);
      })
      .catch((err) => console.log(err));
    fetchImage()
      .then((res) => {
        res?.slice(0, 5);
        setImageData(res);
      })
      .catch((err) => console.log(err));
    fetchVideo()
      .then((res) => {
        res?.slice(0, 5);
        setVideoData(res);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div
      id="home"
      className={darkMode ? "dark flex flex-col" : "flex flex-col"}
    >
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2">
          <div
            id="title"
            className="flex justify-center content-center mt-16 mx-auto"
          >
            <h1 className="text-6xl text-center font-bold text-shadow-xl dark:text-white text-gray-700">
              Online biblioteka &ldquo;Četvrta gimnazija&rdquo;
            </h1>
          </div>
          <div
            id="description"
            className="flex flex-col mt-8 justify-center content-center mx-auto"
          >
            <p className="text-center font-semibold text-xl mt-2 italic">
              Započnite svoju sljedeću avanturu ovdje!
            </p>
          </div>
          <div
            id="latest"
            className="flex flex-col content-center justify-center mt-24 mx-4"
            data-aos="fadeIn"
          >
            <p className="font-bold text-2xl text-shadow-lg">
              Najnovije knjige
            </p>
            <div
              id="books-latest"
              className="flex my-6 justify-start content-center p-4 rounded-lg dark:bg-gray-800 bg-gray-400 min-w-full"
            >
              <AllBooksPreview audioBooks={audioData} imageBooks={imageData} videoBooks={videoData} />
            </div>
          </div>
        </div>
        <div
          id="copyright"
          className="flex flex-row justify-content content-center bottom-0 mt-8 mb-4"
        >
          <p className="italic text-center mx-auto">
            {new Date().getFullYear()}&copy; Četvrta gimnazija Ilidža. Sva prava
            rezervisana.
          </p>
        </div>
      </div>
    </div>
  );
}
