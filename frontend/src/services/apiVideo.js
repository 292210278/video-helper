export async function createVideo(path, name, id, type, dirName) {
  try {
    await fetch(
      `http://localhost:3000/video?path=${path}&name=${`${name}-${id}-${type}`}&dirName=${dirName}`,
      {
        method: "POST",
      }
    );
  } catch (err) {
    console.log(err);
  }
}

export async function getVideo(id, path) {
  if (!path) return [];
  const res = await fetch(
    `http://localhost:3000/video/path?id=${id}&dirPath=${path}`,
    {
      method: "GET",
    }
  );
  const data = await res.json();
  return data;
}

export async function uploadSub(path, id, subPath, episode) {
  try {
    await fetch("http://localhost:3000/sub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: path,
        id: id,
        subPath: subPath,
        episodeStart: episode,
      }),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function uploadEpisode(
  episodePath,
  hardlinkPath,
  hardlinkName,
  episode
) {
  try {
    await fetch("http://localhost:3000/upload/episode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourcePath: episodePath,
        hardlinkPath: hardlinkPath,
        hardlinkName: hardlinkName,
        episodeStart: episode,
      }),
    });
  } catch (err) {
    console.log(err);
  }
}
