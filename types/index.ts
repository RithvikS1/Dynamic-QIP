export interface Benchmark {
  id: string;
  rate: number; // R_b,k
  weight?: number; // w_k (optional)
}

export interface Clinic {
  id: string;
  name: string;
  volume: number; // V_i
  currentRates: { [benchmarkId: string]: number }; // R_i,k
  previousRates: { [benchmarkId: string]: number }; // R_prev,i,k
}

export interface CalculationParams {
  totalPayout: number; // P_T
  bonusPercentage: number; // beta (0-1)
  performanceSensitivity: number; // alpha
  volumeWeighting: number; // gamma
}

export interface CalculationResults {
  baseShare: number; // B_i
  performanceFactors: { [benchmarkId: string]: number }; // PF_i,k
  combinedPerformanceFactor: number; // PF_i
  adjustedShare: number; // AS_i
  normalizedAdjustedShare: number; // NAS_i
  mainPayout: number; // Payout_main_i
  improvements: { [benchmarkId: string]: number }; // Improvement_i,k
  totalImprovement: number; // Improvement_i
  bonusPayout: number; // Bonus_i
  finalPayout: number; // Payout_i
}

export interface ClinicResults extends Clinic {
  results: CalculationResults;
}