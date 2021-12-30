import { MouseEventHandler, useEffect } from "react";
import AOS from "aos"
import "aos/dist/aos.css"

interface AdminUserProps {
  email: String;
  id?: String;
  modal?: MouseEventHandler<HTMLButtonElement>
  aosData: String;
}

export default function AdminUserComponent({ email, modal, aosData }: AdminUserProps) {
  useEffect(() => {
    AOS.init({
      duration: 300
    })
  })
  return (
    <>
      <div
        id="container"
        className="flex flex-row items-center space-x-10 justify-around w-full h-full p-4 rounded-lg dark:bg-gray-900 bg-gray-100"
        style={{ zIndex: -15 }}
        data-aos={aosData}
      >
        <div id="email" className="flex w-72">
          <h1>{email}</h1>
        </div>
        <div id="description" className="flex">
          <h1>Administrator</h1>
        </div>
        <div id="remove" className="flex">
          <button
            className="dark:bg-gray-700 bg-gray-400 rounded transition-all ease-in-out duration-300 dark:hover:bg-gray-300 dark:hover:text-black hover:bg-gray-700 hover:text-white py-1 px-4"
            onClick={modal}
          >
            Izbriši administratora
          </button>
        </div>
      </div>
    </>
  );
}
