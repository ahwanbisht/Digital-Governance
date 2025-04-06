import { pgTable, text, serial, integer, boolean, timestamp, json, date, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("citizen"),
  email: text("email"),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow()
});

// Public Records
export const publicRecords = pgTable("public_records", {
  id: serial("id").primaryKey(),
  recordId: text("record_id").notNull().unique(),
  type: text("type").notNull(),
  department: text("department").notNull(),
  date: date("date").notNull(),
  status: text("status").notNull(),
  description: text("description"),
  blockchainHash: text("blockchain_hash"),
  verifiedAt: timestamp("verified_at")
});

// Budget Allocations
export const budgetAllocations = pgTable("budget_allocations", {
  id: serial("id").primaryKey(),
  department: text("department").notNull(),
  amount: doublePrecision("amount").notNull(),
  year: integer("year").notNull(),
  quarter: integer("quarter").notNull(),
  description: text("description"),
  status: text("status").notNull()
});

// Anomalies detected by AI
export const anomalies = pgTable("anomalies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  department: text("department").notNull(),
  severity: text("severity").notNull(),
  detectedAt: timestamp("detected_at").defaultNow(),
  status: text("status").notNull(),
  relatedRecordId: text("related_record_id")
});

// Citizen Reports
export const citizenReports = pgTable("citizen_reports", {
  id: serial("id").primaryKey(),
  reportType: text("report_type").notNull(),
  department: text("department").notNull(),
  description: text("description").notNull(),
  attachmentUrl: text("attachment_url"),
  isAnonymous: boolean("is_anonymous").default(false),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").references(() => users.id, { onDelete: 'set null' })
});

// Blockchain verification logs
export const blockchainLogs = pgTable("blockchain_logs", {
  id: serial("id").primaryKey(),
  serviceType: text("service_type").notNull(),
  hash: text("hash").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull(),
  details: json("details")
});

// API schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  email: true,
  department: true
});

export const insertPublicRecordSchema = createInsertSchema(publicRecords).pick({
  recordId: true,
  type: true,
  department: true,
  date: true,
  status: true,
  description: true,
  blockchainHash: true
});

export const insertBudgetAllocationSchema = createInsertSchema(budgetAllocations).pick({
  department: true,
  amount: true,
  year: true,
  quarter: true,
  description: true,
  status: true
});

export const insertAnomalySchema = createInsertSchema(anomalies).pick({
  title: true,
  description: true,
  department: true,
  severity: true,
  status: true,
  relatedRecordId: true
});

export const insertCitizenReportSchema = createInsertSchema(citizenReports).pick({
  reportType: true,
  department: true,
  description: true,
  attachmentUrl: true,
  isAnonymous: true,
  userId: true
});

export const insertBlockchainLogSchema = createInsertSchema(blockchainLogs).pick({
  serviceType: true,
  hash: true,
  status: true,
  details: true
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPublicRecord = z.infer<typeof insertPublicRecordSchema>;
export type PublicRecord = typeof publicRecords.$inferSelect;

export type InsertBudgetAllocation = z.infer<typeof insertBudgetAllocationSchema>;
export type BudgetAllocation = typeof budgetAllocations.$inferSelect;

export type InsertAnomaly = z.infer<typeof insertAnomalySchema>;
export type Anomaly = typeof anomalies.$inferSelect;

export type InsertCitizenReport = z.infer<typeof insertCitizenReportSchema>;
export type CitizenReport = typeof citizenReports.$inferSelect;

export type InsertBlockchainLog = z.infer<typeof insertBlockchainLogSchema>;
export type BlockchainLog = typeof blockchainLogs.$inferSelect;
