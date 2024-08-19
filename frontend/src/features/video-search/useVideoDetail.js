import { useQuery } from "@tanstack/react-query";
import { getVideoDetail } from "../../services/apiMovie";

export function useMovieDetail(id, type) {
  const {
    isLoading,
    data: movieDetail,
    error,
  } = useQuery({
    //记得让query知道改变了
    queryKey: ["movie-detail", id, type],
    queryFn: () => {
      return getVideoDetail(id, type);
    },
  });

  return { isLoading, movieDetail, error };
}
