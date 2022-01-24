import { db } from "../../../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";

async function fetchAudioBook(id: string) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "audioLibrary", id);
      getDoc(docRef)
        .then((doc) => {
          const data = doc.data();
          resolve(data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

async function fetchImageBook(id: string) {
  return new Promise((resolve, reject) => {
    try {
      const docRef = doc(db, "imageLibrary", id);
      getDoc(docRef)
        .then((doc) => {
          const data = doc.data();
          resolve(data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

export { fetchAudioBook, fetchImageBook };
