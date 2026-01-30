import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(), // Validation will be enforced via Zod
  idNumber: text("id_number").notNull(), // Validation: Cannot be empty
  position: text("position").notNull(),
  department: text("department").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  type: text("type").notNull(), // Annual, Sick, Family
  reason: text("reason").notNull(),
  status: text("status").default("Pending"), // Pending, Approved, Rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const disciplinaryRecords = pgTable("disciplinary_records", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  incidentDate: date("incident_date").notNull(),
  description: text("description").notNull(),
  actionTaken: text("action_taken").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingRecords = pgTable("training_records", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  trainingName: text("training_name").notNull(),
  completionDate: date("completion_date").notNull(),
  expiryDate: date("expiry_date"),
  certificateUrl: text("certificate_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const employeesRelations = relations(employees, ({ many }) => ({
  leaveRequests: many(leaveRequests),
  disciplinaryRecords: many(disciplinaryRecords),
  trainingRecords: many(trainingRecords),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employeeId],
    references: [employees.id],
  }),
}));

export const disciplinaryRecordsRelations = relations(disciplinaryRecords, ({ one }) => ({
  employee: one(employees, {
    fields: [disciplinaryRecords.employeeId],
    references: [employees.id],
  }),
}));

export const trainingRecordsRelations = relations(trainingRecords, ({ one }) => ({
  employee: one(employees, {
    fields: [trainingRecords.employeeId],
    references: [employees.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true }).extend({
  email: z.string().email("Invalid email address"), // Section B Q1: Email validation
  idNumber: z.string().min(1, "ID Number is required"), // Section B Q1: ID validation
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({ id: true, createdAt: true, status: true });
export const insertDisciplinaryRecordSchema = createInsertSchema(disciplinaryRecords).omit({ id: true, createdAt: true });
export const insertTrainingRecordSchema = createInsertSchema(trainingRecords).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;

export type DisciplinaryRecord = typeof disciplinaryRecords.$inferSelect;
export type InsertDisciplinaryRecord = z.infer<typeof insertDisciplinaryRecordSchema>;

export type TrainingRecord = typeof trainingRecords.$inferSelect;
export type InsertTrainingRecord = z.infer<typeof insertTrainingRecordSchema>;

// Request types
export type CreateEmployeeRequest = InsertEmployee;
export type UpdateEmployeeRequest = Partial<InsertEmployee>;
export type CreateLeaveRequest = InsertLeaveRequest;
export type UpdateLeaveStatusRequest = { status: string };

// Response types (With relations for dashboard views)
export type EmployeeWithDetails = Employee & {
  leaveRequests: LeaveRequest[];
  disciplinaryRecords: DisciplinaryRecord[];
  trainingRecords: TrainingRecord[];
};
