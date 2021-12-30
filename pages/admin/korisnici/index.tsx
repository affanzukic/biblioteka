import { useState, useEffect } from "react";
import Head from "next/head";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminUserComponent from "../../../components/admin/AdminUserComponent"
import AOS from "aos"
import "aos/dist/aos.css"
import { fetchAdmins } from "../../../utils/firebase/firebase"

interface DataProps {
  admins: Array<object>
}

function showModal() {

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
              <div id="user-admin-data" className="mr-24 ml-2 space-y-2" data-aos="fadeIn">
                <AdminUserComponent email="testna.adresa@cetvrta-gimnazija.edu.ba" />
                <AdminUserComponent email="jedan.dva@cetvrta-gimnazija.edu.ba" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* Add modal */}
    </div>
  );
}

async function getStaticProps() {
  let admins: object[] | undefined = []

  // TODO: fix type casting  
  fetchAdmins().then(data => admins = data).catch(err => console.log(err))

  return {
    props: {
      admins
    }
  }
}
