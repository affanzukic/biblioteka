import { useState, useEffect, MouseEventHandler } from "react";
import { storage } from "../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";

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
  const router = useRouter();
  useEffect(() => {
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
          <div
            id="image"
            className="flex justify-center content-center w-[40vw]"
          >
            {coverUrl !== "" && (
              <img
                src={coverUrl}
                height="500vh"
                width="500vw"
                alt="cover photo"
              />
            )}
          </div>
          <div id="data" className="flex flex-col space-y-8 w-[40vw]">
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
        </div>
        <div
          id="video"
          className="flex flex-col mt-20 mx-auto p-4 justify-center content-center"
        >
          <p className="uppercase font-bold">Video fajl</p>
          {videoUrl !== "" && (
            <video
              className="mt-4 w-full h-full bg-gray-800"
              controls
              src={videoUrl}
            />
          )}
          <div
            id="buttons"
            className="flex flex-col justify-center content-center space-y-2"
          >
            <button
              id="edit"
              className="bg-green-600 px-4 py-2 rounded-md text-white mt-10"
              onClick={() =>
                router.push({
                  pathname: "/admin/video/uredi/[id]",
                  query: { id },
                })
              }
            >
              Uredi
            </button>
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
