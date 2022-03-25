import { useState, useEffect } from "react";
import {
  uploadAudio,
  fetchAudioData,
  deleteAudio,
} from "../../../utils/firebase/firebaseStorage";
import { useRouter } from "next/router";
import { Modal, ModalBody, ModalFooter } from "../../../components/Modal";
import Head from "next/head";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import LoadingIcons from "react-loading-icons";
import AdminAudioComponent from "../../../components/admin/AdminAudioComponent";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import AOS from "aos";
import "aos/dist/aos.css";
import AdminSliderComponent from "../../../components/admin/AdminSliderComponent";
interface AudioData {
  title: string;
  description: string;
  publisher: string;
  author: string;
  language: string;
  audioFile: File | null;
  coverFile: File | null;
}

<<<<<<< HEAD
type ILanguage = "English" | "Bosnian";
=======
type ILanguage = "English" | "Bosanski";
>>>>>>> 9833db54c3fe2b1718b884a5eb9ab0ff350ba53e

export default function Index() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [data, setData] = useState<object[] | AudioData[] | null | undefined>(
    null
  );
  const [dodajSadrzajModal, setDodajSadrzajModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [errorFileTypeAudio, setErrorFileTypeAudio] = useState(false);
  const [errorFileTypeImage, setErrorFileTypeImage] = useState(false);
  const [naziv, setNaziv] = useState("");
  const [izdavac, setIzdavac] = useState("");
  const [opis, setOpis] = useState("");
  const [author, setAuthor] = useState("");
<<<<<<< HEAD
  const [language, setLanguage] = useState<ILanguage>("Bosnian");
=======
  const [language, setLanguage] = useState<ILanguage>("Bosanski");
>>>>>>> 9833db54c3fe2b1718b884a5eb9ab0ff350ba53e
  const [contentId, setContentId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  async function handleUpload() {
    if (naziv === "" || izdavac === "" || opis === "") {
      setErrorText(true);
      return;
    } else {
      setErrorText(false);
    }

    if (!audioFile!.type.match(/^(audio)\/\S+/)) {
      setErrorFileTypeAudio(true);
      return;
    } else {
      setErrorFileTypeAudio(false);
    }

    if (!coverFile!.type.match(/^(image)\/\S+/)) {
      setErrorFileTypeImage(true);
      return;
    } else {
      setErrorFileTypeImage(false);
    }

    const data: AudioData = {
      title: naziv,
      publisher: izdavac,
      description: opis,
      audioFile,
      coverFile,
      author,
      language,
    };

    setLoading(true);

    uploadAudio(data)
      .then((response) => {
        if (response) {
          router.reload();
        }
      })
      .catch((err) => console.log(err));
  }
  function showModalWithId(id: string) {
    setDeleteModal(true);
    setContentId(id);
  }
  async function deleteWithId() {
    setDeleting(true);
    await deleteAudio(contentId);
    router.reload();
  }
  useEffect(() => {
    AOS.init({
      duration: 300,
    });
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
    async function fetchData() {
      const audioData = await fetchAudioData();
      setData(audioData);
    }
    async function checkIfAdmin() {
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
        if (!doc.data().email) {
          router.push("/");
        }
      });
    }
    checkIfAdmin();
    fetchData();
  }, [router]);
  return (
    <>
      <div id="admin-audio" className={darkMode ? "dark flex" : "flex"}>
        <Head>
          <title>
            Online biblioteka - Admin management - Uredi audio biblioteku
          </title>
        </Head>
        <AdminSidebar />
        <div className="content-container">
          <div className="content-list mt-4">
            <div id="title">
              <h1 className="text-xl font-bold">Uredi audio biblioteku</h1>
            </div>
            <div id="description">
              <p className="mb-4">
                Da dodate sadržaj audio biblioteke, molimo dodajte ga koristeći
                dugme &#34;Dodaj sadržaj&#34;.
              </p>
              <button
                className="ml-4 mb-2 mt-4 px-4 py-2 add-button"
                onClick={() => setDodajSadrzajModal(!dodajSadrzajModal)}
              >
                Dodaj sadržaj
              </button>
            </div>
            <div id="content" className="flex mt-8">
            <AdminSliderComponent />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Dodaj sadržaj"
        isShown={dodajSadrzajModal}
        handleClose={() => setDodajSadrzajModal(false)}
      >
        <ModalBody>
          <div className="flex flex-col">
            <p className="mb-2">
              Naziv knjige <p className="inline text-red-600 font-bold">*</p>
            </p>
            <input
              type="text"
              required
              spellCheck="false"
              placeholder="Tvrđava"
              className="admin-input"
              id="naziv"
              onChange={(e) => setNaziv(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col mt-4">
            <p className="mb-2">
              Izdavač i godina izdanja{" "}
              <p className="inline text-red-600 font-bold">*</p>
            </p>
            <input
              type="text"
              required
              spellCheck="false"
              placeholder="Connectum, 2014"
              className="admin-input"
              id="izdavac"
              onChange={(e) => setIzdavac(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col mt-4">
            <p className="mb-2">
              Autor <p className="inline text-red-600 font-bold">*</p>
            </p>
            <input
              type="text"
              required
              spellCheck="false"
              placeholder="Meša Selimović"
              className="admin-input"
              id="author"
              onChange={(e) => setAuthor(e.target.value)}
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
<<<<<<< HEAD
              defaultValue="Bosnian"
=======
              defaultValue="Bosanski"
>>>>>>> 9833db54c3fe2b1718b884a5eb9ab0ff350ba53e
              name="language"
              required
              onChange={(event) => {
                // @ts-ignore
                setLanguage(event.target.value);
              }}
              disabled={loading}
            >
<<<<<<< HEAD
              <option value="English">Engleski</option>
              <option value="Bosnian">Bosanski</option>
=======
              <option value="English">English</option>
              <option value="Bosanski">Bosanski</option>
>>>>>>> 9833db54c3fe2b1718b884a5eb9ab0ff350ba53e
            </select>
          </div>
          <div className="flex flex-col mt-4">
            <p className="mb-2">
              Opis <p className="inline text-red-600 font-bold">*</p>{" "}
            </p>
            <textarea
              rows={8}
              required
              spellCheck="false"
              style={{ resize: "vertical", height: "auto" }}
              placeholder="Kratka deskripcija"
              className="admin-input"
              id="opis"
              onChange={(e) => setOpis(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col mt-4">
            <p className="mb-2">
              Audio datoteka <p className="inline text-red-600 font-bold">*</p>{" "}
            </p>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files![0])}
              disabled={loading}
            />
          </div>
          {errorFileTypeAudio ? (
            <p className="mt-2 text-center text-red-500 font-semibold">
              Dozvoljeni formati su .aac, .mp3, .wma i svi ostali audio formati.
            </p>
          ) : null}
          <div className="flex flex-col mt-4">
            <p className="mb-2">
              Cover slika <p className="inline text-red-600 font-bold">*</p>{" "}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files![0])}
              disabled={loading}
            />
          </div>
          {errorFileTypeImage ? (
            <p className="mt-2 text-center text-red-500 font-semibold">
              Dozvoljeni formati su .jpg, .jpeg, .png i svi ostali foto formati
            </p>
          ) : null}
          {errorText ? (
            <p className="mt-2 text-center text-red-500 font-semibold">
              Morate popuniti sva polja!
            </p>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <button
            className="bg-green-600 px-4 py-2 rounded-md flex flex-row disabled:text-gray-400 disabled:bg-green-900"
            disabled={loading}
            onClick={() => {
              handleUpload();
            }}
          >
            {loading && (
              <LoadingIcons.TailSpin width={24} height={24} className="mr-2" />
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
      </Modal>
      <Modal
        title="Izbriši sadržaj"
        isShown={deleteModal}
        handleClose={() => setDeleteModal(false)}
      >
        <ModalBody>
          <p>Da li ste sigurni da želite izbrisati sadržaj?</p>
        </ModalBody>
        <ModalFooter>
          <button
            className="bg-red-600 px-4 py-2 rounded-md"
            onClick={() => {
              deleteWithId();
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
