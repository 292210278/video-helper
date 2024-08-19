import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeDir } from "../../services/apiDir";
import { toast } from "react-hot-toast";

export function useMakeDir() {
  const queryClient = useQueryClient();
  const mutationDir = useMutation({
    mutationFn: async ({ name, videoPath, dirPosterPath }) =>
      await makeDir(name, videoPath, dirPosterPath),
    onSuccess: () => {
      toast.success("成功创建");

      queryClient.invalidateQueries({ queryKey: ["dirs"] });
    },
  });
  return mutationDir;
}
