import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVideo, uploadEpisode, uploadSub } from "../../services/apiVideo";

export function useCreateVideo(path, name, id, type, dirName) {
  const queryClient = useQueryClient();
  const mutationVideo = useMutation({
    mutationFn: async () => await createVideo(path, name, id, type, dirName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });

  return mutationVideo;
}

export function useUploadSub() {
  const mutationUploadSub = useMutation({
    mutationFn: ({ path, id, subPath, episode }) => {
      uploadSub(path, id, subPath, episode);
    },
  });

  return mutationUploadSub;
}

export function useUploadEpisode() {
  const queryClient = useQueryClient();
  const mutationUploadSub = useMutation({
    mutationFn: async ({
      episodePath,
      hardlinkPath,
      hardlinkName,
      episode,
    }) => {
      return await uploadEpisode(
        episodePath,
        hardlinkPath,
        hardlinkName,
        episode
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });

  return mutationUploadSub;
}
