import { DocumentData } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/clientApp";
import Navbar from "../../../../components/Navbar";
import { fetchAudioBook } from "../../../../utils/firebase/public/firestore";
import AOS from "aos";
import "aos/dist/aos.css";
import AudioPlayer from "../../../../components/AudioPlayer";

async function fetchAudioFile(id: String | String[], audioFile: String) {
  const aurl = await getDownloadURL(ref(storage, `audio/${id}/${audioFile}`));
  return aurl;
}

async function fetchCoverFile(id: String | String[], coverFile: String) {
  const curl = await getDownloadURL(ref(storage, `audio/${id}/${coverFile}`));
  return curl;
}

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [coverURL, setCoverURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [playerPlaying, setPlayerPlaying] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    if (id !== undefined) {
      // @ts-ignore
      fetchAudioBook(id)
        // @ts-ignore
        .then((res) => setData(res))
        .catch((err) => console.log(err));
    }
    if (id !== undefined && data?.audioFile !== undefined) {
      fetchAudioFile(id, data?.audioFile)
        .then((data) => setAudioURL(data))
        .catch((err) => console.log(err));
    }
    if (id !== undefined && data?.coverFile !== undefined) {
      fetchCoverFile(id, data?.coverFile)
        .then((data) => setCoverURL(data))
        .catch((err) => console.log(err));
    }
  }, [id, data?.coverFile, data?.audioFile]);
  return (
    <div
      id="audio-book"
      className={darkMode ? "dark flex flex-col" : "flex flex-col"}
    >
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="mt-2 ml-2 h-full">
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
                className="flex flex-row mt-16 space-x-64 justify-center content-center"
                data-aos="fadeIn"
              >
                <div
                  id="cover"
                  className="p-2 dark:bg-gray-900 bg-gray-400 rounded-lg"
                >
                  {coverURL !== "" && <img src={coverURL} alt="cover" />}
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
                <div
                  id="audio-book"
                  className="flex flex-col justify-center content-center px-auto"
                >
                  <h2 className="uppercase font-bold text-center">
                    Audio knjiga
                  </h2>
                  <button
                    className="mt-8 bg-green-600 px-4 py-2 rounded-md text-white disabled:text-gray-400 disabled:bg-green-900 text-center transition duration-300 hover:bg-green-900"
                    disabled={playerPlaying}
                    onClick={() => setPlayerPlaying(true)}
                  >
                    Pokreni audio knjigu
                  </button>
                </div>
              </div>
              {playerPlaying ? (
                <AudioPlayer audioURL={audioURL} title={data?.title} />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
