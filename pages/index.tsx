import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Index() {
    const [ user, setUser ] = useState<object|null|undefined|string>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const router = useRouter()
    useEffect(() => {
        try {
            if (Object.keys(JSON.parse(localStorage.getItem("currentUser") ||'{}')).length === 0) {
                router.push("/login")
            } else {
                setUser(JSON.parse(localStorage.getItem("currentUser") ||'{}'))
                setLoading(false)
            }
        } catch (err) {
            throw new Error("Error parsing JSON")
        }
    }, [router])
    return (
        <div>
            {loading ? <h1>Loading...</h1> : <Content />}
        </div>
    )
}

function Content() {
    return (
        <div>
            <h1>Page content</h1>
        </div>
    )
}