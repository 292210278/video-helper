import { useMutation } from "@tanstack/react-query";
import { downLoadPosterAndMakePosterDir } from "../../services/apiPhoto";

export function useDownLoadPoster() {
  const mutationDownLoadPoster = useMutation({
    mutationFn: ({ name, url }) => {
      console.log(name, url);

      downLoadPosterAndMakePosterDir(name, url);
    },
  });

  return mutationDownLoadPoster;
}
