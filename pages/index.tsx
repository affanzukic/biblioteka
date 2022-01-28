import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { fetchAudioData, fetchImage } from "../utils/firebase/firebaseStorage";
import Navbar from "../components/Navbar";
import BookPreviewAudio from "../components/BookPreviewAudio";
import BookPreviewImage from "../components/BookPreviewImage";
import AOS from "aos";
import "aos/dist/aos.css";
import { copyFile } from "fs";

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
            className="flex justify-center content-center mt-8 mx-auto"
          >
            <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">
              Online biblioteka Četvrte gimnazije
            </h1>
          </div>
          <div
            id="description"
            className="flex flex-col mt-8 justify-center content-center mx-auto"
          >
            <p className="text-center font-semibold text-xl underline">
              Dobro došli u online biblioteku Četvrte gimnazije Ilidža!
            </p>
            <p className="text-center font-semibold text-xl mt-2 italic">
              Da bi započeli svoju avanturu u našoj biblioteci, molimo izaberite
              tip knjige koji želite iznad u navigacijskoj traci.
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
            <p className="mt-4 font-semibold text-xl">Audio knjige</p>
            <div
              id="audio-latest"
              className="flex flex-row flex-wrap my-12 justify-center content-center space-y-6 space-x-6 p-4 rounded-lg dark:bg-gray-800 bg-gray-200"
            >
              {audioData !== undefined
                ? // @ts-ignore
                  audioData?.map((data, idx) => {
                    return (
                      <div data-aos="fadeIn" key={idx}>
                        <BookPreviewAudio
                          // @ts-ignore
                          aosData="fadeIn"
                          // @ts-ignore
                          bookData={data}
                          key={idx}
                        />
                      </div>
                    );
                  })
                : null}
            </div>
            <p className="mt-4 font-semibold text-xl">Slikovne knjige</p>
            <div
              id="image-latest"
              className="flex flex-row flex-wrap my-12 justify-center content-center space-y-6 space-x-6 p-4 rounded-lg dark:bg-gray-800 bg-gray-200"
            >
              {imageData !== undefined
                ? // @ts-ignore
                  imageData?.map((data, idx) => {
                    return (
                      <div data-aos="fadeIn" key={idx}>
                        <BookPreviewImage
                          // @ts-ignore
                          aosData="fadeIn"
                          // @ts-ignore
                          bookData={data}
                          key={idx}
                        />
                      </div>
                    );
                  })
                : null}
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
