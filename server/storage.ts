import { 
  users, type User, type InsertUser,
  publicRecords, type PublicRecord, type InsertPublicRecord,
  budgetAllocations, type BudgetAllocation, type InsertBudgetAllocation,
  anomalies, type Anomaly, type InsertAnomaly,
  citizenReports, type CitizenReport, type InsertCitizenReport,
  blockchainLogs, type BlockchainLog, type InsertBlockchainLog
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Public Records
  getAllPublicRecords(): Promise<PublicRecord[]>;
  getPublicRecord(id: number): Promise<PublicRecord | undefined>;
  getPublicRecordByRecordId(recordId: string): Promise<PublicRecord | undefined>;
  createPublicRecord(record: InsertPublicRecord): Promise<PublicRecord>;
  
  // Budget Allocations
  getAllBudgetAllocations(): Promise<BudgetAllocation[]>;
  getBudgetAllocationsByDepartment(department: string): Promise<BudgetAllocation[]>;
  createBudgetAllocation(allocation: InsertBudgetAllocation): Promise<BudgetAllocation>;
  
  // Anomalies
  getAllAnomalies(): Promise<Anomaly[]>;
  getAnomaliesByDepartment(department: string): Promise<Anomaly[]>;
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  
  // Citizen Reports
  getAllCitizenReports(): Promise<CitizenReport[]>;
  getCitizenReport(id: number): Promise<CitizenReport | undefined>;
  createCitizenReport(report: InsertCitizenReport): Promise<CitizenReport>;
  
  // Blockchain Logs
  getAllBlockchainLogs(): Promise<BlockchainLog[]>;
  getLatestBlockchainLogsByService(serviceType: string): Promise<BlockchainLog[]>;
  createBlockchainLog(log: InsertBlockchainLog): Promise<BlockchainLog>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private publicRecords: Map<number, PublicRecord>;
  private budgetAllocations: Map<number, BudgetAllocation>;
  private anomalies: Map<number, Anomaly>;
  private citizenReports: Map<number, CitizenReport>;
  private blockchainLogs: Map<number, BlockchainLog>;
  
  private userCurrentId: number;
  private recordCurrentId: number;
  private budgetCurrentId: number;
  private anomalyCurrentId: number;
  private reportCurrentId: number;
  private logCurrentId: number;

  constructor() {
    this.users = new Map();
    this.publicRecords = new Map();
    this.budgetAllocations = new Map();
    this.anomalies = new Map();
    this.citizenReports = new Map();
    this.blockchainLogs = new Map();
    
    this.userCurrentId = 1;
    this.recordCurrentId = 1;
    this.budgetCurrentId = 1;
    this.anomalyCurrentId = 1;
    this.reportCurrentId = 1;
    this.logCurrentId = 1;
    
    // Initialize with some default data
    this.initializeDefaultData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Public Records
  async getAllPublicRecords(): Promise<PublicRecord[]> {
    return Array.from(this.publicRecords.values());
  }
  
  async getPublicRecord(id: number): Promise<PublicRecord | undefined> {
    return this.publicRecords.get(id);
  }
  
  async getPublicRecordByRecordId(recordId: string): Promise<PublicRecord | undefined> {
    return Array.from(this.publicRecords.values()).find(
      (record) => record.recordId === recordId,
    );
  }
  
  async createPublicRecord(insertRecord: InsertPublicRecord): Promise<PublicRecord> {
    const id = this.recordCurrentId++;
    const record: PublicRecord = { ...insertRecord, id };
    this.publicRecords.set(id, record);
    return record;
  }
  
  // Budget Allocations
  async getAllBudgetAllocations(): Promise<BudgetAllocation[]> {
    return Array.from(this.budgetAllocations.values());
  }
  
  async getBudgetAllocationsByDepartment(department: string): Promise<BudgetAllocation[]> {
    return Array.from(this.budgetAllocations.values()).filter(
      (allocation) => allocation.department === department,
    );
  }
  
  async createBudgetAllocation(insertAllocation: InsertBudgetAllocation): Promise<BudgetAllocation> {
    const id = this.budgetCurrentId++;
    const allocation: BudgetAllocation = { ...insertAllocation, id };
    this.budgetAllocations.set(id, allocation);
    return allocation;
  }
  
  // Anomalies
  async getAllAnomalies(): Promise<Anomaly[]> {
    return Array.from(this.anomalies.values());
  }
  
  async getAnomaliesByDepartment(department: string): Promise<Anomaly[]> {
    return Array.from(this.anomalies.values()).filter(
      (anomaly) => anomaly.department === department,
    );
  }
  
  async createAnomaly(insertAnomaly: InsertAnomaly): Promise<Anomaly> {
    const id = this.anomalyCurrentId++;
    const detectedAt = new Date();
    const anomaly: Anomaly = { ...insertAnomaly, id, detectedAt };
    this.anomalies.set(id, anomaly);
    return anomaly;
  }
  
  // Citizen Reports
  async getAllCitizenReports(): Promise<CitizenReport[]> {
    return Array.from(this.citizenReports.values());
  }
  
  async getCitizenReport(id: number): Promise<CitizenReport | undefined> {
    return this.citizenReports.get(id);
  }
  
  async createCitizenReport(insertReport: InsertCitizenReport): Promise<CitizenReport> {
    const id = this.reportCurrentId++;
    const createdAt = new Date();
    const report: CitizenReport = { ...insertReport, id, createdAt, status: "pending" };
    this.citizenReports.set(id, report);
    return report;
  }
  
  // Blockchain Logs
  async getAllBlockchainLogs(): Promise<BlockchainLog[]> {
    return Array.from(this.blockchainLogs.values());
  }
  
  async getLatestBlockchainLogsByService(serviceType: string): Promise<BlockchainLog[]> {
    return Array.from(this.blockchainLogs.values())
      .filter((log) => log.serviceType === serviceType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  }
  
  async createBlockchainLog(insertLog: InsertBlockchainLog): Promise<BlockchainLog> {
    const id = this.logCurrentId++;
    const timestamp = new Date();
    const log: BlockchainLog = { ...insertLog, id, timestamp };
    this.blockchainLogs.set(id, log);
    return log;
  }
  
  // Initialize default data
  private initializeDefaultData() {
    // Add default admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      fullName: "Admin User",
      role: "admin",
      email: "admin@example.com",
      department: "Administration"
    });
    
    // Add default public records
    this.createPublicRecord({
      recordId: "REC-2023-5842",
      type: "Contract",
      department: "Public Works",
      date: new Date("2023-10-12"),
      status: "Verified",
      description: "Road maintenance contract for downtown area",
      blockchainHash: "0x7a32...9f21"
    });
    
    this.createPublicRecord({
      recordId: "REC-2023-5841",
      type: "Budget Allocation",
      department: "Education",
      date: new Date("2023-10-11"),
      status: "Verified",
      description: "Q4 Budget allocation for public schools",
      blockchainHash: "0x6b21...8e32"
    });
    
    this.createPublicRecord({
      recordId: "REC-2023-5840",
      type: "Expenditure Report",
      department: "Healthcare",
      date: new Date("2023-10-10"),
      status: "Pending Review",
      description: "Medical supplies procurement report",
      blockchainHash: "0x5c12...7d43"
    });
    
    this.createPublicRecord({
      recordId: "REC-2023-5839",
      type: "Legal Document",
      department: "City Council",
      date: new Date("2023-10-09"),
      status: "Verified",
      description: "City ordinance on public safety",
      blockchainHash: "0x4d03...6e54"
    });
    
    this.createPublicRecord({
      recordId: "REC-2023-5838",
      type: "Permit Approval",
      department: "Urban Planning",
      date: new Date("2023-10-08"),
      status: "Flagged",
      description: "Commercial building permit in historical district",
      blockchainHash: "0x3e94...5f65"
    });
    
    // Add budget allocations
    const departments = ["Education", "Healthcare", "Infrastructure"];
    const currentYear = new Date().getFullYear();
    
    departments.forEach((dept, i) => {
      const baseAmount = 1000000 + (i * 500000);
      
      for (let quarter = 1; quarter <= 4; quarter++) {
        this.createBudgetAllocation({
          department: dept,
          amount: baseAmount + (quarter * 100000),
          year: currentYear,
          quarter: quarter,
          description: `Q${quarter} Budget for ${dept}`,
          status: "Approved"
        });
      }
    });
    
    // Add anomalies
    this.createAnomaly({
      title: "Unusual spending pattern detected",
      description: "Multiple transactions with unusual amounts in short timeframe",
      department: "Transportation",
      severity: "High",
      status: "Open",
      relatedRecordId: null
    });
    
    this.createAnomaly({
      title: "Contract signature verification failed",
      description: "Digital signature on contract does not match authorized signatory",
      department: "Public Works Committee",
      severity: "Medium",
      status: "Open",
      relatedRecordId: null
    });
    
    this.createAnomaly({
      title: "Possible duplicate payment detected",
      description: "Same vendor paid twice for similar invoice amounts",
      department: "Department of Health",
      severity: "Medium",
      status: "Open",
      relatedRecordId: null
    });
    
    this.createAnomaly({
      title: "Suspicious bidding pattern identified",
      description: "Multiple bids from seemingly unrelated companies with identical pricing",
      department: "City Planning Division",
      severity: "High",
      status: "Open",
      relatedRecordId: null
    });
    
    // Add blockchain logs
    const services = ["Record Verification", "Digital Identity", "Smart Contracts", "AI Analytics"];
    
    services.forEach((service, i) => {
      const minutesAgo = [2, 15, 8, 45][i];
      const timestamp = new Date(Date.now() - (minutesAgo * 60 * 1000));
      
      this.createBlockchainLog({
        serviceType: service,
        hash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        status: i === 3 ? "Warning" : "Operational",
        details: { lastChecked: timestamp.toISOString() }
      });
    });
  }
}

export const storage = new MemStorage();
