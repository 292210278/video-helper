import { useQuery } from "@tanstack/react-query";
import { getVideo } from "../../services/apiVideo";

export function useGetVideo(id, path) {
  const {
    isLoading: isGetting,
    data: video,
    error,
  } = useQuery({
    queryKey: ["video", id, path],
    queryFn: () => {
      return getVideo(id, path);
    },
  });

  return { isGetting, video, error };
}
