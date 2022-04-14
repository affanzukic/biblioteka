import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/clientApp";
import { useRouter } from "next/router";
import AOS from "aos";
import "aos/dist/aos.css";

interface AudioData {
  bookData: {
    id: string;
    data: {
      title: string;
      description: string;
      publisher: string;
      audioFile: string;
      coverFile: string;
    };
  };
}

export default function BookPreviewAudio(data: AudioData, aosData: string) {
  const router = useRouter();
  const [coverURL, setCoverURL] = useState("");
  const { bookData } = data;
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    async function fetch() {
      // @ts-ignore
      const curl = await getDownloadURL(
        ref(storage, `audio/${bookData.id}/${bookData.data.coverFile}`)
      );
      setCoverURL(curl);
    }
    fetch();
  }, [bookData]);
  return (
    <div
      id="book-preview"
      className="flex flex-col w-max mx-auto rounded-lg dark:bg-gray-900 bg-gray-400 p-2"
      onClick={() => router.push(`/biblioteka/audio/${bookData.id}`)}
      style={{ cursor: "pointer" }}
      data-aos={aosData}
    >
      <div id="cover" data-aos={aosData}>
        {coverURL !== "" && <img src={coverURL} alt="cover" />}
      </div>
      <div id="title" className="mt-2">
        <p className="text-center font-bold">{bookData.data.title}</p>
      </div>
    </div>
  );
}
