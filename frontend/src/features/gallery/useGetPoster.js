import { useQuery } from "@tanstack/react-query";
import { getPoster } from "../../services/apiPhoto";

export function useGetPoster(name) {
  const {
    isLoading,
    data: poster,
    error,
  } = useQuery({
    queryKey: ["poster"],
    queryFn: () => {
      if (!name) return "";

      return getPoster(name);
    },
  });

  return { isLoading, poster, error };
}
