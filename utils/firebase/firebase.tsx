import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";

async function fetchAdmins() {
  try {
    const querySnapshot = await getDocs(collection(db, "admins"));
    let data: object[] = [];
    return new Promise<Array<object>>((resolve, reject) => {
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

async function deleteAdmin(id: string) {
  try {
    await deleteDoc(doc(db, "admins", id));
  } catch (err) {
    console.log(err);
  }
}

async function createAdmin(data: object) {
  try {

  } catch (err) {
    console.log(err)
  }
}

export { fetchAdmins, deleteAdmin, createAdmin };
