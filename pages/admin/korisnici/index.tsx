import { useState, useEffect } from "react";
import Head from "next/head";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import AdminUserComponent from "../../../components/admin/AdminUserComponent"
import AOS from "aos"
import "aos/dist/aos.css"

interface DataProps {
  admins: Array<object>
}

async function fetchAdmins() {
  try {
    const querySnapshot = await getDocs(collection(db, "admins"));
    let data: object[] = [];
    return new Promise((resolve, reject) => {
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

export default function Index({admins}: DataProps) {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    AOS.init({
      duration: 300
    })
    setDarkMode(
      JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode
    );
  }, []);
  return (
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
          </div>
          <div id="users" className="mt-4">
            {admins !== null ? (
              <div id="user-admin-data" className="mr-24 ml-2" data-aos="fadeIn">
                <AdminUserComponent />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

async function getStaticProps() {
  // @ts-ignore
  let admins = []

  // TODO: fix type casting  
  // @ts-ignore
  fetchAdmins().then(data => admins = data).catch(err => console.log(err))

  return {
    props: {
      // @ts-ignore
      admins
    }
  }
}
