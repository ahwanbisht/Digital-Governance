import { apiRequest } from "./queryClient";

/**
 * Types of data that can be analyzed
 */
export type AnalysisDataType = 'spending' | 'contracts' | 'reports' | 'voting';

/**
 * Common result interface for all analyses
 */
export interface AnalysisResult {
  riskScore: string;
  confidence: number;
  anomalies?: any[];
  insights?: string[];
  recommendations?: string[];
}

/**
 * Interface for spending analysis results
 */
export interface SpendingAnalysisResult extends AnalysisResult {
  anomalies: Array<{
    amount: number;
    date: string;
    department: string;
    reason: string;
    severity: string;
  }>;
  trends: {
    increasing: string[];
    decreasing: string[];
    stable: string[];
  };
}

/**
 * Interface for contract analysis results
 */
export interface ContractAnalysisResult extends AnalysisResult {
  duplicateClauses: Array<{
    text: string;
    location: string;
  }>;
  unusualTerms: Array<{
    text: string;
    location: string;
    reason: string;
  }>;
  similarContracts: number;
}

/**
 * Analyzes data using AI
 * @param data The data to analyze
 * @param dataType The type of data being analyzed
 * @returns Analysis results
 */
export async function analyzeData<T>(
  data: T[],
  dataType: AnalysisDataType
): Promise<AnalysisResult> {
  try {
    const response = await apiRequest("POST", "/api/analyze", {
      data,
      dataType
    });
    
    const result = await response.json();
    return result.analysis;
  } catch (error) {
    console.error(`AI analysis failed for ${dataType}:`, error);
    throw new Error(`Failed to analyze ${dataType} data`);
  }
}

/**
 * Analyze spending data for anomalies and patterns
 * @param spendingData Array of spending records
 * @returns Spending analysis results
 */
export async function analyzeSpending(
  spendingData: Array<{
    amount: number;
    date: string;
    department: string;
    category: string;
    description: string;
  }>
): Promise<SpendingAnalysisResult> {
  return (await analyzeData(spendingData, 'spending')) as SpendingAnalysisResult;
}

/**
 * Analyze contracts for abnormalities or suspicious patterns
 * @param contractData Array of contract data
 * @returns Contract analysis results
 */
export async function analyzeContracts(
  contractData: Array<{
    text: string;
    parties: string[];
    value: number;
    startDate: string;
    endDate: string;
  }>
): Promise<ContractAnalysisResult> {
  return (await analyzeData(contractData, 'contracts')) as ContractAnalysisResult;
}

/**
 * Predict future anomalies based on historical data
 * @param historicalData Historical anomaly data
 * @param timeframe Prediction timeframe in days
 * @returns Predicted anomalies and confidence level
 */
export async function predictAnomalies(
  historicalData: any[],
  timeframe: number
): Promise<{
  predictions: any[];
  confidence: number;
}> {
  try {
    const response = await apiRequest("POST", "/api/predict-anomalies", {
      historicalData,
      timeframe
    });
    
    return await response.json();
  } catch (error) {
    console.error("Anomaly prediction failed:", error);
    throw new Error("Failed to predict future anomalies");
  }
}
