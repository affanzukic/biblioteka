import { useState, useEffect } from "react";
import Head from "next/head";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminUserComponent from "../../../components/admin/AdminUserComponent";
import AOS from "aos";
import "aos/dist/aos.css";
import { deleteAdmin, fetchAdmins } from "../../../utils/firebase/firebase";

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  const [admins, setAdmins] = useState<object[] | undefined>([]);
  const [adminId, setAdminId] = useState("");
  const [modalShown, setModalShown] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    fetchAdmins()
      .then((data) => setAdmins(data))
      .catch((err) => console.log(err));
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
  }, [admins]);
  function showModal(id: string) {
    setModalShown(!modalShown);
    setAdminId(id);
  }
  return (
    <>
      <div id="admin-korisnici" className={darkMode ? "dark flex" : "flex"}>
        <Head>
          <title>
            Online biblioteka - Admin management - Uredi administratore
          </title>
        </Head>
        <AdminSidebar />
        <div className="content-container">
          <div className="content-list">
            <div id="title">
              <h1 className="text-xl font-bold">Uredi administratore</h1>
            </div>
            <div id="description">
              <p>
                Da dodate administratore koji bi imali pristup uređivanju
                sadržaja, molimo dodajte ih koristeći dugme &#34;Dodaj
                administratora&#34;.
              </p>
            </div>
            <div id="users" className="mt-4">
              {admins !== null && typeof window !== "undefined" ? (
                <div
                  id="user-admin-data"
                  className="mr-24 ml-2 space-y-2"
                  data-aos="fadeIn"
                >
                  {admins?.map((admin, idx) => {
                    return (
                      <AdminUserComponent
                        key={idx}
                        email={admin?.data?.email}
                        modal={() => showModal(admin.id)}
                        aosData="fadeIn"
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {modalShown ? (
        <div id="modal-overlay" className="absolute bg-gray-900 bg-opacity-40 w-full h-screen inset-0" data-aos="fadeIn">
          <div id="modal-content" className="ml-24 mt-4">
            {/* finish modal and add dark mode and light mode support */}
            <h1 className="text-white">Hello</h1>
          </div>
        </div>
      ) : null}
    </>
  );
}
