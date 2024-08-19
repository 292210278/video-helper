export async function getDirPath(dirPath) {
  try {
    const res = await fetch(
      `http://localhost:3000/dir/path?dirPath=${dirPath}`
    );
    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function makeDir(name, videoPath, dirPosterPath) {
  try {
    await fetch(`http://localhost:3000/dir/path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dirName: name,
        hardlinkPath: videoPath,
        dirPosterPath: dirPosterPath,
      }),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteDir(path) {
  try {
    await fetch(`http://localhost:3000/dir/path?path=${path}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.log(err);
  }
}
