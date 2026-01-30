import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateLeaveRequest, type UpdateLeaveStatusRequest } from "@shared/routes";

export function useLeaveRequests() {
  return useQuery({
    queryKey: [api.leave.list.path],
    queryFn: async () => {
      const res = await fetch(api.leave.list.path);
      if (!res.ok) throw new Error("Failed to fetch leave requests");
      return api.leave.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLeaveRequest) => {
      const res = await fetch(api.leave.create.path, {
        method: api.leave.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create leave request");
      }
      return api.leave.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.leave.list.path] }),
  });
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: UpdateLeaveStatusRequest & { id: number }) => {
      const url = buildUrl(api.leave.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.leave.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update leave status");
      return api.leave.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.leave.list.path] }),
  });
}
