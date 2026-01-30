import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertDisciplinaryRecord } from "@shared/routes";

export function useDisciplinaryRecords() {
  return useQuery({
    queryKey: [api.discipline.list.path],
    queryFn: async () => {
      const res = await fetch(api.discipline.list.path);
      if (!res.ok) throw new Error("Failed to fetch disciplinary records");
      return api.discipline.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDisciplinaryRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDisciplinaryRecord) => {
      const res = await fetch(api.discipline.create.path, {
        method: api.discipline.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create record");
      return api.discipline.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.discipline.list.path] }),
  });
}
