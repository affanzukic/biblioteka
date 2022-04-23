import Image from "next/image";
import Head from "next/head";
import AOS from "aos";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { BsFillMoonFill } from "react-icons/bs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/clientApp";

import "aos/dist/aos.css";

let navigation = [
  { name: "Početna", href: "/", current: false },
  { name: "Audio biblioteka", href: "/biblioteka/audio", current: false },
  { name: "Slikovna biblioteka", href: "/biblioteka/slikovna", current: false },
  { name: "Video biblioteka", href: "/biblioteka/video", current: false },
];

function classNames(...classes: Array<any>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [head, setHead] = useState<string>("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  function toggleDarkMode() {
    if (typeof window !== "undefined") {
      let currentValue = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      ).darkMode;
      currentValue = !currentValue;
      let currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      currentUser.darkMode = currentValue;
      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      router.reload();
    }
  }
  async function fetchData() {
    const q = query(
      collection(db, "admins"),
      where(
        "email",
        "==",
        JSON.parse(localStorage.getItem("currentUser") || "").email
      )
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().email) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
  }
  useEffect(() => {
    if (router.pathname !== "/login") {
      setImgUrl(
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("currentUser") || "").photoURL
          : ""
      );
    }
    AOS.init({
      duration: 200,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    fetchData();
    const regexAudio = /(?:\/audio)+/;
    const regexSlikovna = /(?:\/slikovna)+/;
    const regexVideo = /(?:\/video)+/;
    if (router.pathname.match(regexAudio)) {
      setHead("Online biblioteka - Audio biblioteka");
      navigation[1].current = true;
    } else if (router.pathname.match(regexSlikovna)) {
      setHead("Online biblioteka - Slikovna biblioteka");
      navigation[2].current = true;
    } else if (router.pathname.match(regexVideo)) {
      setHead("Online biblioteka - Video biblioteka");
      navigation[3].current = true;
    } else {
      navigation[0].current = true;
      setHead("Online biblioteka - Početna");
    }
  }, [router]);
  return (
    <Disclosure
      as="nav"
      className="bg-white dark:bg-gray-900 border-b-2 dark:border-gray-800 sticky"
    >
      {({ open }) => (
        <>
          <Head>
            <title>{head}</title>
          </Head>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white bg-purple-500 dark:bg-gray-800 transition ease-in-out duration-400 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Otvori glavni meni</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Image
                    className="h-8 w-8 rounded-full block"
                    src="https://cetvrta-gimnazija.edu.ba/wp-content/uploads/2018/12/4GA3.png"
                    width="50"
                    height="50"
                    alt="Četvrta gimnazija logo"
                  />
                  <p className="text-gray-700 dark:text-white h8-8 w-auto pl-4 text-xs sm:text-sm md:text-lg">
                    Online biblioteka
                  </p>
                </div>
                <div className="hidden sm:flex content-center mx-auto -pl-4 justify-center justify-content-center justify-items-center">
                  <div className="flex space-x-4 mx-auto content-center items-center">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "text-black dark:text-white"
                            : "text-purple-500 transition ease-in-out duration-400 hover:text-purple-700",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="bg-gray-800 dark:bg-gray-300 p-1 rounded-full text-gray-400 dark:text-gray-800 hover:text-white dark:hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-white dark:focus:ring-gray-800 focus:ring-white group"
                  onClick={toggleDarkMode}
                >
                  <BsFillMoonFill className="h-6 w-6" />
                  <span className="tooltip group-hover:scale-100">
                    {darkMode ? "Isključi tamni način" : "Uključi tamni način"}
                  </span>
                </button>
                <div id="user-menu" className="ml-3 relative">
                  <button
                    id="user-menu-button"
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    {imgUrl !== "" && (
                      <Image
                        src={imgUrl}
                        alt="user avatar"
                        className="h-8 w-8 rounded-full"
                        width="35"
                        height="35"
                      />
                    )}
                  </button>
                </div>
              </div>
              {userMenuOpen && (
                <div
                  id="user-menu-container"
                  className="flex flex-col absolute rounded-md right-0 top-[7vh] float-right dark:text-white text-black dark:bg-gray-900 bg-gray-300 space-y-1"
                  data-aos="fadeInOut"
                >
                  {isAdmin && (
                    <button
                      id="control-panel"
                      className="px-8 py-2 rounded-t-md dark:hover:bg-gray-600 hover:bg-gray-400 transition-all duration-200"
                      onClick={() => router.push("/admin")}
                    >
                      Upravljačka ploča
                    </button>
                  )}
                  <button
                    id="log-out"
                    className="text-left px-8 py-2 rounded-b-md dark:hover:bg-gray-600 hover:bg-gray-400 transition-all duration-200"
                    onClick={() => {
                      localStorage.removeItem("currentUser");
                      navigation.map((item) => (item.current = false));
                      router.push("/login");
                    }}
                  >
                    Odjava
                  </button>
                </div>
              )}
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-purple-500 text-white dark:text-black"
                      : "text-black dark:text-white transition ease-in-out duration-400 hover:bg-purple-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
