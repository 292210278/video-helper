import { useForm } from "react-hook-form";
import Modal from "../../ui/Modal";
import ChooseDir from "./ChooseDir";
import { useContext, useState } from "react";
import SearchContext from "../../contexts/SearchContext";
import { useSearchParams } from "react-router-dom";
import { useMakeDir } from "./useMakeDir";
import ConfigContext from "../../contexts/ConfigContext";

//创建文件夹

function CreateMovieForm({ onCloseModal, type }) {
  const { mutate } = useMakeDir();
  const [searchParams] = useSearchParams();
  const dirName = searchParams.get("dirName");
  const { searchQuery, setVideos, searchType } = useContext(SearchContext);
  const { videoPath } = useContext(ConfigContext);

  const [movies, setMovie] = useState([]);
  function focusInput() {
    const input = document.querySelector(".search-result-input");
    input.focus();
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = {
      ...data,
      dirName: dirName,
      movies,
    };

    onCloseModal();
    //设置查询的类型

    searchType(formData.fileType);
    //设置查询的名字
    searchQuery(formData.fileName);
    focusInput();
    setVideos([formData]);
    // setVideos(formData);
  };

  if (type === "dir")
    return (
      <form
        onSubmit={handleSubmit((data) => {
          mutate({
            name: data.fileName,
            videoPath,
            dirPosterPath: data.picture,
          });
          onCloseModal();
        })}
        className="movie-form"
      >
        <label className="movie-form_text" htmlFor="">
          显示名称
        </label>

        <input
          className="movie-form-name"
          {...register("fileName", { required: "请填写文件名" })}
        />
        <label className="movie-form_text" htmlFor="">
          图片路径
        </label>
        <input
          className="movie-form-name"
          {...register("picture", { required: "请填写图片路径" })}
        />
        <input className="movie-form-submit_btn" type="submit" />
      </form>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="movie-form"
      id="dir-form"
    >
      <label className="movie-form_text" htmlFor="">
        显示名称
      </label>
      <input
        className="movie-form-name"
        {...register("fileName", { required: "请填写文件名" })}
      />
      <select
        className="movie-form-name"
        {...register("fileType", { required: "请填写类型" })}
      >
        <option value="movie">电影</option>
        <option value="tv">剧集</option>
      </select>
      {errors.fileName && (
        <span className="error-message">{errors.fileName.message}</span>
      )}
      <label className="movie-form_file" htmlFor="">
        文件夹
      </label>
      <Modal>
        <Modal.Open opens="selected-dir">
          <button
            type="button"
            className="movie-form-add_btn"
            disabled={movies.length >= 1}
          >
            添加
          </button>
        </Modal.Open>
        <Modal.Window name="selected-dir">
          <ChooseDir handleAddMovie={setMovie} />
        </Modal.Window>
      </Modal>

      <h2>电影路径</h2>
      <ul className="movie-form-movies_list">
        {movies.length === 0
          ? null
          : movies.map((movie, index) => (
              <li key={index} onClick={() => setMovie([])}>
                {movie.name} - {movie.path}
              </li>
            ))}
      </ul>
      <input className="movie-form-submit_btn" type="submit" />
    </form>
  );
}

export default CreateMovieForm;
