import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState, FC } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/clientApp";

let navigation = [
  { name: "Početna", href: "/", current: false },
  { name: "Audio biblioteka", href: "/biblioteka/audio", current: false },
  { name: "Slikovna biblioteka", href: "/biblioteka/slikovna", current: false },
];

function classNames(...classes: Array<any>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [head, setHead] = useState<string>("");
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
    fetchData();
    switch (router.pathname) {
      case "/":
        navigation[0].current = true;
        setHead("Online biblioteka - Početna");
        break;
      case "/biblioteka/audio":
        setHead("Online biblioteka - Audio biblioteka");
        navigation[1].current = true;
        break;
      case "/biblioteka/slikovna":
        setHead("Online biblioteka - Slikovna biblioteka");
        navigation[2].current = true;
        break;
    }
  }, [router]);
  return (
    <Disclosure as="nav" className="bg-white border-b-2 sticky">
      {({ open }) => (
        <>
          <Head>
            <title>{head}</title>
          </Head>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white bg-purple-500 transition ease-in-out duration-400 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
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
                    className="h-8 w-auto block"
                    src="https://cetvrta-gimnazija.edu.ba/wp-content/uploads/2018/12/4GA3.png"
                    width="50"
                    height="50"
                    alt="Četvrta gimnazija logo"
                  />
                  <p className="text-gray-700 h8-8 w-auto pl-4 text-xs sm:text-sm md:text-lg">
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
                            ? "text-black"
                            : "text-purple-500 transition ease-in-out duration-400 hover:text-purple-700",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                    {isAdmin ? (
                      <a
                        key={"Admin"}
                        href={"/admin"}
                        className={classNames(
                          isAdmin && router.pathname === "/admin"
                            ? "text-black"
                            : "text-purple-500 transition ease-in-out duration-400 hover:text-purple-700",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={undefined}
                      >
                        Admin
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      {imgUrl !== "" && (
                        <Image
                          src={imgUrl}
                          alt="user avatar"
                          className="h-8 w-8 rounded-full"
                          width="35"
                          height="35"
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active ? "bg-gray-100 w-full" : "",
                              "block px-4 py-2 text-sm w-full text-left text-gray-700"
                            )}
                            onClick={() => {
                              localStorage.removeItem("currentUser");
                              navigation.map((item) => (item.current = false));
                              router.push("/login");
                            }}
                          >
                            Odjava
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
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
                      ? "bg-purple-500 text-white"
                      : "text-black transition ease-in-out duration-400 hover:bg-purple-700 hover:text-white",
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