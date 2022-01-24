import { useAudioPlayer } from "react-use-audio-player";

interface AudioProps {
  audioURL: string;
  title: string;
}

export default function AudioPlayer({ audioURL, title }: AudioProps) {
  const { togglePlayPause, ready, loading, playing } = useAudioPlayer({
    src: audioURL,
    html5: true,
  });
  return (
    // TODO: Napraviti audio player
    <div
      id="audio-player"
      className="flex flex-row absolute inset-x-0 bottom-0 w-full h-16 dark:bg-gray-900 bg-gray-400 z-50 p-20"
    ></div>
  );
}
