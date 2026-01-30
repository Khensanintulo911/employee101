import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { differenceInBusinessDays, parseISO } from "date-fns";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === Employees ===
  app.get(api.employees.list.path, async (req, res) => {
    const employees = await storage.getEmployees();
    res.json(employees);
  });

  app.get(api.employees.get.path, async (req, res) => {
    const employee = await storage.getEmployee(Number(req.params.id));
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  });

  app.post(api.employees.create.path, async (req, res) => {
    try {
      const input = api.employees.create.input.parse(req.body);
      const employee = await storage.createEmployee(input);
      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Leave Requests ===
  app.get(api.leave.list.path, async (req, res) => {
    const requests = await storage.getLeaveRequests();
    res.json(requests);
  });

  app.post(api.leave.create.path, async (req, res) => {
    try {
      const input = api.leave.create.input.parse(req.body);
      
      // Section B Q2 Logic: Trigger email if leave > 3 days
      // We calculate duration here (simplified logic)
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);
      const duration = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      
      if (duration > 3) {
        console.log(`[AUTOMATION TRIGGER] Sending email to HR: Employee applied for ${duration} days leave.`);
        // In a real app, await emailService.send(...)
      }

      const request = await storage.createLeaveRequest(input);
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.leave.updateStatus.path, async (req, res) => {
    const request = await storage.updateLeaveStatus(Number(req.params.id), req.body.status);
    res.json(request);
  });

  // === Disciplinary ===
  app.get(api.discipline.list.path, async (req, res) => {
    const records = await storage.getDisciplinaryRecords();
    res.json(records);
  });

  app.post(api.discipline.create.path, async (req, res) => {
    try {
      const input = api.discipline.create.input.parse(req.body);
      const record = await storage.createDisciplinaryRecord(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Training ===
  app.get(api.training.list.path, async (req, res) => {
    const records = await storage.getTrainingRecords();
    res.json(records);
  });

  app.post(api.training.create.path, async (req, res) => {
    try {
      const input = api.training.create.input.parse(req.body);
      const record = await storage.createTrainingRecord(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed the database on startup
  await seedDatabase();

  return httpServer;
}

// Seed function to populate data for demo
export async function seedDatabase() {
  const employees = await storage.getEmployees();
  if (employees.length === 0) {
    console.log("Seeding database...");
    
    const emp1 = await storage.createEmployee({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@saharaworkwear.com",
      idNumber: "8501015000087",
      position: "Safety Officer",
      department: "Operations",
      isActive: true
    });

    const emp2 = await storage.createEmployee({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@saharaworkwear.com",
      idNumber: "9005050055081",
      position: "HR Manager",
      department: "Human Resources",
      isActive: true
    });

    await storage.createLeaveRequest({
      employeeId: emp1.id,
      startDate: "2024-05-01",
      endDate: "2024-05-05", // > 3 days, should trigger automation log
      type: "Annual",
      reason: "Family vacation"
    });

    await storage.createDisciplinaryRecord({
      employeeId: emp1.id,
      incidentDate: "2024-02-15",
      description: "Late arrival for safety briefing",
      actionTaken: "Verbal Warning"
    });

    await storage.createTrainingRecord({
      employeeId: emp1.id,
      trainingName: "First Aid Level 1",
      completionDate: "2024-01-10",
      expiryDate: "2026-01-10"
    });
    
    console.log("Database seeded!");
  }
}
