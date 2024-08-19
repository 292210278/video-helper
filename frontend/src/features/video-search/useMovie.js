import { useQuery } from "@tanstack/react-query";
import { getMovieList } from "../../services/apiMovie";

export function useMovie(query, type) {
  const {
    isLoading,
    data: movies,
    error,
  } = useQuery({
    //记得让query知道改变了

    queryKey: ["movie", query, type],
    queryFn: () => {
      return getMovieList(query, type);
    },
  });

  return { isLoading, movies, error };
}
