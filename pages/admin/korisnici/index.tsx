import { useState, useEffect } from "react";
import Head from "next/head";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminUserComponent from "../../../components/admin/AdminUserComponent";
import AOS from "aos";
import "aos/dist/aos.css";
import { deleteAdmin, fetchAdmins, createAdmin } from "../../../utils/firebase/firebase";
import { Modal, ModalBody, ModalFooter } from "../../../components/Modal";
import {useRouter} from "next/router";

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  const [admins, setAdmins] = useState<object[] | undefined>([]);
  const [adminId, setAdminId] = useState("");
  const [modalShown, setModalShown] = useState(false);
  const router = useRouter()
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
  }, []);
  function showModal(id: string) {
    setModalShown(!modalShown);
    setAdminId(id);
  }
  async function deleteWithId() {
    await deleteAdmin(adminId)
    router.reload()
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
              <button className="ml-4 mb-2 mt-4 px-4 py-2 add-button">Dodaj administratora</button>
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
      <Modal
        title="Brisanje administratora"
        isShown={modalShown}
        handleClose={() => setModalShown(false)}
      >
        <ModalBody>
            <p>Da li ste sigurni da želite da izbrišete administratora?</p>
        </ModalBody>
        <ModalFooter>
          <button className="bg-red-600 px-4 py-2 rounded-md" onClick={() => deleteWithId()}>Izbriši</button>
          <button className="bg-gray-400 dark:bg-gray-900 px-4 py-2 rounded-md" onClick={() => setModalShown(false)}>Zatvori</button>
        </ModalFooter>
      </Modal>
    </>
  );
}
