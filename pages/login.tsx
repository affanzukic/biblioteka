import { signInWithGoogle } from "../firebase/clientApp";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <h1>Login with google</h1>
      <GoogleButton
        type="dark"
        onClick={() => {
          signInWithGoogle()
            .then((result) => {
              const user = result.user;
              const regex: RegExp =
                /^[a-z]+\.[a-z]+\@(?:cetvrta-gimnazija.edu.ba)/;
              if (user?.providerData[0].email?.match(regex)) {
                localStorage.setItem(
                  "currentUser",
                  JSON.stringify(user?.providerData[0])
                );
                router.push("/");
              } else {
                setErr(
                  "Molimo prijavite se sa domenom cetvrta-gimnazija.edu.ba"
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      />
      {err !== null ? <p>{err}</p> : null}
    </div>
  );
}
