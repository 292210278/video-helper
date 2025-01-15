import "video.js/dist/video-js.css";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import SubtitlesOctopus from "libass-wasm";
function VideoPlay() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const subtitlesRef = useRef(null);

  const canvasRef = useRef(null);
  const [screenshot, setScreenshot] = useState(null);

  const handleScreenshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/png");
      setScreenshot(dataURL);
    }
  };
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
      playerRef.current.ready(() => {
        if (!playerRef.current.controlBar.getChild("PlaybackRateMenuButton")) {
          playerRef.current.controlBar.addChild("PlaybackRateMenuButton");
        }
        playerRef.current.playbackRate(1);

        playerRef.current.playbackRates([0.5, 1, 1.5, 2, 2.5, 3]);
        subtitlesRef.current = new SubtitlesOctopus(options);
      });
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
      <button onClick={handleScreenshot} style={{ marginBottom: "20px" }}>
        截图
      </button>

      {screenshot && (
        <div>
          <h2>截图结果：</h2>
          <img src={screenshot} alt="截图" style={{ maxWidth: "100%" }} />
          <br />

          <a href={screenshot} download="screenshot.png">
            下载截图
          </a>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </>
  );
}

export default VideoPlay;
