import Navbar from "../../../components/Navbar";
import { useEffect, useState } from "react";
import { fetchImage } from "../../../utils/firebase/firebaseStorage";
import BookPreviewImage from "../../../components/BookPreviewImage";
import AOS from "aos";
import "aos/dist/aos.css";

interface ImageData {
  title: string;
  description: string;
  publisher: string;
  coverFile: string;
  imageFiles: string[];
}

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<(object | ImageData)[] | undefined>(
    undefined
  );
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    fetchImage()
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div
      id="slikovna-biblioteka"
      className={darkMode ? "dark flex flex-col" : "flex flex-col"}
    >
      <Navbar />
      <div className="content-underlay">
        <div id="content" className="ml-2 mt-2">
          <div
            id="title"
            className="flex justify-center content-center mt-8 mx-auto"
          >
            <h1 className="text-6xl font-bold text-shadow-xl dark:text-white text-gray-700">
              Slikovna biblioteka
            </h1>
          </div>
          <div
            id="data"
            className="flex flex-row flex-wrap mt-12 justify-center content-center space-y-6 space-x-6"
            data-aos="fadeIn"
          >
            {data !== undefined
              ? data?.map((data, idx) => {
                  return (
                    <div data-aos="fadeIn" key={idx}>
                      <BookPreviewImage
                        // @ts-ignore
                        bookData={data}
                        aosData="fadeIn"
                        key={idx}
                      />
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
