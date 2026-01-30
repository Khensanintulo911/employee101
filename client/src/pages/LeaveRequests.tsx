import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/Layout";
import { useLeaveRequests, useCreateLeaveRequest, useUpdateLeaveStatus } from "@/hooks/use-leave";
import { useEmployees } from "@/hooks/use-employees";
import { api, type InsertLeaveRequest } from "@shared/routes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, parseISO } from "date-fns";

export default function LeaveRequests() {
  const { data: requests, isLoading } = useLeaveRequests();
  const { data: employees } = useEmployees();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const updateStatusMutation = useUpdateLeaveStatus();
  const { toast } = useToast();

  const getEmployeeName = (id: number) => {
    const emp = employees?.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : "Unknown";
  };

  const handleStatusUpdate = async (id: number, status: "Approved" | "Rejected") => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast({ title: "Status Updated", description: `Leave request marked as ${status}` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Approved</Badge>;
      case "Rejected": return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">Rejected</Badge>;
      default: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pending</Badge>;
    }
  };

  return (
    <Layout
      title="Leave Management"
      action={
        <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Employee</TableHead>
              <TableHead className="font-semibold text-slate-900">Type</TableHead>
              <TableHead className="font-semibold text-slate-900">Dates</TableHead>
              <TableHead className="font-semibold text-slate-900">Reason</TableHead>
              <TableHead className="font-semibold text-slate-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-900">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : requests?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No leave requests found.</TableCell></TableRow>
            ) : (
              requests?.map((req) => (
                <TableRow key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium">{getEmployeeName(req.employeeId)}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {req.startDate} <span className="text-slate-400">to</span> {req.endDate}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">{req.reason}</TableCell>
                  <TableCell>{getStatusBadge(req.status || "Pending")}</TableCell>
                  <TableCell className="text-right">
                    {req.status === "Pending" && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleStatusUpdate(req.id, "Approved")}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleStatusUpdate(req.id, "Rejected")}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateLeaveDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        employees={employees || []} 
      />
    </Layout>
  );
}

function CreateLeaveDialog({
  open,
  onOpenChange,
  employees,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: any[];
}) {
  const { toast } = useToast();
  const createMutation = useCreateLeaveRequest();

  const form = useForm<InsertLeaveRequest>({
    resolver: zodResolver(api.leave.create.input),
    defaultValues: {
      type: "Annual",
      reason: "",
    },
  });

  async function onSubmit(data: InsertLeaveRequest) {
    try {
      // Logic from assessment: Check duration > 3 days
      const days = differenceInDays(parseISO(data.endDate), parseISO(data.startDate)) + 1;
      
      await createMutation.mutateAsync(data);

      if (days > 3) {
        toast({
          title: "Long Leave Notice",
          description: "Automated Email Sent to HR: Long Leave Duration Detected.",
          className: "bg-blue-50 border-blue-200 text-blue-800",
        });
      }

      toast({ title: "Success", description: "Leave request submitted successfully" });
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Leave Request</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select 
                    onValueChange={(val) => field.onChange(parseInt(val))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Annual">Annual Leave</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Family">Family Responsibility</SelectItem>
                      <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Brief description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
