import { useState, useEffect, SyntheticEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Modal, ModalBody, ModalFooter } from "../../../components/Modal";
import LoadingIcons from "react-loading-icons";
import {
  fetchVideo,
  uploadVideo,
  deleteVideo,
} from "../../../utils/firebase/firebaseStorage";
import { DocumentData } from "firebase/firestore";
import AdminVideoComponent from "../../../components/admin/AdminVideoComponent";

export default function Index() {
  const router = useRouter();
  const [data, setData] = useState<DocumentData | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [dodajSadrzajModal, setDodajSadrzajModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  function deleteVideoWithId(id: string) {
    setIdToDelete(id);
    setDeleteModal(true);
  }
  async function handleAddSadrzaj(event: SyntheticEvent) {
    event.preventDefault();
    setLoading(true);
    // @ts-ignore
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd);
    // @ts-ignore
    uploadVideo(data)
      .then(() => router.reload())
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    async function fetchData() {
      const videoData = await fetchVideo();
      setData(videoData);
    }
    fetchData();
  }, []);
  return (
    <>
      <div id="admin-video" className={darkMode ? "dark flex" : "flex"}>
        <Head>
          <title>
            Online bibliteka - Admin management - redi video biblioteku
          </title>
        </Head>
        <AdminSidebar />
        <div className="content-container">
          <div className="content-list mb-4">
            <div id="title">
              <h1 className="text-xl font-bold">Uredi video biblioteku</h1>
            </div>
            <div id="description">
              <p className="mb-4">
                Da dodate sadržaj video biblioteke, molimo dodajte ga koristeći
                dugme &#34;Dodaj sadržaj&#34;.
              </p>
              <button
                className="ml-4 mb-2 mt-4 px-4 py-2 add-button"
                onClick={() => setDodajSadrzajModal(!dodajSadrzajModal)}
              >
                Dodaj sadržaj
              </button>
            </div>
            {data !== undefined ? (
              <div id="content" className="mt-4" data-aos="fadeIn">
                {data.length === 0 ? (
                  <p>Trenutno nema filmova!</p>
                ) : (
                  <div
                    id="videos"
                    className="flex flex-col space-y-4 mr-24 ml-4"
                  >
                    {/* @ts-ignore */}
                    {data?.map((video, idx) => {
                      return (
                        <AdminVideoComponent
                          id={video.id}
                          data={video.data}
                          index={idx}
                          key={idx}
                          handleDelete={() => deleteVideoWithId(video.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        title="Dodaj sadržaj"
        isShown={dodajSadrzajModal}
        handleClose={() => setDodajSadrzajModal(false)}
      >
        <form onSubmit={handleAddSadrzaj}>
          <ModalBody>
            <div className="flex flex-col space-y-4">
              <div id="title" className="flex flex-col space-y-2">
                <label htmlFor="title">Naziv knjige</label>
                <input
                  type="text"
                  required
                  name="title"
                  spellCheck="false"
                  placeholder="Tvrđava"
                  className="admin-input"
                  id="title"
                  disabled={loading}
                />
              </div>
              <div id="publisher" className="flex flex-col space-y-2">
                <label htmlFor="publisher">Izdavač i godina izdanja</label>
                <input
                  type="text"
                  required
                  name="publisher"
                  spellCheck="false"
                  placeholder="Connectum, 2004."
                  className="admin-input"
                  id="publisher"
                  disabled={loading}
                />
              </div>
              <div id="author" className="flex flex-col space-y-2">
                <label htmlFor="author">Autor</label>
                <input
                  type="text"
                  required
                  name="author"
                  spellCheck="false"
                  placeholder="Connectum, 2004."
                  className="admin-input"
                  id="author"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col mt-4">
                <p className="mb-2">
                  Jezik <p className="inline text-red-600 font-bold">*</p>
                </p>
                <select
                  id="language"
                  className="admin-input"
                  defaultValue="Bosanski"
                  name="language"
                  required
                  disabled={loading}
                >
                  <option value="English">English</option>
                  <option value="Bosanski">Bosanski</option>
                </select>
              </div>
              <div id="description" className="flex flex-col space-y-2">
                <label htmlFor="description">Opis</label>
                <textarea
                  rows={4}
                  required
                  name="description"
                  spellCheck="false"
                  style={{ resize: "vertical", height: "auto" }}
                  placeholder="Kratka deskripcija"
                  className="admin-input"
                  id="description"
                  disabled={loading}
                />
              </div>
              <div id="coverFile" className="flex flex-col space-y-2">
                <label htmlFor="coverFile">Cover slika</label>
                <input
                  type="file"
                  name="coverFile"
                  accept="image/*"
                  disabled={loading}
                />
              </div>
              <div id="videoFile" className="flex flex-col space-y-2">
                <label htmlFor="videoFile">Video fajl</label>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  disabled={loading}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="bg-green-600 px-4 py-2 rounded-md flex flex-row disabled:text-gray-400 disabled:bg-green-900"
              disabled={loading}
              type="submit"
            >
              {loading && (
                <LoadingIcons.TailSpin
                  width={24}
                  height={24}
                  className="mr-2"
                />
              )}
              Dodaj
            </button>
            <button
              className="bg-gray-400 dark:bg-gray-900 disabled:bg-gray-500 disabled:text-gray-400 px-4 py-2 rounded-md dark:disabled:bg-gray-800"
              onClick={() => setDodajSadrzajModal(false)}
              disabled={loading}
            >
              Zatvori
            </button>
          </ModalFooter>
        </form>
      </Modal>
      <Modal
        title="Brisanje sadržaja"
        isShown={deleteModal}
        handleClose={() => setDeleteModal(false)}
      >
        <ModalBody>
          <p>Da li ste sigurni da želite izbrisati video knjigu?</p>
        </ModalBody>
        <ModalFooter>
          <button
            className="bg-red-600 px-4 py-2 rounded-md"
            onClick={() => {
              setDeleting(true);
              deleteVideo(idToDelete)
                .then(() => setTimeout(() => router.reload(), 2000))
                .catch((err) => console.log(err));
            }}
            disabled={deleting}
          >
            {deleting && (
              <LoadingIcons.TailSpin
                width={24}
                height={24}
                className="mr-2 inline"
              />
            )}
            Izbriši
          </button>
          <button
            className="bg-gray-400 dark:bg-gray-900 px-4 py-2 rounded-md"
            onClick={() => setDeleteModal(false)}
            disabled={deleting}
          >
            Zatvori
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
