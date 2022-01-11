import { storage, db } from "../../firebase/clientApp";
import { ref, uploadBytes, } from "firebase/storage";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import lodash from "lodash";

interface AudioData {
  title: string;
  description: string;
  publisher: string;
  audioFile: File | null;
  coverFile: File | null;
}

async function uploadAudio(data: AudioData) {
  if (data === null) return;
  try {
    return new Promise((resolve, reject) => {
      const { audioFile, title, description, publisher, coverFile } = data;
      const regex: RegExp = /[^\\]*\.(\w+)$/;
      const audioExt = audioFile!.name.match(regex)![1];
      const imageExt = coverFile!.name.match(regex)![1];
      const newTitle = lodash.kebabCase(title).toLowerCase();
      const audioStorageRef = ref(
        storage,
        `audio/${newTitle}/${newTitle}.${audioExt}`
      );
      const imageStorageRef = ref(
        storage,
        `audio/${newTitle}/cover.${imageExt}`
      );
      uploadBytes(audioStorageRef, audioFile!)
        .then((snapshot) => {
          uploadBytes(imageStorageRef, coverFile!)
            .then((snapshot) => {
              const newData = {
                title,
                description,
                publisher,
                audioFile: `${newTitle}.${audioExt}`,
                coverFile: `cover.${imageExt}`,
                dateCreated: Timestamp.fromDate(new Date()),
              };
              try {
                setDoc(doc(db, "audioLibrary", newTitle), newData)
                  .then(() => resolve(true))
                  .catch((err) => reject(err));
              } catch (err) {
                reject(err);
              }
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  } catch (err) {
    console.log(err);
  }
}

async function fetchAudioData() {
  try {
    const querySnapshot = await getDocs(collection(db, "audioLibrary"));
    let data: object[] = [];
    return new Promise<Array<AudioData | object>>((resolve, reject) => {
      try {
        querySnapshot.forEach((doc) => {
          data = [...data, { id: doc.id, data: doc.data() }];
        });
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

/* async function fetchAudio() {
  try {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      let newData = [];
      fetchAudioData()
        .then((data) => {
          data?.forEach(async (doc) => {
            const coverURL = await getDownloadURL(
              // @ts-ignore
              ref(storage, `audio/${doc.id}/${doc.data.coverFile}`)
            );
            const audioURL = await getDownloadURL(
              // @ts-ignore
              ref(storage, `audio/${doc.id}/${doc.data.audioFile}`)
            );
            // @ts-ignore
            doc.data = { ...doc.data, coverURL, audioURL };
            newData.push(doc);
          });
          // @ts-ignore
          resolve(newData);
        })
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
} */

async function deleteAudio() {}

async function uploadImage() {}

async function fetchImage() {}

async function deleteImage() {}

export { uploadAudio, fetchAudioData };
