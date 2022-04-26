import { signInWithGoogle } from "../firebase/clientApp";
import GoogleButton from "react-google-button";
import { useRouter } from "next/router";
import { useState, memo } from "react";
import Image from "next/image";
import Head from "next/head";

const Login = memo(() => {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="flex flex-row">
      <Head>
        <title>Online biblioteka - prijava</title>
      </Head>
      <div
        id="background"
        className="fixed h-screen w-screen filter blur"
        style={{ zIndex: -1 }}
      >
        <Image
          src="https://wallpaperaccess.com/full/3133075.jpg"
          alt="bookshelf background"
          layout="fill"
        />
      </div>
      <div
        id="content"
        className="flex justify-center h-screen w-screen flex-col content-center mt-4"
      >
        <div id="text" className="mx-auto">
          <h1
            className="text-lightgray text-6xl font-semibold m-auto uppercase text-center"
            style={{ textShadow: "1px 1px 3px black" }}
          >
            Online biblioteka
          </h1>
          <h1
            className="text-lightgray text-2xl font-slim m-auto text-center"
            style={{ textShadow: "1px 1px 2px gray" }}
          >
            JU Četvrta gimnazija Ilidža
          </h1>
        </div>
        <div id="button" className="mx-auto mt-10 my-14">
          <GoogleButton
            type="dark"
            onClick={() => {
              signInWithGoogle()
                .then((result) => {
                  const user = result.user;
                  const regex: RegExp =
                    /^[a-z]+\.[a-z]+\@(?:cetvrta-gimnazija.edu.ba)/;
                  if (user?.providerData[0].email?.match(regex)) {
                    const data = { ...user?.providerData[0], darkMode: true };
                    localStorage.setItem("currentUser", JSON.stringify(data));
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
        </div>
        <div id="error" className="mx-auto -my-14">
          {err !== null ? (
            <div
              id="error"
              className="mx-auto my-auto bg-red-500 w-auto py-2 px-5 mt-2 content-center rounded shadow-lg transition ease-in-out duration-700"
            >
              <p className="text-white text-center">
                Molimo prijavite se sa domenom cetvrta-gimnazija.edu.ba
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default Login;
