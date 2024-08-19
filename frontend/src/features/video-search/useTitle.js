import { useQuery } from "@tanstack/react-query";
import { getVideoTitle } from "../../services/apiMovie";

export function useTitle(id, type) {
  const {
    isLoading,
    data: titles,
    error,
  } = useQuery({
    //记得让query知道改变了
    queryKey: ["movie", id, type],
    queryFn: () => {
      return getVideoTitle(id, type);
    },
  });

  return { isLoading, titles, error };
}
