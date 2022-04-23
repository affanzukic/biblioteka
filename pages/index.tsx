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
  const [audioDataBosnian, setAudioDataBosnian] = useState<
    DocumentData | undefined
  >(undefined);
  const [imageDataBosnian, setImageDataBosnian] = useState<
    DocumentData | undefined
  >(undefined);
  const [videoDataBosnian, setVideoDataBosnian] = useState<
    DocumentData | undefined
  >(undefined);
  const [audioDataEnglish, setAudioDataEnglish] = useState<
    DocumentData | undefined
  >(undefined);
  const [imageDataEnglish, setImageDataEnglish] = useState<
    DocumentData | undefined
  >(undefined);
  const [videoDataEnglish, setVideoDataEnglish] = useState<
    DocumentData | undefined
  >(undefined);
  useEffect(() => {
    AOS.init({
      duration: 500,
    });
    fetchAudioData()
      .then((res) => {
        const bosanski = res?.filter((data) => {
          // @ts-ignore
          return data.data.language === "Bosanski";
        });
        const english = res?.filter((data) => {
          // @ts-ignore
          return data.data.language === "English";
        });
        english?.slice(0, 5);
        bosanski?.slice(0, 5);
        setAudioDataBosnian(bosanski);
        setAudioDataEnglish(english);
      })
      .catch((err) => console.log(err));
    fetchImage()
      .then((res) => {
        const bosanski = res?.filter((data) => {
          // @ts-ignore
          return data.data.language === "Bosanski";
        });
        const english = res?.filter((data) => {
          // @ts-ignore
          return data.data.language === "English";
        });
        english?.slice(0, 5);
        bosanski?.slice(0, 5);
        setImageDataBosnian(bosanski);
        setImageDataEnglish(english);
      })
      .catch((err) => console.log(err));
    fetchVideo()
      .then((res) => {
        const bosanski = res?.filter((data) => {
          // @ts-ignore
          return data.data.language === "Bosanski";
        });
        const english = res?.filter((data) => {
          // @ts-ignore
          return data.data.language === "English";
        });
        english?.slice(0, 5);
        bosanski?.slice(0, 5);
        setVideoDataBosnian(bosanski);
        setVideoDataEnglish(english);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div
      id="home"
      className={
        darkMode
          ? "dark flex flex-col scrollbar-none"
          : "flex flex-col scrollbar-none"
      }
    >
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2">
          <div
            id="title"
            className="flex justify-center content-center mt-16 mx-auto px-4"
          >
            <h1 className="text-6xl text-center font-bold text-shadow-xl dark:text-white text-gray-700">
              Online biblioteka &ldquo;Četvrta gimnazija Ilidža&rdquo;
            </h1>
          </div>
          <div
            id="description"
            className="flex flex-col mt-8 justify-center content-center mx-auto"
          >
            <p className="text-center font-semibold text-xl mt-2 italic">
              Započnite svoju sljedeću avanturu ovdje sa COMICS &amp; VOICE
              LIBRARY!
            </p>
          </div>
          <div
            id="latest-bosnian"
            className="flex flex-col content-center justify-center mt-24 mx-4"
            data-aos="fadeIn"
          >
            <p className="font-bold text-2xl text-shadow-lg">
              Bosanski jezik i književnost
            </p>
            <div
              id="books-latest-bosnian"
              className="flex my-6 justify-start content-center p-4 rounded-lg dark:bg-gray-800 bg-gray-400 min-w-full"
            >
              <AllBooksPreview
                audioBooks={audioDataBosnian}
                imageBooks={imageDataBosnian}
                videoBooks={videoDataBosnian}
              />
            </div>
          </div>
          <div
            id="latest-english"
            className="flex flex-col content-center justify-center mt-6 mx-4"
            data-aos="fadeIn"
          >
            <p className="font-bold text-2xl text-shadow-lg">Engleski jezik</p>
            <div
              id="books-latest-english"
              className="flex my-6 justify-start content-center p-4 rounded-lg dark:bg-gray-800 bg-gray-400 min-w-full"
            >
              <AllBooksPreview
                audioBooks={audioDataEnglish}
                imageBooks={imageDataEnglish}
                videoBooks={videoDataEnglish}
              />
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
