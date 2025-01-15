import "video.js/dist/video-js.css";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import SubtitlesOctopus from "libass-wasm";
function VideoPlay() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const subtitlesRef = useRef(null);
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        preload: "auto",
        responsive: true,
        fluid: true,
        width: 640,
        height: 360,
      });

      var options = {
        video: videoElement,
        subUrl: "http://localhost:3001/subtitles.ass",
        workerUrl: "/subtitles-octopus-worker.js",
        font: "/font.ttf",
        legacyWorkerUrl: "/subtitles-octopus-worker-legacy.js",
        wasmUrl: "/subtitles-octopus-worker.wasm",
        fallbackFont: "/font.ttf",
      };

      subtitlesRef.current = new SubtitlesOctopus(options);
    }

    return () => {};
  }, []);

  return (
    <>
      <h1>播放视频</h1>
      <video
        id="video"
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        data-setup="{}"
      >
        <source
          src="http://localhost:3001/output.m3u8"
          type="application/x-mpegURL"
        />
        您的浏览器不支持 HLS 视频播放。
      </video>
    </>
  );
}

export default VideoPlay;
