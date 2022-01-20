import { useState, useEffect, MouseEventHandler } from "react"
import { storage } from "../../firebase/clientApp"
import { ref, getDownloadURL } from "firebase/storage"
import AOS from "aos"
import "aos/dist/aos.css"

interface AudioData {
  id: string
  data: {
    title: string
    publisher: string
    description: string
    audioFile: string
    coverFile: string
  }
}

interface DataProps {
  data: AudioData
  index: number;
  handleDelete: MouseEventHandler<HTMLButtonElement>
}

export default function AdminAudioComponent({ data, index, handleDelete }: DataProps) {
  const [coverURL, setCoverURL] = useState("")
  const [audioURL, setAudioURL] = useState("")
  useEffect(() => {
    AOS.init({
      duration: 300
    })
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
    <>
      <div
        id="container"
        className="flex flex-col w-full h-full rounded-lg dark:bg-gray-900 bg-gray-200"
        data-aos="fadeIn"
      >
        <div id="index" className="flex px-4 py-2 dark:bg-gray-900 bg-gray-400 rounded-t-lg">
          <p className="font-bold">{index + 1}.</p>
        </div>
        <div id="content" className="flex flex-row rounded-b-lg space-x-32 px-4 py-4 justify-around dark:bg-gray-800 bg-gray-200">
          <div id="image">
            {coverURL !== "" && <img src={coverURL} alt="cover photo" />}
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
          </div>
          <div id="audio" className="flex flex-col justify-center content-center -mt-14">
              <p className="uppercase font-bold">Audio fajl</p>
              {audioURL !== "" && <audio className="mt-4 p-2 rounded-full bg-gray-800" controls><source src={audioURL} /></audio>}
              <button className="mt-10 bg-red-600 px-4 py-2 rounded-md text-white" onClick={handleDelete}>Izbriši</button>
          </div>
        </div>
      </div>
    </>
  );
}
