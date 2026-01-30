import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/Layout";
import { useTrainingRecords, useCreateTrainingRecord } from "@/hooks/use-training";
import { useEmployees } from "@/hooks/use-employees";
import { api, type InsertTrainingRecord } from "@shared/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Training Records Component
 * 
 * Manages employee professional development and certification records.
 * 
 * @returns {JSX.Element} The rendered training management page
 */
export default function Training() {
  const { data: records, isLoading } = useTrainingRecords();
  const { data: employees } = useEmployees();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getEmployeeName = (id: number) => {
    const emp = employees?.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : "Unknown";
  };

  return (
    <Layout
      title="Training Records"
      action={
        <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Training Name</TableHead>
              <TableHead className="font-semibold text-slate-900">Employee</TableHead>
              <TableHead className="font-semibold text-slate-900">Completion Date</TableHead>
              <TableHead className="font-semibold text-slate-900">Expiry Date</TableHead>
              <TableHead className="text-right font-semibold text-slate-900">Certificate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : records?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No training records found.</TableCell></TableRow>
            ) : (
              records?.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {record.trainingName}
                  </TableCell>
                  <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                  <TableCell>{record.completionDate}</TableCell>
                  <TableCell className="text-slate-500">{record.expiryDate || "N/A"}</TableCell>
                  <TableCell className="text-right text-blue-600 hover:underline cursor-pointer">View</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <CreateTrainingDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} employees={employees || []} />
    </Layout>
  );
}

function CreateTrainingDialog({ open, onOpenChange, employees }: { open: boolean, onOpenChange: (o: boolean) => void, employees: any[] }) {
  const { toast } = useToast();
  const createMutation = useCreateTrainingRecord();
  const form = useForm<InsertTrainingRecord>({ resolver: zodResolver(api.training.create.input) });

  async function onSubmit(data: InsertTrainingRecord) {
    try {
      await createMutation.mutateAsync(data);
      toast({ title: "Success", description: "Training record added." });
      onOpenChange(false);
      form.reset();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Add Training Record</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="employeeId" render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value?.toString()}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger></FormControl>
                  <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.firstName} {e.lastName}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="trainingName" render={({ field }) => (
              <FormItem><FormLabel>Training Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="completionDate" render={({ field }) => (
                <FormItem><FormLabel>Completion Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="expiryDate" render={({ field }) => (
                <FormItem><FormLabel>Expiry Date (Opt)</FormLabel><FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Save Record"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
