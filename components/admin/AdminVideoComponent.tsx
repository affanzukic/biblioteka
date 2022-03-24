import { useState, useEffect, MouseEventHandler } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { storage } from "../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";

interface IVideoData {
  title: string;
  description: string;
  publisher: string;
  coverFile: string;
  videoFile: string;
  author: string;
  language: string;
}

interface IVideoProps {
  id: string;
  data: IVideoData;
  index: number;
  handleDelete: MouseEventHandler<HTMLButtonElement>;
}

export default function AdminVideoComponent({
  id,
  data,
  index,
  handleDelete,
}: IVideoProps) {
  const [coverUrl, setCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    async function fetchFiles() {
      // @ts-ignore
      const vurl = await getDownloadURL(
        ref(storage, `video/${id}/${data.videoFile!}`)
      );
      // @ts-ignore
      const curl = await getDownloadURL(
        ref(storage, `video/${id}/${data.coverFile}`)
      );
      setCoverUrl(curl);
      setVideoUrl(vurl);
    }
    fetchFiles();
  }, [id, data.coverFile, data.videoFile]);
  return (
    <>
      <div
        id="container"
        className="flex flex-col w-full h-full rounded-lg dark:bg-gray-900 bg-gray-200"
        data-aos="fadeIn"
      >
        <div
          id="index"
          className="flex px-4 py-2 dark:bg-gray-900 bg-gray-400 rounded-t-lg"
        >
          <p className="font-bold">{index + 1}.</p>
        </div>
        <div
          id="content"
          className="flex flex-row rounded-b-lg space-x-32 px-4 py-4 justify-around dark:bg-gray-800 bg-gray-200"
        >
          <div id="image">
            {coverUrl !== "" && <img src={coverUrl} alt="cover photo" />}
          </div>
          <div id="data" className="flex flex-col space-y-8">
            <div id="title">
              <p className="uppercase font-bold">Naslov</p>
              <p>{data.title}</p>
            </div>
            <div id="publisher">
              <p className="uppercase font-bold">Izdavač i godina izdanja</p>
              <p>{data.publisher}</p>
            </div>
            <div id="author">
              <p className="uppercase font-bold">Autor</p>
              <p>{data.author}</p>
            </div>
            <div id="language">
              <p className="uppercase font-bold">Jezik</p>
              <p>{data.language}</p>
            </div>
            <div id="description">
              <p className="uppercase font-bold">Deskripcija</p>
              <p>{data.description}</p>
            </div>
          </div>
          <div
            id="audio"
            className="flex flex-col justify-center content-center -mt-14"
          >
            <p className="uppercase font-bold">Video fajl</p>
            {videoUrl !== "" && (
              <video
                className="mt-4 p-2 bg-gray-800"
                width="300px"
                height="150px"
                controls
                src={videoUrl}
              />
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
    </>
  );
}
