import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertTrainingRecord } from "@shared/routes";

export function useTrainingRecords() {
  return useQuery({
    queryKey: [api.training.list.path],
    queryFn: async () => {
      const res = await fetch(api.training.list.path);
      if (!res.ok) throw new Error("Failed to fetch training records");
      return api.training.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTrainingRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTrainingRecord) => {
      const res = await fetch(api.training.create.path, {
        method: api.training.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create training record");
      return api.training.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.training.list.path] }),
  });
}
