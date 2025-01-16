import "video.js/dist/video-js.css";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import SubtitlesOctopus from "libass-wasm";
import "../styles/screen_shot.css";
function VideoPlay() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const subtitlesRef = useRef(null);

  const canvasRef = useRef(null);
  const [screenshot, setScreenshot] = useState(null);

  const handleScreenshot = (e) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      video &&
      canvas &&
      (e.target.title === "截图" || e.target.closest('[title="截图"]'))
    ) {
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/png");
      setScreenshot(dataURL);

      showScreenshotMessage();
    }
  };
  function showScreenshotMessage() {
    const playerEl = playerRef.current.player().el();

    let messageEl = playerEl.querySelector(".vjs-screenshot-message");
    let screenshotMessageTimeout = null;
    if (!messageEl) {
      messageEl = document.createElement("div");
      messageEl.className = "vjs-screenshot-message";
      messageEl.textContent = "截图成功";
      playerEl.appendChild(messageEl);

      Object.assign(messageEl.style, {
        position: "absolute",
        top: "10px",
        left: "10px",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "5px 10px",
        borderRadius: "5px",
        zIndex: "999",
      });
    }

    messageEl.style.display = "block";
    clearTimeout(screenshotMessageTimeout);
    screenshotMessageTimeout = setTimeout(() => {
      messageEl.style.display = "none";
    }, 2000);
    console.log("成功");
  }
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

      const Button = videojs.getComponent("Button");
      class ScreenShotButton extends Button {
        constructor(player, options) {
          super(player, options);

          this.addClass("vjs-screenshot-button");
          this.controlText("截图");

          this.on(player, "click", (e) => handleScreenshot(e));
        }
        createEl() {
          const el = super.createEl("button", {
            className: "vjs-screenshot-button vjs-control",
            innerHTML: `
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="vjs-screenshot-icon"
              >
                <path d="M12 13.4108L9.44618 15.9646C9.79807 16.5601 10 17.2548 10 17.9966C10 20.2057 8.20914 21.9966 6 21.9966C3.79086 21.9966 2 20.2057 2 17.9966C2 15.7874 3.79086 13.9966 6 13.9966C6.74181 13.9966 7.43645 14.1985 8.03197 14.5504L10.5858 11.9966L4.56497 5.97577C3.78392 5.19472 3.78392 3.92839 4.56497 3.14734L12 10.5824L19.435 3.14734C20.2161 3.92839 20.2161 5.19472 19.435 5.97577L13.4142 11.9966L15.968 14.5504C16.5635 14.1985 17.2582 13.9966 18 13.9966C20.2091 13.9966 22 15.7874 22 17.9966C22 20.2057 20.2091 21.9966 18 21.9966C15.7909 21.9966 14 20.2057 14 17.9966C14 17.2548 14.2019 16.5601 14.5538 15.9646L12 13.4108ZM6 19.9966C7.10457 19.9966 8 19.1012 8 17.9966C8 16.892 7.10457 15.9966 6 15.9966C4.89543 15.9966 4 16.892 4 17.9966C4 19.1012 4.89543 19.9966 6 19.9966ZM18 19.9966C19.1046 19.9966 20 19.1012 20 17.9966C20 16.892 19.1046 15.9966 18 15.9966C16.8954 15.9966 16 16.892 16 17.9966C16 19.1012 16.8954 19.9966 18 19.9966Z"></path>
              </svg>
            `,
          });

          return el;
        }
      }

      videojs.registerComponent("ScreenshotButton", ScreenShotButton);

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
        if (!playerRef.current.controlBar.getChild("ScreenshotButton")) {
          playerRef.current.controlBar.addChild("ScreenshotButton", {}, 10);
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
