import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AudioPlayerProvider } from "react-use-audio-player";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AudioPlayerProvider>
      <main>
        <Component {...pageProps} />
      </main>
    </AudioPlayerProvider>
  );
}

export default MyApp;
