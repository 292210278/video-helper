import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDir } from "../../services/apiDir";
import toast from "react-hot-toast";

export function useDeleteDir() {
  const queryClient = useQueryClient();
  const mutationDir = useMutation({
    mutationFn: async (path) => await deleteDir(path),
    onSuccess: () => {
      toast.success("成功删除");
      queryClient.invalidateQueries({ queryKey: ["dirs"] });
    },
  });

  return mutationDir;
}
