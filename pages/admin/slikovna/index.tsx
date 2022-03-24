import Head from "next/head";
import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Modal, ModalBody, ModalFooter } from "../../../components/Modal";
import {
  uploadImage,
  fetchImage,
  deleteImage,
} from "../../../utils/firebase/firebaseStorage";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import LoadingIcons from "react-loading-icons";
import AdminImageComponent from "../../../components/admin/AdminImageComponent";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import AOS from "aos";
import "aos/dist/aos.css";

interface ImageData {
  title: string;
  description: string;
  publisher: string;
  coverFile: File | null;
  imageFiles: FileList | null;
  author: string;
}

export default function Index() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dodajSadrzajModal, setDodajSadrzajModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [errorFileTypeImage, setErrorFileTypeImage] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [contentId, setContentId] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [data, setData] = useState<(object | ImageData)[] | undefined | null>(
    null
  );
  function onFileChange(event: SyntheticEvent) {
    // @ts-ignore
    setFiles([...files, event.target.files]);
  }
  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    // @ts-ignore
    const formData = new FormData(event.target);
    let dataToSend = Object.fromEntries(formData);
    dataToSend = { ...dataToSend, imageFiles: files[0] };
    const { title, description, publisher, author, imageFiles, coverFile } = dataToSend;
    if (
      title === "" ||
      description === "" ||
      publisher === "" ||
      author === "" ||
      imageFiles === undefined ||
      // @ts-ignore
      coverFile.name === ""
    ) {
      setErrorText(true);
      return;
    }
    // @ts-ignore
    if (!coverFile!.type.match(/^(image)\/\S+/)) {
      setErrorFileTypeImage(true);
      return;
    }
    const imageFilesToCheck = Array.from(files[0]);
    imageFilesToCheck.forEach((imageFile) => {
      // @ts-ignore
      if (!imageFile!.type.match(/^(image)\/\S+/)) {
        setErrorFileTypeImage(true);
      }
    });
    if (errorFileTypeImage) return;
    setLoading(true);
    // @ts-ignore
    await uploadImage(dataToSend);
    setTimeout(() => {
      router.reload();
    }, 5000);
  }
  function showModalWithId(id: string) {
    setContentId(id);
    setDeleteModal(true);
  }
  async function deleteWithId() {
    setDeleting(true);
    await deleteImage(contentId);
    setTimeout(() => {
      router.reload();
    }, 5000);
  }
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
  }, [router]);
  return (
    <>
      <div id="admin-slikovna" className={darkMode ? "dark flex" : "flex"}>
        <Head>
          <title>
            Online biblioteka - Admin management - Uredi slikovnu biblioteku
          </title>
        </Head>
        <AdminSidebar />
        <div className="content-container">
          <div className="content-list mt-4">
            <div id="title">
              <h1 className="text-xl font-bold">Uredi slikovnu biblioteku</h1>
            </div>
            <div id="description">
              <p className="mb-4">
                Da dodate sadržaj slikovne biblioteke, molimo dodajte ga
                koristeći dugme &#34;Dodaj sadržaj&#34;.
              </p>
              <button
                className="ml-4 mb-2 mt-4 px-4 py-2 add-button"
                onClick={() => setDodajSadrzajModal(!dodajSadrzajModal)}
              >
                Dodaj sadržaj
              </button>
              <div id="content" className="mt-4">
                {data !== null ? (
                  <div className="flex flex-col space-y-4 mr-24 ml-4">
                    {data?.map((unos, idx) => {
                      return ( 
                      <>
                        <AdminImageComponent
                          key={idx}
                          index={idx}
                          // @ts-ignore
                          data={unos}
                          // @ts-ignore
                          handleDelete={() => showModalWithId(unos.id)}
                        />
                      </>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Dodaj sadržaj"
        isShown={dodajSadrzajModal}
        handleClose={() => setDodajSadrzajModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="flex flex-col">
              <p className="mb-2">
                Naziv knjige <p className="inline text-red-600 font-bold">*</p>
              </p>
              <input
                name="title"
                type="text"
                required
                spellCheck="false"
                placeholder="Tvrđava"
                className="admin-input"
                id="title"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col mt-4">
              <p className="mb-2">
                Izdavač i godina izdanja{" "}
                <p className="inline text-red-600 font-bold">*</p>
              </p>
              <input
                name="publisher"
                type="text"
                required
                spellCheck="false"
                placeholder="Connectum, 2014"
                className="admin-input"
                id="izdavac"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col mt-4">
              <p className="mb-2">
                Autor{" "}
                <p className="inline text-red-600 font-bold">*</p>
              </p>
              <input
                name="author"
                type="text"
                required
                spellCheck="false"
                placeholder="Meša Selimović"
                className="admin-input"
                id="author"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col mt-4">
            <p className="mb-2">
              Jezik{" "}
              <p className="inline text-red-600 font-bold">*</p>
            </p>
            <select id="language" className="admin-input" defaultValue="Bosnian" name="language" required disabled={loading}>
              <option value="English">Engleski</option>
              <option value="Bosnian">Bosanski</option>
            </select>
          </div>
            <div className="flex flex-col mt-4">
              <p className="mb-2">
                Opis <p className="inline text-red-600 font-bold">*</p>{" "}
              </p>
              <textarea
                rows={8}
                name="description"
                required
                spellCheck="false"
                style={{ resize: "vertical", height: "auto" }}
                placeholder="Kratka deskripcija"
                className="admin-input"
                id="opis"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col mt-4">
              <p className="mb-2">
                Cover slika <p className="inline text-red-600 font-bold">*</p>{" "}
              </p>
              <input
                name="coverFile"
                type="file"
                accept="image/*"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col mt-4">
              <p className="mb-2">
                Slike <p className="inline text-red-600 font-bold">*</p>{" "}
              </p>
              <input
                name="imageFiles"
                multiple
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={loading}
              />
              <p className="mt-2">
                Fajlove je potrebno na kompjuteru preimenovati po brojevima
                slajda, počevši od 0. (primjer 0.jpg, 1.jpg...)
              </p>
              {errorFileTypeImage ? (
                <p className="mt-2 text-center text-red-500 font-semibold">
                  Dozvoljeni formati su .jpg, .jpeg, .png i svi ostali foto
                  formati
                </p>
              ) : null}
              {errorText ? (
                <p className="mt-2 text-center text-red-500 font-semibold">
                  Morate popuniti sva polja!
                </p>
              ) : null}
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
