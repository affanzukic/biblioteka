import Head from "next/head"
import AdminSidebar from "../../components/AdminSidebar"

export default function Index() {
    return (
        <div id="admin" className="dark flex">
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
