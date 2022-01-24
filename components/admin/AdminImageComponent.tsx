import { MouseEventHandler, useState, useEffect } from "react";
import { storage } from "../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";
import AOS from "aos";
import "aos/dist/aos.css";

interface ImageData {
  id: string;
  data: {
    title: string;
    publisher: string;
    description: string;
    coverFile: string;
    imageFiles: string[];
  };
}

interface DataProps {
  data: ImageData;
  index: number;
  handleDelete: MouseEventHandler<HTMLButtonElement>;
}

export default function AdminImageComponent({
  data,
  index,
  handleDelete,
}: DataProps) {
  const [coverURL, setCoverURL] = useState<string | null>(null);
  const [imagesURL, setImagesURL] = useState<Array<string> | null>([]);
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    async function fetch() {
      let URLArray: string[] = [];
      data.data.imageFiles.forEach(async (file) => {
        const url = await getDownloadURL(
          ref(storage, `image/${data.id}/${file}`)
        );
        URLArray = [...URLArray, url];
      });
      const curl = await getDownloadURL(
        ref(storage, `image/${data.id}/${data.data.coverFile}`)
      );
      setCoverURL(curl);
      setImagesURL(URLArray);
    }
    fetch();
  }, [data]);
  return (
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
        id="content-data"
        className="flex flex-row space-x-32 px-4 py-4 justify-around dark:bg-gray-800 bg-gray-200"
      >
        <div id="cover">
          {coverURL !== null && <img src={coverURL} alt="cover photo" />}
        </div>
        <div id="data" className="flex flex-col space-y-8">
          <div id="title">
            <p className="uppercase font-bold">Naslov</p>
            <p>{data.data.title}</p>
          </div>
          <div id="publisher">
            <p className="uppercase font-bold">Izdavač i godina izdanja</p>
            <p>{data.data.publisher}</p>
          </div>
          <div id="description">
            <p className="uppercase font-bold">Deskripcija</p>
            <p>{data.data.description}</p>
          </div>
          <div id="delete-button">
            <button
              className="mt-10 bg-red-600 px-4 py-2 rounded-md text-white"
              onClick={handleDelete}
            >
              Izbriši
            </button>
          </div>
        </div>
      </div>
      <div id="content-images" className="flex flex-col rounded-b-lg">
        <div
          id="description"
          className="px-4 py-2 dark:bg-gray-900 bg-gray-400 rounded-t-lg"
        >
          <p className="font-bold">Slikovni sadržaj</p>
        </div>
        <div
          id="images"
          className="flex flex-col rounded-b-lg px-4 py-4 space-y-4"
        >
          {imagesURL?.length !== 0
            ? imagesURL?.map((img, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex flex-col content-center justify-center items-center space-y-4 mb-4"
                  >
                    <img
                      src={img}
                      alt="image"
                      key={idx}
                      width="25%"
                      height="25%"
                    />
                    <p className="text-center">{idx + 1}. slika</p>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
