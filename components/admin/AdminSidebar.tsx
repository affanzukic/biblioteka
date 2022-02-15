import { MouseEventHandler, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import { BsMoon, BsFillImageFill, BsFillCameraVideoFill } from "react-icons/bs";
import { MdHeadphones } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

interface IconProp {
  icon: JSX.Element;
  text?: string;
  onClick?: MouseEventHandler;
}

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const router = useRouter();
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
  useEffect(() => {
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "{}"));
  }, []);
  return (
    <div
      id="sidebar"
      className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white shadow-lg justify-center z-50"
    >
      <SidebarIcon
        icon={
          <img
            // @ts-ignore
            src={currentUser.photoURL}
            className="rounded-full"
            alt="user avatar"
          />
        }
        // @ts-ignore
        text={currentUser.displayName}
      />
      <SidebarIcon
        icon={<IoIosArrowBack size="28" />}
        text="Nazad"
        onClick={() => router.push("/")}
      />
      <SidebarIcon
        icon={<AiOutlineUsergroupAdd size="28" />}
        text="Uredi administratore"
        onClick={() => router.push("/admin/korisnici")}
      />
      <SidebarIcon
        icon={<MdHeadphones size="28" />}
        text="Uredi audio biblioteku"
        onClick={() => router.push("/admin/audio")}
      />
      <SidebarIcon
        icon={<BsFillImageFill size="28" />}
        text="Uredi slikovnu biblioteku"
        onClick={() => router.push("/admin/slikovna")}
      />
      <SidebarIcon
        icon={<BsFillCameraVideoFill size="28" />}
        text="Uredi video biblioteku"
        onClick={() => router.push("/admin/video")}
      />
      <SidebarIcon
        icon={<BsMoon size="24" />}
        text={darkMode ? "Isključi tamni način" : "Uključi tamni način"}
        onClick={() => toggleDarkMode()}
      />
    </div>
  );
}

function SidebarIcon({ icon, text, onClick }: IconProp) {
  return (
    <div className="sidebar-icon group" onClick={onClick}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
}
