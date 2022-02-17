import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { DocumentData } from "firebase/firestore";
import { fetchVideoBook } from "../../../../utils/firebase/public/firestore";
import AOS from "aos";
import "aos/dist/aos.css";
import { storage } from "../../../../firebase/clientApp";
import { ref, getDownloadURL } from "firebase/storage";

export default function Index() {
  const router = useRouter();
  const { id } = router.query;
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [coverUrl, setCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    if (id !== undefined) {
        // @ts-ignore
        fetchVideoBook(id).then(videoData => setData(videoData)).catch(err => console.log(err))
    }
    async function fetchData() {
        if (id !== undefined && data?.coverFile !== undefined) {
            const curl = await getDownloadURL(ref(storage, `video/${id}/${data?.coverFile}`))
            setCoverUrl(curl)
        }
        if (id !== undefined && data?.videoFile !== undefined) {
            const vurl = await getDownloadURL(ref(storage, `video/${id}/${data?.videoFile}`))
            setVideoUrl(vurl)
        }
    }
    fetchData()
  }, [id, data?.coverFile, data?.videoFile]);
  return;
}
