import { signInWithGoogle } from "../firebase/clientApp";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router"

export default function Login() {
    const router = useRouter()
  return (
    <div>
      <h1>Login with google</h1>
      <GoogleButton
        type="dark"
        onClick={() => {
          signInWithGoogle().then(result => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            const usrToSave = {
                user,
                token
            }
            localStorage.setItem("currentUser", JSON.stringify(usrToSave))
            router.push("/")
          }).catch(err => {
              throw new Error("Auth error!")
          })
        }}
      />
    </div>
  );
}
