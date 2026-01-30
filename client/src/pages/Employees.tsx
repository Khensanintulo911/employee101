import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/Layout";
import { useEmployees, useCreateEmployee, useUpdateEmployee } from "@/hooks/use-employees";
import { api, type InsertEmployee } from "@shared/routes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Search, MoreHorizontal, Pencil, UserCheck, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const { data: employees, isLoading } = useEmployees();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<InsertEmployee & { id: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees?.filter((emp) =>
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.idNumber.includes(searchTerm)
  );

  return (
    <Layout
      title="Employee Management"
      action={
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="w-64 pl-9 rounded-xl bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-900">Name</TableHead>
              <TableHead className="font-semibold text-slate-900">ID Number</TableHead>
              <TableHead className="font-semibold text-slate-900">Position</TableHead>
              <TableHead className="font-semibold text-slate-900">Department</TableHead>
              <TableHead className="font-semibold text-slate-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredEmployees?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees?.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-700">
                    {employee.firstName} {employee.lastName}
                    <div className="text-xs text-muted-foreground font-normal">{employee.email}</div>
                  </TableCell>
                  <TableCell>{employee.idNumber}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                      {employee.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={employee.isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none border border-emerald-200" : "bg-slate-100 text-slate-700 hover:bg-slate-100 shadow-none border border-slate-200"}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EmployeeDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add New Employee"
      />
      
      {editingEmployee && (
        <EmployeeDialog
          open={!!editingEmployee}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
          employee={editingEmployee}
          title="Edit Employee"
        />
      )}
    </Layout>
  );
}

function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: InsertEmployee & { id: number };
  title: string;
}) {
  const { toast } = useToast();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const isEditing = !!employee;

  const form = useForm<InsertEmployee>({
    resolver: zodResolver(api.employees.create.input),
    defaultValues: employee || {
      firstName: "",
      lastName: "",
      email: "",
      idNumber: "",
      position: "",
      department: "",
      isActive: true,
    },
  });

  async function onSubmit(data: InsertEmployee) {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: employee!.id, ...data });
        toast({ title: "Success", description: "Employee updated successfully" });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: "Success", description: "Employee created successfully" });
      }
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Required for compliance" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Employee"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
