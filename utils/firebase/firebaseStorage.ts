import { storage, db } from "../../firebase/clientApp";
import { ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
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

interface ImageData {
  title: string
  description: string
  publisher: string
  coverFile: File | null
  imageFiles: FileList | null
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

async function deleteAudio(id: string) {
  try {
    await deleteDoc(doc(db, "audioLibrary", id))
    listAll(ref(storage, `audio/${id}`)).then(listData => {
      let itemsToDelete: string[] = []
      listData.items.map(data => itemsToDelete.push(data.name))
      itemsToDelete.forEach(async (item) => {
        await deleteObject(ref(storage, `audio/${id}/${item}`))
      })
    }).catch(err => console.log(err))
  } catch (err) {
    console.log(err)
  }
}

async function uploadImage(data: ImageData) {
  if (data === null) return
  try {
    return new Promise((resolve, reject) => {
      const { title, publisher, description, coverFile, imageFiles } = data
      const regex: RegExp = /[^\\]*\.(\w+)$/;
      const newTitle = lodash.kebabCase(title).toLowerCase()
      const coverFileExt = coverFile!.name.match(regex)![1]
      const coverStorageRef = ref(
        storage,
        `image/${newTitle}/cover.${coverFileExt}`
      );
      // @ts-ignore
      const fileList = Array.from(imageFiles)
      uploadBytes(coverStorageRef, coverFile!).then(() => {
        let fileArrayForDatabase: string[] = []
        fileList.map(async (file, idx) => {
          const name = `${idx}.${file!.name.match(regex)![1]}`
          const imageFileRef = ref(storage, `image/${newTitle}/${name}`)
          fileArrayForDatabase = [...fileArrayForDatabase, name]
          await uploadBytes(imageFileRef, file)
        })
        const newData = {
          title,
          description,
          publisher,
          coverFile: `cover.${coverFileExt}`,
          imageFiles: fileArrayForDatabase,
          dateCreated: Timestamp.fromDate(new Date())
        }
        try {
          setDoc(doc(db, "imageLibrary", newTitle), newData)
            .then(() => resolve(true))
            .catch((err) => reject(err));
        } catch (err) {
          reject(err);
        }
      }).catch(err => reject(err))
    })
  } catch (err) {
    console.log(err)
  }
}

async function fetchImage() {}

async function deleteImage() {}

export { uploadAudio, fetchAudioData, deleteAudio, uploadImage };
