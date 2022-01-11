import { useState, useEffect } from "react"
import { storage } from "../../firebase/clientApp"
import { ref, getDownloadURL } from "firebase/storage"

interface DataProps {
  data: object
  index: number;
}

export default function AdminAudioComponent({ data, index }: DataProps) {
  const [coverURL, setCoverURL] = useState("")
  const [audioURL, setAudioURL] = useState("")
  useEffect(() => {
    async function fetch() {
      // @ts-ignore
      const aurl = await getDownloadURL(ref(storage, `audio/${data.id}/${data.data.audioFile}`))
      // @ts-ignore
      const curl = await getDownloadURL(ref(storage, `audio/${data.id}/${data.data.coverFile}`))
      setCoverURL(curl)
      setAudioURL(aurl) 
    }
    fetch()
  }, [data])
  return (
      <div
        id="container"
        className="flex flex-col w-full h-full rounded-lg dark:bg-gray-900 bg-gray-200"
      >
        <div id="index" className="flex px-4 py-2">
          <p className="font-bold">{1}.</p>
        </div>
        <div id="content" className="flex flex-row px-4 py-4 dark:bg-gray-800">
          <div id="image">
            <img src={coverURL !== "" && coverURL} alt="cover photo" />
          </div>
        </div>
      </div>
  );
}
