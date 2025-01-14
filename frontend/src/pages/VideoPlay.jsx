import "video.js/dist/video-js.css";
import { useEffect, useRef } from "react";
import videojs from "video.js";
function VideoPlay() {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const videoElement = document.getElementById("video");
    console.log("videoElement:", videoElement); // 检查元素是否在 DOM 中
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        preload: "auto",
        responsive: true,
        fluid: true,
      });

      playerRef.current.on("ready", () => {
        console.log("Video.js Player Ready!");
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
        width="640"
        height="360"
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
