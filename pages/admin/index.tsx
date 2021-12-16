import Head from "next/head"
import AdminSidebar from "../../components/AdminSidebar"
import { useState, useEffect } from "react"

export default function Index() {
    const [darkMode, setDarkMode] = useState(true)
    useEffect(() => {
        setDarkMode(JSON.parse(localStorage.getItem("currentUser") || "{}").darkMode)
    }, [])
    return (
        <div id="admin" className={darkMode ? "dark flex" : "flex"}>
            <Head>
                <title>Online biblioteka - Admin management</title>
            </Head>
            <AdminSidebar />
            <div className="content-container">
                <div className="content-list">
                    <h1>Hello world</h1>
                    <h1>Hello world</h1>
                    <h1>Hello world</h1>
                    <h1>Hello world</h1>
                    <h1>Hello world</h1>
                </div>
            </div>
        </div>
    )
}
