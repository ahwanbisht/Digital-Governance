import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertPublicRecordSchema,
  insertBudgetAllocationSchema,
  insertAnomalySchema,
  insertCitizenReportSchema,
  insertBlockchainLogSchema
} from "@shared/schema";

// Initialize TensorFlow.js for AI analytics
import * as tf from "@tensorflow/tfjs";

// Initialize Web3 for blockchain integration
import Web3 from "web3";

// Simulated web3 instance for blockchain operations
const web3 = new Web3("http://localhost:8545"); // This would be a real blockchain node in production

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Prefix all routes with /api
  app.use("/api", router);
  
  // Authentication routes
  router.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // For demo purposes, accept any login
      const user = {
        id: 1,
        username,
        fullName: "Alex Thompson",
        role: "admin",
        email: "admin@example.com",
        department: "Administration"
      };
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });
  
  router.post("/auth/logout", (_req: Request, res: Response) => {
    res.json({ success: true });
  });
  
  router.get("/auth/me", (_req: Request, res: Response) => {
    // For demo purposes, always return a logged-in user
    const user = {
      id: 1,
      username: "admin",
      fullName: "Alex Thompson",
      role: "admin",
      email: "admin@example.com",
      department: "Administration"
    };
    
    res.json(user);
  });

  // Dashboard summary
  router.get("/dashboard", async (_req: Request, res: Response) => {
    try {
      const records = await storage.getAllPublicRecords();
      const anomalies = await storage.getAllAnomalies();
      const reports = await storage.getAllCitizenReports();
      const budgetAllocations = await storage.getAllBudgetAllocations();

      // Calculate some statistics
      const totalRecords = records.length;
      const pendingReports = reports.filter(r => r.status === "pending").length;
      const verifiedRecords = records.filter(r => r.status === "Verified").length;
      const budgetTransparency = Math.round((verifiedRecords / totalRecords) * 100);

      const response = {
        stats: {
          totalRecords,
          budgetTransparency: `${budgetTransparency}%`,
          citizenReports: reports.length,
          anomalies: anomalies.length
        },
        recentRecords: records.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }).slice(0, 5),
        recentAnomalies: anomalies.slice(0, 4)
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });

  // Public Records
  router.get("/records", async (_req: Request, res: Response) => {
    try {
      const records = await storage.getAllPublicRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Error fetching public records" });
    }
  });

  router.get("/records/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const record = await storage.getPublicRecord(id);
      
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }
      
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Error fetching record" });
    }
  });

  router.post("/records", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertPublicRecordSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid record data", errors: parsedBody.error });
      }
      
      // Generate blockchain hash
      const blockchainHash = web3.utils.sha3(JSON.stringify(parsedBody.data));
      
      const newRecord = await storage.createPublicRecord({
        ...parsedBody.data,
        blockchainHash
      });
      
      // Log to blockchain
      await storage.createBlockchainLog({
        serviceType: "Record Verification",
        hash: blockchainHash || "",
        status: "Operational",
        details: { recordId: newRecord.recordId }
      });
      
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ message: "Error creating record" });
    }
  });

  // Budget Allocations
  router.get("/budget", async (_req: Request, res: Response) => {
    try {
      const allocations = await storage.getAllBudgetAllocations();
      res.json(allocations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching budget allocations" });
    }
  });

  router.get("/budget/:department", async (req: Request, res: Response) => {
    try {
      const department = req.params.department;
      const allocations = await storage.getBudgetAllocationsByDepartment(department);
      res.json(allocations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching budget allocations" });
    }
  });

  router.post("/budget", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertBudgetAllocationSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid budget data", errors: parsedBody.error });
      }
      
      const newAllocation = await storage.createBudgetAllocation(parsedBody.data);
      res.status(201).json(newAllocation);
    } catch (error) {
      res.status(500).json({ message: "Error creating budget allocation" });
    }
  });

  // Anomalies
  router.get("/anomalies", async (_req: Request, res: Response) => {
    try {
      const anomalies = await storage.getAllAnomalies();
      res.json(anomalies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching anomalies" });
    }
  });

  router.post("/anomalies", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertAnomalySchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid anomaly data", errors: parsedBody.error });
      }
      
      const newAnomaly = await storage.createAnomaly(parsedBody.data);
      res.status(201).json(newAnomaly);
    } catch (error) {
      res.status(500).json({ message: "Error creating anomaly" });
    }
  });

  // AI analysis endpoint
  router.post("/analyze", async (req: Request, res: Response) => {
    try {
      const { data, dataType } = req.body;
      
      if (!data || !dataType) {
        return res.status(400).json({ message: "Missing data or dataType" });
      }
      
      // Simulate AI analysis based on data type
      let analysis = null;
      
      switch (dataType) {
        case "spending":
          // Simple anomaly detection (would use actual TensorFlow models in production)
          const amounts = data.map((d: any) => d.amount);
          const mean = amounts.reduce((sum: number, val: number) => sum + val, 0) / amounts.length;
          const stdDev = Math.sqrt(amounts.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / amounts.length);
          
          const anomalies = data.filter((d: any) => Math.abs(d.amount - mean) > 2 * stdDev);
          
          analysis = {
            anomalies,
            riskScore: anomalies.length > 0 ? "High" : "Low",
            confidence: 0.85
          };
          break;
          
        case "contracts":
          // Simulated contract analysis
          analysis = {
            duplicateClauses: data.filter((d: any) => d.text.includes("duplicate")),
            unusualTerms: data.filter((d: any) => d.text.includes("unusual")),
            riskScore: "Medium",
            confidence: 0.78
          };
          break;
          
        default:
          return res.status(400).json({ message: "Unsupported data type" });
      }
      
      res.json({ analysis });
    } catch (error) {
      res.status(500).json({ message: "Error performing AI analysis" });
    }
  });

  // Citizen Reports
  router.get("/reports", async (_req: Request, res: Response) => {
    try {
      const reports = await storage.getAllCitizenReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Error fetching citizen reports" });
    }
  });

  router.get("/reports/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getCitizenReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Error fetching report" });
    }
  });

  router.post("/reports", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertCitizenReportSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid report data", errors: parsedBody.error });
      }
      
      const newReport = await storage.createCitizenReport(parsedBody.data);
      res.status(201).json(newReport);
    } catch (error) {
      res.status(500).json({ message: "Error creating citizen report" });
    }
  });

  // Blockchain verification
  router.get("/blockchain/status", async (_req: Request, res: Response) => {
    try {
      const services = ["Record Verification", "Digital Identity", "Smart Contracts", "AI Analytics"];
      const statuses = [];
      
      for (const service of services) {
        const logs = await storage.getLatestBlockchainLogsByService(service);
        
        if (logs.length > 0) {
          statuses.push({
            service,
            status: logs[0].status,
            lastVerified: logs[0].timestamp,
            hash: logs[0].hash
          });
        }
      }
      
      res.json({
        allOperational: statuses.every(s => s.status === "Operational"),
        services: statuses
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching blockchain status" });
    }
  });

  router.post("/blockchain/verify", async (req: Request, res: Response) => {
    try {
      const { data, type } = req.body;
      
      if (!data || !type) {
        return res.status(400).json({ message: "Missing data or type" });
      }
      
      // Generate hash using web3
      const hash = web3.utils.sha3(JSON.stringify(data));
      
      // Log verification
      const log = await storage.createBlockchainLog({
        serviceType: type,
        hash: hash || "",
        status: "Operational",
        details: { data }
      });
      
      res.json({
        verified: true,
        hash,
        timestamp: log.timestamp
      });
    } catch (error) {
      res.status(500).json({ message: "Error verifying on blockchain" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
