import { useQuery } from "@tanstack/react-query";
import { getDirPath } from "../../services/apiDir";

export function useGetDir(videoPath) {
  const {
    isLoading,
    data: dirs,
    error,
  } = useQuery({
    queryKey: ["dirs", videoPath],
    queryFn: () => {
      if (!videoPath) return null;

      return getDirPath(videoPath);
    },
    enabled: !!videoPath,
    refetchOnWindowFocus: true,
  });

  return { isLoading, dirs, error };
}
