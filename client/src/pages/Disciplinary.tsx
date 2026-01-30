import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/Layout";
import { useDisciplinaryRecords, useCreateDisciplinaryRecord } from "@/hooks/use-discipline";
import { useEmployees } from "@/hooks/use-employees";
import { api, type InsertDisciplinaryRecord } from "@shared/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertOctagon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Disciplinary() {
  const { data: records, isLoading } = useDisciplinaryRecords();
  const { data: employees } = useEmployees();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const getEmployeeName = (id: number) => {
    const emp = employees?.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : "Unknown";
  };

  return (
    <Layout
      title="Disciplinary Records"
      action={
        <Button onClick={() => setIsCreateOpen(true)} variant="destructive" className="rounded-xl shadow-lg shadow-destructive/20">
          <Plus className="mr-2 h-4 w-4" /> Log Incident
        </Button>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Date</TableHead>
              <TableHead className="font-semibold text-slate-900">Employee</TableHead>
              <TableHead className="font-semibold text-slate-900">Description</TableHead>
              <TableHead className="font-semibold text-slate-900">Action Taken</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : records?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No disciplinary records found.</TableCell></TableRow>
            ) : (
              records?.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50/50">
                  <TableCell>{record.incidentDate}</TableCell>
                  <TableCell className="font-medium">{getEmployeeName(record.employeeId)}</TableCell>
                  <TableCell className="max-w-md truncate">{record.description}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                      {record.actionTaken}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <CreateDisciplineDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} employees={employees || []} />
    </Layout>
  );
}

function CreateDisciplineDialog({ open, onOpenChange, employees }: { open: boolean, onOpenChange: (o: boolean) => void, employees: any[] }) {
  const { toast } = useToast();
  const createMutation = useCreateDisciplinaryRecord();
  const form = useForm<InsertDisciplinaryRecord>({ resolver: zodResolver(api.discipline.create.input) });

  async function onSubmit(data: InsertDisciplinaryRecord) {
    try {
      await createMutation.mutateAsync(data);
      toast({ title: "Incident Logged", description: "Disciplinary record has been saved." });
      onOpenChange(false);
      form.reset();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <AlertOctagon className="h-5 w-5" /> Log Disciplinary Incident
          </DialogTitle>
        </DialogHeader>
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
            <FormField control={form.control} name="incidentDate" render={({ field }) => (
              <FormItem><FormLabel>Incident Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description of Incident</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="actionTaken" render={({ field }) => (
              <FormItem><FormLabel>Action Taken</FormLabel><FormControl><Input {...field} placeholder="e.g. Written Warning" /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" variant="destructive" className="w-full" disabled={createMutation.isPending}>{createMutation.isPending ? "Logging..." : "Log Incident"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
