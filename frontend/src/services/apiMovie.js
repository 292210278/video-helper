import toast from "react-hot-toast";
import { API_URL, OPTIONS } from "../config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`请求时间过长 过去了${s}秒`));
    }, s * 1000);
  });
};

export const getMovieList = async function (query, type) {
  try {
    if (!query) {
      return "请开始查找";
    }
    const fetchPro = fetch(
      `${API_URL}search/${type}?query=${query}&include_adult=false&language=zh&page=1`,
      OPTIONS
    );

    const res = await Promise.race([fetchPro, timeout(10)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.status_message} (${res.status})`);
    return data;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
  }
};

export const getVideoDetail = async function (id, type) {
  try {
    console.log(id, type);
    const url = `https://api.themoviedb.org/3/${type}/${id}?language=zh`;
    const query = fetch(url, OPTIONS);

    const res = await Promise.race([query, timeout(10)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.status_message} (${res.status})`);

    return data;
  } catch (err) {
    // console.error(`${err} 💥💥💥💥`);
    // alert(err.message);
    toast.error("没有网络，无法查询到详细信息");
    return {
      id: -1,
    };
  }
};

export const getVideoTitle = async function (id, type) {
  try {
    const url = `https://api.themoviedb.org/3/${type}/${id}/alternative_titles`;
    const query = fetch(url, OPTIONS);

    const res = await Promise.race([query, timeout(10)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.status_message} (${res.status})`);
    return data;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
  }
};
