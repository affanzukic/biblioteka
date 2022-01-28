import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/clientApp";
import AOS from "aos";
import "aos/dist/aos.css";

interface ImageData {
  bookData: {
    id: string;
    data: {
      title: string;
      description: string;
      publisher: string;
      coverFile: string;
      imageFiles: string[];
    };
  };
}

export default function BookPreviewImage(data: ImageData, aosData: string) {
  const router = useRouter();
  const { bookData } = data;
  const [coverURL, setCoverURL] = useState("");
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    async function fetch() {
      const curl = await getDownloadURL(
        ref(storage, `image/${bookData.id}/${bookData.data.coverFile}`)
      );
      setCoverURL(curl);
    }
    fetch();
  }, [bookData]);
  return (
    <div
      id="book-preview"
      className="flex flex-col w-max rounded-lg dark:bg-gray-900 bg-gray-400 p-2"
      onClick={() => router.push(`/biblioteka/slikovna/${bookData.id}`)}
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
