import { Clinic, Benchmark, CalculationParams, CalculationResults, ClinicResults } from '@/types';

export function calculateQIPPayouts(
  clinics: Clinic[],
  benchmarks: Benchmark[],
  params: CalculationParams
): ClinicResults[] {
  // Step 1: Calculate base shares for all clinics
  const totalVolumeWeighted = clinics.reduce((sum, clinic) => {
    return sum + Math.pow(clinic.volume, params.volumeWeighting);
  }, 0);

  const clinicResults: ClinicResults[] = clinics.map(clinic => {
    // Base Share: B_i = V_i^gamma / sum of all V_j^gamma
    const baseShare = Math.pow(clinic.volume, params.volumeWeighting) / totalVolumeWeighted;

    // Performance Factor per benchmark: PF_i,k = 1 + alpha * max(0, (R_i,k - R_b,k) / R_b,k)
    const performanceFactors: { [benchmarkId: string]: number } = {};
    benchmarks.forEach(benchmark => {
      const currentRate = clinic.currentRates[benchmark.id] || 0;
      const benchmarkRate = benchmark.rate;
      const performanceFactor = 1 + params.performanceSensitivity * Math.max(0, (currentRate - benchmarkRate) / benchmarkRate);
      performanceFactors[benchmark.id] = performanceFactor;
    });

    // Combined Performance Factor: weighted average or simple average
    let combinedPerformanceFactor: number;
    const hasWeights = benchmarks.some(b => b.weight !== undefined);
    
    if (hasWeights) {
      // Weighted sum using w_k; UI enforces that Σ w_k = 1
      combinedPerformanceFactor = benchmarks.reduce((sum, benchmark) => {
        const weight = benchmark.weight || 0;
        return sum + (performanceFactors[benchmark.id] * weight);
      }, 0);
    } else {
      // Simple average
      combinedPerformanceFactor = Object.values(performanceFactors).reduce((sum, pf) => sum + pf, 0) / benchmarks.length;
    }

    // Improvement per benchmark: Improvement_i,k = max(0, (R_i,k - R_prev,i,k) / R_prev,i,k)
    const improvements: { [benchmarkId: string]: number } = {};
    benchmarks.forEach(benchmark => {
      const currentRate = clinic.currentRates[benchmark.id] || 0;
      const previousRate = clinic.previousRates[benchmark.id] || 0;
      const improvement = previousRate > 0 ? Math.max(0, (currentRate - previousRate) / previousRate) : 0;
      improvements[benchmark.id] = improvement;
    });

    // Weighted Total Improvement: similar structure to Combined Performance Factor
    let totalImprovement: number;
    if (hasWeights) {
      // Weighted improvement using w_k; UI enforces that Σ w_k = 1
      totalImprovement = benchmarks.reduce((sum, benchmark) => {
        const weight = benchmark.weight || 0;
        return sum + (improvements[benchmark.id] * weight);
      }, 0);
    } else {
      // Simple average of improvements
      totalImprovement = Object.values(improvements).reduce((sum, imp) => sum + imp, 0) / benchmarks.length;
    }

    return {
      ...clinic,
      results: {
        baseShare,
        performanceFactors,
        combinedPerformanceFactor,
        adjustedShare: 0, // Will be calculated below
        normalizedAdjustedShare: 0, // Will be calculated below
        mainPayout: 0, // Will be calculated below
        improvements,
        totalImprovement,
        bonusPayout: 0, // Will be calculated below
        finalPayout: 0, // Will be calculated below
      }
    };
  });

  // Step 2: Calculate adjusted shares and normalize
  clinicResults.forEach(clinic => {
    // Adjusted Share: AS_i = B_i * PF_i
    clinic.results.adjustedShare = clinic.results.baseShare * clinic.results.combinedPerformanceFactor;
  });

  const totalAdjustedShare = clinicResults.reduce((sum, clinic) => sum + clinic.results.adjustedShare, 0);

  clinicResults.forEach(clinic => {
    // Normalized Adjusted Share: NAS_i = AS_i / sum of all AS_j
    clinic.results.normalizedAdjustedShare = clinic.results.adjustedShare / totalAdjustedShare;
    
    // Main Pool Payout: Payout_main_i = NAS_i * P_T * (1 - beta)
    clinic.results.mainPayout = clinic.results.normalizedAdjustedShare * params.totalPayout * (1 - params.bonusPercentage);
  });

  // Step 3: Calculate bonus payouts
  const totalImprovement = clinicResults.reduce((sum, clinic) => sum + clinic.results.totalImprovement, 0);

  clinicResults.forEach(clinic => {
    // Bonus Payout: Bonus_i = (Improvement_i / sum of all Improvement_j) * P_T * beta
    clinic.results.bonusPayout = totalImprovement > 0 
      ? (clinic.results.totalImprovement / totalImprovement) * params.totalPayout * params.bonusPercentage
      : 0;
    
    // Final Payout: Payout_i = Payout_main_i + Bonus_i
    clinic.results.finalPayout = clinic.results.mainPayout + clinic.results.bonusPayout;
  });

  return clinicResults;
}

export function exportToCSV(
  clinicResults: ClinicResults[],
  benchmarks: Benchmark[],
  params: CalculationParams
): string {
  const headers = [
    // Basic Information
    'Clinic Name',
    'Number of Patients',
    
    // Share Calculations
    'Base Share',
    'Base Share (%)',
    'Combined Performance Factor',
    'Adjusted Share',
    'Normalized Adjusted Share',
    'Normalized Adjusted Share (%)',
    
    // Payout Calculations
    'Main Payout ($)',
    'Bonus Payout ($)',
    'Final Payout ($)',
    'Payout Percentage of Total (%)',
    
    // Improvement Summary
    'Weighted Total Improvement Score',
    'Improvement Share of Bonus (%)',

    // Volume Weighting Detail
    'Volume Weighted (V_i^γ)',
    
    // Benchmark Details - Target Rates (Benchmark), Current & Previous
    ...benchmarks.map(b => `Target Rate ${b.id} (%)`),
    // Benchmark Details - Current Rates
    ...benchmarks.map(b => `Current Rate ${b.id} (%)`),
    
    // Benchmark Details - Previous Rates  
    ...benchmarks.map(b => `Previous Rate ${b.id} (%)`),
    
    // Benchmark Details - Performance Factors
    ...benchmarks.map(b => `Performance Factor ${b.id}`),
    
    // Benchmark Details - Individual Improvements (unweighted)
    ...benchmarks.map(b => `Improvement ${b.id}`),
    ...benchmarks.map(b => `Improvement ${b.id} (%)`),
    // Benchmark Details - Weighted Improvements
    ...benchmarks.map(b => `Weighted Improvement ${b.id}`),
    ...benchmarks.map(b => `Weighted Improvement ${b.id} (%)`),
    
    // Benchmark Weights (for reference)
    ...benchmarks.map(b => `Benchmark Weight ${b.id}`),

    // Parameter Snapshot
    'Total Payout Pool ($)',
    'Bonus Percentage (β)',
    'Performance Sensitivity (α)',
    'Volume Weighting (γ)'
  ];

  const totalFinalPayout = clinicResults.reduce((sum, clinic) => sum + clinic.results.finalPayout, 0);
  const sumTotalImprovement = clinicResults.reduce((sum, clinic) => sum + clinic.results.totalImprovement, 0);

  const rows = clinicResults.map(clinic => [
    // Basic Information
    clinic.name,
    clinic.volume.toString(),
    
    // Share Calculations
    clinic.results.baseShare.toFixed(6),
    (clinic.results.baseShare * 100).toFixed(2),
    clinic.results.combinedPerformanceFactor.toFixed(6),
    clinic.results.adjustedShare.toFixed(6),
    clinic.results.normalizedAdjustedShare.toFixed(6),
    (clinic.results.normalizedAdjustedShare * 100).toFixed(2),
    
    // Payout Calculations
    clinic.results.mainPayout.toFixed(2),
    clinic.results.bonusPayout.toFixed(2),
    clinic.results.finalPayout.toFixed(2),
    totalFinalPayout > 0 ? ((clinic.results.finalPayout / totalFinalPayout) * 100).toFixed(2) : '0.00',
    
    // Improvement Summary
    clinic.results.totalImprovement.toFixed(6),
    (sumTotalImprovement > 0 ? (clinic.results.totalImprovement / sumTotalImprovement) * 100 : 0).toFixed(2),

    // Volume Weighting Detail
    Math.pow(clinic.volume, params.volumeWeighting).toFixed(6),
    
    // Benchmark Details - Target Rates (Benchmark), Current & Previous
    ...benchmarks.map(b => (b.rate || 0).toFixed(1)),
    // Benchmark Details - Current Rates
    ...benchmarks.map(b => (clinic.currentRates[b.id] || 0).toFixed(1)),
    
    // Benchmark Details - Previous Rates
    ...benchmarks.map(b => (clinic.previousRates[b.id] || 0).toFixed(1)),
    
    // Benchmark Details - Performance Factors
    ...benchmarks.map(b => clinic.results.performanceFactors[b.id].toFixed(6)),
    
    // Benchmark Details - Individual Improvements (unweighted)
    ...benchmarks.map(b => clinic.results.improvements[b.id].toFixed(6)),
    ...benchmarks.map(b => (clinic.results.improvements[b.id] * 100).toFixed(2)),
    // Benchmark Details - Weighted Improvements
    ...benchmarks.map(b => ((clinic.results.improvements[b.id] * (b.weight ?? 0))).toFixed(6)),
    ...benchmarks.map(b => ((clinic.results.improvements[b.id] * (b.weight ?? 0)) * 100).toFixed(2)),
    
    // Benchmark Weights (for reference)
    ...benchmarks.map(b => ((b.weight ?? 0)).toFixed(3)),

    // Parameter Snapshot
    params.totalPayout.toFixed(2),
    params.bonusPercentage.toFixed(3),
    params.performanceSensitivity.toFixed(3),
    params.volumeWeighting.toFixed(3)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}