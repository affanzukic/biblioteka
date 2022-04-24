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
  author: string;
  language: string;
  publisher: string;
  audioFile?: File | null;
  coverFile?: File | null;
}

interface ImageData {
  title: string;
  description: string;
  author: string;
  language: string;
  publisher: string;
  coverFile: File | null;
  imageFiles: FileList | null;
}

interface IVideoData {
  title: string;
  description: string;
  publisher: string;
  language: string;
  author: string;
  coverFile: File | null;
  videoFile: File | null;
}

interface VideoData {
  title: string;
  description: string;
  author: string;
  publisher: string;
  language: string;
  coverFile: string;
  videoFile: string;
  dateCreated: Timestamp;
}

async function uploadAudio(data: AudioData) {
  if (data === null) return;
  try {
    return new Promise((resolve, reject) => {
      const {
        audioFile,
        title,
        language,
        author,
        description,
        publisher,
        coverFile,
      } = data;
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
                author,
                language,
                audioFile: `${newTitle}.${audioExt}`,
                coverFile: `cover.${imageExt}`,
                dateCreated: Timestamp.fromDate(new Date()),
              };
              try {
                setDoc(doc(db, "audioLibrary", newTitle), newData)
                  .then(() => resolve(true))
                  .catch((err) => {
                    throw new Error(err);
                  });
              } catch (err) {
                reject(err);
              }
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
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
    await deleteDoc(doc(db, "audioLibrary", id));
    listAll(ref(storage, `audio/${id}`))
      .then((listData) => {
        let itemsToDelete: string[] = [];
        listData.items.map((data) => itemsToDelete.push(data.name));
        itemsToDelete.forEach(async (item) => {
          await deleteObject(ref(storage, `audio/${id}/${item}`));
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
  }
}

async function updateAudio(id: string, newData: AudioData) {
  if (id === null || newData === null) return;
  try {
    let newAudio = false
    let newCover = false
    if (newData?.audioFile?.name !== "") newAudio = true;
    if (newData?.coverFile?.name !== "") newCover = true;

    if (!newAudio) delete newData?.audioFile
    if (!newCover) delete newData?.coverFile

    if (newAudio) {
      // TODO: Implement replacing audio file
    }

    if (newCover) {
      // TODO: Implement replacing cover file
    }

  } catch (error) {
    console.error(error)
  }
}

async function uploadImage(data: ImageData) {
  if (data === null) return;
  try {
    return new Promise((resolve, reject) => {
      const {
        title,
        author,
        language,
        publisher,
        description,
        coverFile,
        imageFiles,
      } = data;
      const regex: RegExp = /[^\\]*\.(\w+)$/;
      const newTitle = lodash.kebabCase(title).toLowerCase();
      const coverFileExt = coverFile!.name.match(regex)![1];
      const coverStorageRef = ref(
        storage,
        `image/${newTitle}/cover.${coverFileExt}`
      );
      // @ts-ignore
      const fileList = Array.from(imageFiles);
      uploadBytes(coverStorageRef, coverFile!)
        .then(() => {
          let fileArrayForDatabase: string[] = [];
          fileList.map(async (file, idx) => {
            const name = `${idx}.${file!.name.match(regex)![1]}`;
            const imageFileRef = ref(storage, `image/${newTitle}/${name}`);
            fileArrayForDatabase = [...fileArrayForDatabase, name];
            await uploadBytes(imageFileRef, file);
          });
          const newData = {
            title,
            description,
            publisher,
            author,
            language,
            coverFile: `cover.${coverFileExt}`,
            imageFiles: fileArrayForDatabase,
            dateCreated: Timestamp.fromDate(new Date()),
          };
          try {
            setDoc(doc(db, "imageLibrary", newTitle), newData)
              .then(() => resolve(true))
              .catch((err) => {
                throw new Error(err);
              });
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (err) {
    console.log(err);
  }
}

async function fetchImage() {
  try {
    const querySnapshot = await getDocs(collection(db, "imageLibrary"));
    let data: object[] = [];
    return new Promise<Array<ImageData | object>>((resolve, reject) => {
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

async function deleteImage(id: string) {
  try {
    await deleteDoc(doc(db, "imageLibrary", id));
    const listData = await listAll(ref(storage, `image/${id}`));
    let itemsToDelete: string[] = [];
    listData.items.map((data) => itemsToDelete.push(data.name));
    itemsToDelete.forEach(async (item) => {
      await deleteObject(ref(storage, `image/${id}/${item}`));
    });
  } catch (err) {
    console.log(err);
  }
}

async function fetchVideo() {
  try {
    const querySnapshot = await getDocs(collection(db, "videoLibrary"));
    let data: object[] = [];
    return new Promise<Array<VideoData | object>>((resolve, reject) => {
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

async function uploadVideo(data: IVideoData) {
  if (data === null) return;
  try {
    return new Promise((resolve, reject) => {
      const {
        videoFile,
        author,
        language,
        title,
        description,
        publisher,
        coverFile,
      } = data;
      const regex: RegExp = /[^\\]*\.(\w+)$/;
      const videoExt = videoFile!.name.match(regex)![1];
      const imageExt = coverFile!.name.match(regex)![1];
      const newTitle = lodash.kebabCase(title).toLowerCase();
      const videoStorageRef = ref(
        storage,
        `video/${newTitle}/${newTitle}.${videoExt}`
      );
      const imageStorageRef = ref(
        storage,
        `video/${newTitle}/cover.${imageExt}`
      );
      uploadBytes(videoStorageRef, videoFile!)
        .then((snapshot) => {
          uploadBytes(imageStorageRef, coverFile!)
            .then((snapshot) => {
              const newData = {
                title,
                description,
                publisher,
                author,
                language,
                videoFile: `${newTitle}.${videoExt}`,
                coverFile: `cover.${imageExt}`,
                dateCreated: Timestamp.fromDate(new Date()),
              };
              try {
                setDoc(doc(db, "videoLibrary", newTitle), newData)
                  .then(() => resolve(true))
                  .catch((err) => {
                    throw new Error(err);
                  });
              } catch (err) {
                reject(err);
              }
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (err) {
    console.log(err);
  }
}

async function deleteVideo(id: string) {
  try {
    await deleteDoc(doc(db, "videoLibrary", id));
    listAll(ref(storage, `video/${id}`))
      .then((listData) => {
        let itemsToDelete: string[] = [];
        listData.items.map((data) => itemsToDelete.push(data.name));
        itemsToDelete.forEach(async (item) => {
          await deleteObject(ref(storage, `video/${id}/${item}`));
        });
        console.log(itemsToDelete);
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
  }
}

export {
  uploadAudio,
  fetchAudioData,
  deleteAudio,
  uploadImage,
  fetchImage,
  deleteImage,
  fetchVideo,
  uploadVideo,
  deleteVideo,
  updateAudio
};
