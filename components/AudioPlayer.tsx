import { useState, useEffect } from "react";
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";

interface AudioProps {
  audioURL: string;
  title: string;
}

export default function AudioPlayer({ audioURL, title }: AudioProps) {
  const [state, setState] = useState(title);
  const [volumeValue, setVolumeValue] = useState(0.0);
  const { togglePlayPause, ready, loading, playing, volume } = useAudioPlayer({
    src: audioURL,
    html5: true,
    autoplay: true,
  });
  const { position, duration, seek } = useAudioPosition({
    highRefreshRate: true,
  });
  useEffect(() => {
    setVolumeValue(volume());
    if (!ready && !loading) {
      setState("Greška pri učitavanju fajla!");
    }
    if (loading) {
      setState("Učitavanje fajla...");
    }
    if (!loading) {
      setState(title);
    }
  }, [loading, ready, title, volume]);
  return (
    <div
      id="audio-player"
      className="flex flex-row fixed inset-x-0 bottom-0 w-full h-24 dark:bg-gray-900 bg-gray-300 z-50 p-4 border-t-2 border-solid dark:border-gray-600 border-gray-400 justify-evenly"
    >
      <div
        id="title"
        className="flex flex-col pl-4 justify-center content-center"
      >
        <p className="font-semibold transition duration-200">{state}</p>
      </div>
      <div
        id="controls"
        className="flex flex-col justify-center content-center"
      >
        <div
          id="play-pause"
          className="flex flex-row justify-center content-center mb-2"
          onClick={togglePlayPause}
        >
          {playing ? (
            <BsFillPauseCircleFill
              size="34"
              className="hover:text-gray-500 transition duration-200 dark:text-gray-400 dark:hover:text-gray-200 text-gray-700"
            />
          ) : (
            <BsFillPlayCircleFill
              size="34"
              className="hover:text-gray-500 transition duration-200 dark:text-gray-400 dark:hover:text-gray-200 text-gray-700"
            />
          )}
        </div>
        <div
          id="seekbar"
          className="flex flex-row justify-center content-center"
        >
          <p id="currentTime" className="dark:text-gray-400 px-2">
            {new Date(position * 1000).toISOString().substr(14, 5)}
          </p>
          <div id="slider" className="flex">
            <input
              type="range"
              defaultValue={0}
              max={duration}
              className="w-80 bg-transparent rounded-full"
              value={position}
              // @ts-ignore
              onChange={(e) => seek(e.target.value)}
            />
          </div>
          <p id="currentTime" className="dark:text-gray-400 px-2">
            {new Date(duration * 1000).toISOString().substr(14, 5)}
          </p>
        </div>
      </div>
      <div id="volume" className="flex flex-row justify-center content-center">
        <BsFillVolumeUpFill
          size="24"
          className="flex my-auto mr-2hover:text-gray-500 transition duration-200 dark:text-gray-400 dark:hover:text-gray-200 text-gray-700 "
        />
        <input
          type="range"
          defaultValue={volumeValue}
          min={0}
          max={1}
          step="0.05"
          className="w-30 bg-transparent rounded-full"
          value={volumeValue}
          onChange={(e) => {
            // @ts-ignore
            setVolumeValue(e.target.value);
            volume(e.target.value);
          }}
        />
        <p id="currentTime" className="flex my-auto dark:text-gray-400 px-2">
          {`${Math.round(volumeValue * 100)}%`}
        </p>
      </div>
    </div>
  );
}
