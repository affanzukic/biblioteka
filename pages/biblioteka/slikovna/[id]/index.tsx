import { useState, useEffect, useRef, memo } from "react";
import { useRouter } from "next/router";
import { DocumentData } from "firebase/firestore";
import { fetchImageBook } from "../../../../utils/firebase/public/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/clientApp";
import Navbar from "../../../../components/Navbar";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";

async function fetchCoverFile(id: string | string[], coverFile: string) {
  const curl = await getDownloadURL(ref(storage, `image/${id}/${coverFile}`));
  return curl;
}

async function fetchImages(id: string | string[], images: string[]) {
  let imageURLS: string[] = [];
  images.map(async (image) => {
    const imageURL = await getDownloadURL(ref(storage, `image/${id}/${image}`));
    imageURLS.push(imageURL);
  });
  return imageURLS;
}

const Index = memo(() => {
  const router = useRouter();
  const { id } = router.query;
  const imagesRef = useRef<null | HTMLDivElement>(null);
  const descriptionRef = useRef<null | HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [coverURL, setCoverURL] = useState("");
  const [imageURLS, setImageURLS] = useState<string[]>([]);
  const [carousel, setCarousel] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    if (id !== undefined) {
      // @ts-ignore
      fetchImageBook(id)
        // @ts-ignore
        .then((res) => setData(res))
        .catch((err) => console.log(err));
      fetchCoverFile(id, data?.coverFile)
        .then((data) => setCoverURL(data))
        .catch((err) => console.log(err));
      fetchImages(id, data?.imageFiles)
        .then((data) => {
          setImageURLS(data);
        })
        .catch((err) => console.log(err));
    }
  }, [id, data?.coverFile]);

  useEffect(() => {
    if (carousel) {
      setTimeout(() => {
        imagesRef?.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [carousel]);

  return (
    <div
      id="image-book"
      className={darkMode ? "dark flex flex-col h-full" : "flex flex-col"}
    >
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="mt-2 ml-2 h-full" ref={descriptionRef}>
          {data !== undefined ? (
            <>
              <Head>
                <title>Online biblioteka - {data?.title}</title>
              </Head>
              <div
                id="title"
                className="flex flex-row content-center justify-center mt-8 mx-auto"
                data-aos="fadeIn"
              >
                <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">
                  {data?.title}
                </h1>
              </div>
              <div
                id="content"
                className="flex flex-row mt-16 space-x-64 justify-between content-center mx-8"
                data-aos="fadeIn"
              >
                <div
                  id="cover"
                  className="flex content-center justify-center rounded-lg"
                >
                  {coverURL !== "" && (
                    <img
                      src={coverURL}
                      className="my-auto rounded-lg border-2 dark:border-white border-black"
                      height="500vh"
                      width="500vw"
                      alt="cover"
                    />
                  )}
                </div>
                <div
                  id="info"
                  className="flex flex-col space-y-8 justify-center content-center w-[90vw]"
                >
                  <div id="publisher">
                    <h2 className="uppercase font-bold">
                      Izdavač i godina izdanja
                    </h2>
                    <p>{data?.publisher}</p>
                  </div>
                  <div id="author">
                    <h2 className="uppercase font-bold">Autor</h2>
                    <p>{data?.author}</p>
                  </div>
                  <div id="language">
                    <h2 className="uppercase font-bold">Jezik</h2>
                    <p>{data?.language}</p>
                  </div>
                  <div id="description">
                    <h2 className="uppercase font-bold">Kratki opis</h2>
                    <p>{data?.description}</p>
                  </div>
                </div>
              </div>
              <div
                id="image-book"
                className="flex flex-col justify-center content-center px-auto mx-32 pt-20 pb-10"
              >
                <h2 className="uppercase font-bold text-center">
                  Slikovna knjiga
                </h2>
                <button
                  className="mt-8 bg-green-600 px-4 py-2 rounded-md text-white disabled:text-gray-400 disabled:bg-green-900 text-center transition duration-300 hover:bg-green-900"
                  disabled={carousel}
                  onClick={() => {
                    setCarousel(true);
                  }}
                >
                  Pokreni slikovnu prezentaciju
                </button>
              </div>
              {carousel ? (
                <div
                  id="center"
                  className="flex flex-col content-center justify-center mx-auto space-y-16 my-16 w-3/4 h-1/2"
                  ref={imagesRef}
                >
                  {imageURLS.map((image, idx) => {
                    return (
                      <div
                        id="image"
                        key={idx}
                        className="flex flex-col justify-center content-center dark:bg-gray-900 bg-gray-300 rounded-lg pb-2"
                      >
                        <img
                          src={image}
                          alt="image"
                          className="p-4 rounded-lg"
                          key={idx}
                        />
                        <p className="flex mx-auto">Slika {idx + 1}</p>
                      </div>
                    );
                  })}
                  <button
                    className="mx-auto mt-4 px-4 py-2 add-button w-1/2"
                    onClick={() => {
                      descriptionRef!.current!.scrollIntoView({
                        behavior: "smooth",
                      });
                      setTimeout(() => {
                        setCarousel(false);
                      }, 600);
                    }}
                  >
                    Zatvori slikovnu prezentaciju
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
})

Index.displayName = 'Index'

export default Index;
