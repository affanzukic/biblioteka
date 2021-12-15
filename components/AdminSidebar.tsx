import { MouseEventHandler } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router"

interface IconProp {
  icon: JSX.Element;
  text?: string;
  onClick?: MouseEventHandler;
}

export default function Sidebar() {
    const router = useRouter()
  return (
    <div
      id="sidebar"
      className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white shadow-lg"
    >
      <SidebarIcon
        icon={<IoIosArrowBack size="28" />}
        text="Vrati se nazad"
        onClick={() => router.push("/")}
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
