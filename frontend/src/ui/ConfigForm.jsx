import { useContext } from "react";
import { useForm } from "react-hook-form";
import ConfigContext from "../contexts/ConfigContext";

function ConfigForm({ onCloseModal }) {
  const {
    setPicturePath,
    setVideoPath,
    setPlayerPath,
    picturePath,
    videoPath,
    playerPath,
  } = useContext(ConfigContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      picturePath: picturePath,
      videoPath: videoPath,
      playerPath: playerPath,
    },
  });

  function handleConfig(data) {
    localStorage.setItem("picture-path", data.picturePath);
    localStorage.setItem("video-path", data.videoPath);
    localStorage.setItem("player-path", data.playerPath);
    setPicturePath(data.picturePath);
    setVideoPath(data.videoPath);
    setPlayerPath(data.playerPath);
    onCloseModal();
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit(handleConfig)}>
      <label className="movie-form_text" htmlFor="">
        图库地址
      </label>

      <input
        className="movie-form-name"
        {...register("picturePath", { required: "请填写图库地址" })}
      />
      {errors.picturePath && (
        <span className="error-message">{errors.picturePath.message}</span>
      )}
      <label className="movie-form_text" htmlFor="">
        存放视频地址
      </label>

      <input
        className="movie-form-name"
        {...register("videoPath", { required: "请填写视频地址" })}
      />
      {errors.videoPath && (
        <span className="error-message">{errors.videoPath.message}</span>
      )}
      <label className="movie-form_text" htmlFor="">
        播放器启动文件地址
      </label>

      <input
        className="movie-form-name"
        {...register("playerPath", { required: "请填写播放器启动文件地址" })}
      />
      {errors.playerPath && (
        <span className="error-message">{errors.playerPath.message}</span>
      )}
      <input className="movie-form-submit_btn" type="submit" />
    </form>
  );
}

export default ConfigForm;
