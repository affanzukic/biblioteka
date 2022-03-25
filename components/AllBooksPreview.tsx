import { DocumentData } from "firebase/firestore";
import { useState, useEffect } from "react";
import BookPreviewAudio from "./BookPreviewAudio";
import BookPreviewImage from "./BookPreviewImage";
import BookPreviewVideo from "./BookPreviewVideo";

type ActiveTab = "audio" | "slika" | "video";
interface IPreviewProps {
  audioBooks: DocumentData | undefined;
  imageBooks: DocumentData | undefined;
  videoBooks: DocumentData | undefined;
}

let tabs = [
  {
    title: "Audio knjige",
    id: "audio",
    active: true,
  },
  {
    title: "Slikovne knjige",
    id: "slika",
    active: false,
  },
  {
    title: "Video knjige",
    id: "video",
    active: false,
  },
];

export default function AllBooksPreview({
  audioBooks,
  imageBooks,
  videoBooks,
}: IPreviewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("audio");
  useEffect(() => {
    const activeTab = tabs.find((tab) => {
      return tab.active;
    });
    // @ts-ignore
    setActiveTab(activeTab.id);
  }, []);
  function chooseTab(id: string) {
    tabs.map((tab) => {
      tab.active = false;
    });
    const newTab = tabs.find((tab) => {
      return tab.id === id;
    });
    newTab!.active = true;
    // @ts-ignore
    setActiveTab(newTab!.id);
  }
  return (
    <div id="all-books" className="flex flex-col w-full">
      <div
        id="tabs"
        className="flex flex-row bg-transparent space-x-2 h-full min-w-full"
      >
        {tabs.map((tab, idx) => {
          return (
            <div
              id={`${tab.id}`}
              key={idx}
              className={`flex p-2 cursor-pointer rounded-t-sm dark:bg-gray-900 bg-white transition duration-300 ${
                activeTab === tab.id && "border-b-2 border-yellow-600"
              }`}
              onClick={() => chooseTab(tab.id)}
            >
              <p>{tab.title}</p>
            </div>
          );
        })}
      </div>
      <div
        id="content"
        className="flex mt-4 dark:bg-black bg-white rounded-lg transition duration-300 px-2 py-4"
      >
        {activeTab === "audio" ? (
          <div id="books" className="flex flex-row flex-wrap space-x-4">
            {/* @ts-ignore */}
            {audioBooks?.map((book, idx) => {
              return <BookPreviewAudio key={idx} bookData={book} />;
            })}
          </div>
        ) : activeTab === "slika" ? (
          <div id="books" className="flex flex-row flex-wrap space-x-4">
            {/* @ts-ignore */}
            {imageBooks?.map((book, idx) => {
              return <BookPreviewImage key={idx} bookData={book} />;
            })}
          </div>
        ) : (
          <div id="books" className="flex flex-row flex-wrap space-x-4">
            {videoBooks?.length === 0 && (
              <div
                id="error-message"
                className="flex content-center justify-center"
              >
                <p className="mx-auto">Trenutno nema knjiga!</p>
              </div>
            )}
            {/* @ts-ignore */}
            {videoBooks?.map((book, idx) => {
              return <BookPreviewVideo key={idx} bookData={book} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
