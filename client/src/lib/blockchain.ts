import { apiRequest } from "./queryClient";

/**
 * Verifies data on the blockchain
 * @param data The data to verify
 * @param type The type of verification to perform
 * @returns Response with verification hash and timestamp
 */
export async function verifyOnBlockchain<T>(data: T, type: string): Promise<{
  verified: boolean;
  hash: string;
  timestamp: string;
}> {
  try {
    const response = await apiRequest("POST", "/api/blockchain/verify", {
      data,
      type
    });
    
    return await response.json();
  } catch (error) {
    console.error("Blockchain verification failed:", error);
    throw new Error("Failed to verify data on blockchain");
  }
}

/**
 * Manually initiates a verification of all blockchain services
 * @returns Status of verification process
 */
export async function verifyBlockchain(): Promise<{
  allOperational: boolean;
  services: {
    service: string;
    status: string;
    lastVerified: string;
    hash: string;
  }[];
}> {
  try {
    // Generate random data to verify
    const verificationData = {
      timestamp: new Date().toISOString(),
      random: Math.random().toString(36).substring(7)
    };
    
    // Verify various services
    const services = ["Record Verification", "Digital Identity", "Smart Contracts", "AI Analytics"];
    for (const service of services) {
      await verifyOnBlockchain(verificationData, service);
    }
    
    // Get updated status
    const response = await fetch("/api/blockchain/status", {
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching blockchain status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Blockchain system verification failed:", error);
    throw new Error("Failed to verify blockchain systems");
  }
}

/**
 * Verifies a specific record's blockchain hash
 * @param recordId The ID of the record to verify
 * @returns Verification status and details
 */
export async function verifyRecord(recordId: string): Promise<{
  verified: boolean;
  originalHash: string;
  currentHash: string;
  timestamp: string;
  dataIntegrity: boolean;
}> {
  try {
    const response = await apiRequest("POST", `/api/blockchain/verify-record`, {
      recordId
    });
    
    return await response.json();
  } catch (error) {
    console.error(`Record verification failed for ${recordId}:`, error);
    throw new Error("Failed to verify record on blockchain");
  }
}

/**
 * Gets the current blockchain network status
 * @returns Network status details
 */
export async function getBlockchainNetworkStatus(): Promise<{
  network: string;
  blockHeight: number;
  lastBlockTime: string;
  operationalNodes: number;
  totalNodes: number;
}> {
  try {
    const response = await fetch("/api/blockchain/network", {
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching blockchain network status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get blockchain network status:", error);
    throw new Error("Unable to fetch blockchain network information");
  }
}
