export async function getPoster(name) {
  try {
    if (!name) return "";
    const res = await fetch(`http://localhost:3000/poster?name=${name}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function downLoadPosterAndMakePosterDir(name, url) {
  try {
    const res = await fetch(
      `http://localhost:3000/poster?name=${name}&imgPath=${url}`,
      {
        method: "POST",
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
