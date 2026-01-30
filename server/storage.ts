import { db } from "./db";
import {
  employees, leaveRequests, disciplinaryRecords, trainingRecords,
  type Employee, type InsertEmployee,
  type LeaveRequest, type InsertLeaveRequest,
  type DisciplinaryRecord, type InsertDisciplinaryRecord,
  type TrainingRecord, type InsertTrainingRecord
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;

  // Leave
  getLeaveRequests(): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveStatus(id: number, status: string): Promise<LeaveRequest>;

  // Disciplinary
  getDisciplinaryRecords(): Promise<DisciplinaryRecord[]>;
  createDisciplinaryRecord(record: InsertDisciplinaryRecord): Promise<DisciplinaryRecord>;

  // Training
  getTrainingRecords(): Promise<TrainingRecord[]>;
  createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord>;
}

export class DatabaseStorage implements IStorage {
  // Employees
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(desc(employees.createdAt));
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: number, updates: Partial<InsertEmployee>): Promise<Employee> {
    const [updated] = await db.update(employees).set(updates).where(eq(employees.id, id)).returning();
    return updated;
  }

  // Leave
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).orderBy(desc(leaveRequests.createdAt));
  }

  async createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest> {
    const [newRequest] = await db.insert(leaveRequests).values(request).returning();
    return newRequest;
  }

  async updateLeaveStatus(id: number, status: string): Promise<LeaveRequest> {
    const [updated] = await db.update(leaveRequests).set({ status }).where(eq(leaveRequests.id, id)).returning();
    return updated;
  }

  // Disciplinary
  async getDisciplinaryRecords(): Promise<DisciplinaryRecord[]> {
    return await db.select().from(disciplinaryRecords).orderBy(desc(disciplinaryRecords.createdAt));
  }

  async createDisciplinaryRecord(record: InsertDisciplinaryRecord): Promise<DisciplinaryRecord> {
    const [newRecord] = await db.insert(disciplinaryRecords).values(record).returning();
    return newRecord;
  }

  // Training
  async getTrainingRecords(): Promise<TrainingRecord[]> {
    return await db.select().from(trainingRecords).orderBy(desc(trainingRecords.createdAt));
  }

  async createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord> {
    const [newRecord] = await db.insert(trainingRecords).values(record).returning();
    return newRecord;
  }
}

export const storage = new DatabaseStorage();
