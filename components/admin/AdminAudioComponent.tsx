import { useState, useEffect, MouseEventHandler } from "react";
import { storage } from "../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";

interface AudioData {
  id: string;
  data: {
    title: string;
    publisher: string;
    description: string;
    audioFile: string;
    coverFile: string;
    author: string;
    language: string;
  };
}

interface DataProps {
  data: AudioData;
  index: number;
  handleDelete: MouseEventHandler<HTMLButtonElement>;
}

export default function AdminAudioComponent({
  data,
  index,
  handleDelete,
}: DataProps) {
  const [coverURL, setCoverURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  useEffect(() => {
    async function fetch() {
      // @ts-ignore
      const aurl = await getDownloadURL(
        ref(storage, `audio/${data.id}/${data.data.audioFile}`)
      );
      // @ts-ignore
      const curl = await getDownloadURL(
        ref(storage, `audio/${data.id}/${data.data.coverFile}`)
      );
      setCoverURL(curl);
      setAudioURL(aurl);
    }
    fetch();
  }, [data]);
  return (
      <div
        id={`audio-container-${data.id}`}
        className="flex flex-col w-full h-full rounded-lg dark:bg-gray-900 bg-gray-200"
      >
        <div
          id={`audio-index-${data.id}`}
          className="flex px-4 py-2 dark:bg-gray-900 bg-gray-400 rounded-t-lg"
        >
          <p className="font-bold">{index + 1}.</p>
        </div>
        <div
          id="content"
          className="flex flex-row rounded-b-lg space-x-32 px-4 py-4 justify-around dark:bg-gray-800 bg-gray-200"
        >
          <div id="image" className="flex justify-center content-center">
            {coverURL !== "" && <img src={coverURL} width="300vw" height="300vh" alt="cover photo" />}
          </div>
          <div id="data" className="flex flex-col space-y-8 w-[20vw]">
            <div id="title">
              <p className="uppercase font-bold">Naslov</p>
              <p>{data.data.title}</p>
            </div>
            <div id="publisher">
              <p className="uppercase font-bold">Izdavač i godina izdanja</p>
              <p>{data.data.publisher}</p>
            </div>
            <div id="author">
              <p className="uppercase font-bold">Autor</p>
              <p>{data.data.author === "" ? "-" : data.data.author}</p>
            </div>
            <div id="language">
              <p className="uppercase font-bold">Jezik</p>
              <p>{data.data.language === "" ? "-" : data.data.language}</p>
            </div>
            <div id="description">
              <p className="uppercase font-bold">Deskripcija</p>
              <p>{data.data.description}</p>
            </div>
          </div>
          <div
            id="audio"
            className="flex flex-col justify-center content-center -mt-14"
          >
            <p className="uppercase font-bold">Audio fajl</p>
            {audioURL !== "" && (
              <audio className="mt-4 p-2 rounded-full bg-gray-800" controls>
                <source src={audioURL} />
              </audio>
            )}
            <button
              className="mt-10 bg-red-600 px-4 py-2 rounded-md text-white"
              onClick={handleDelete}
            >
              Izbriši
            </button>
          </div>
        </div>
      </div>
  );
}
