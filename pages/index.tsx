import { signInWithGoogle } from "../firebase/clientApp"

// TODO: Add promise handling, check firebase docs

export default function Index() {
    return (
        <div>
            <h1>Sign in with google</h1>
            <button onClick={() => signInWithGoogle().catch(err => alert("error"))}>Sign in</button>
        </div>
    )
}