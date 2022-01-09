import { collection, getDocs, doc, deleteDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import { nanoid } from "nanoid"

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

async function createAdmin(email: string) {
  try {
    const data = {
      email,
      createdAt: Timestamp.fromDate(new Date())
    }
    await setDoc(doc(db, "admins", nanoid(6).toLowerCase()), data)
  } catch (err) {
    console.log(err)
  }
}

export { fetchAdmins, deleteAdmin, createAdmin };
