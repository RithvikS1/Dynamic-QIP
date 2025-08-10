'use client';

import { useState, useEffect } from 'react';
import { Clinic, Benchmark, CalculationParams, ClinicResults } from '@/types';
import { calculateQIPPayouts, exportToCSV } from '@/utils/calculations';
import ParameterInputs from '@/components/ParameterInputs';
import BenchmarkTable from '@/components/BenchmarkTable';
import ClinicTable from '@/components/ClinicTable';
import PayoutResults from '@/components/PayoutResults';
import Charts from '@/components/Charts';

export default function Home() {
  // Core parameters
  const [params, setParams] = useState<CalculationParams>({
    totalPayout: 100000,
    bonusPercentage: 0.2,
    performanceSensitivity: 0.5,
    volumeWeighting: 0.8,
  });

  const [numClinics, setNumClinics] = useState(3);
  const [numBenchmarks, setNumBenchmarks] = useState(2);

  // Benchmarks data
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([
    { id: 'b1', rate: 85, weight: 1 },
    { id: 'b2', rate: 90, weight: 1 },
  ]);

  // Clinics data
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: 'c1',
      name: 'Clinic A',
      volume: 1000,
      currentRates: { b1: 88, b2: 92 },
      previousRates: { b1: 85, b2: 89 },
    },
    {
      id: 'c2',
      name: 'Clinic B',
      volume: 1500,
      currentRates: { b1: 90, b2: 88 },
      previousRates: { b1: 87, b2: 86 },
    },
    {
      id: 'c3',
      name: 'Clinic C',
      volume: 800,
      currentRates: { b1: 82, b2: 95 },
      previousRates: { b1: 80, b2: 92 },
    },
  ]);

  // Results
  const [results, setResults] = useState<ClinicResults[]>([]);

  // Update benchmarks when count changes
  useEffect(() => {
    setBenchmarks(prev => {
      let newBenchmarks = [...prev];
      while (newBenchmarks.length < numBenchmarks) {
        const newId = `b${newBenchmarks.length + 1}`;
        newBenchmarks.push({ id: newId, rate: 85, weight: 0 });
      }
      newBenchmarks = newBenchmarks.slice(0, numBenchmarks);

      // Set weights: if single benchmark, weight = 1; else equal weights summing to 1
      if (numBenchmarks === 1) {
        newBenchmarks = newBenchmarks.map(b => ({ ...b, weight: 1 }));
      } else {
        const equalWeight = numBenchmarks > 0 ? 1 / numBenchmarks : 0;
        newBenchmarks = newBenchmarks.map(b => ({ ...b, weight: equalWeight }));
      }

      return newBenchmarks;
    });
  }, [numBenchmarks]);

  // Update clinics when count changes
  useEffect(() => {
    setClinics(prev => {
      const newClinics = [...prev];
      while (newClinics.length < numClinics) {
        const newId = `c${newClinics.length + 1}`;
        const currentRates: { [key: string]: number } = {};
        const previousRates: { [key: string]: number } = {};
        benchmarks.forEach(b => {
          currentRates[b.id] = 85;
          previousRates[b.id] = 80;
        });
        newClinics.push({
          id: newId,
          name: `Clinic ${String.fromCharCode(65 + newClinics.length)}`,
          volume: 1000,
          currentRates,
          previousRates,
        });
      }
      return newClinics.slice(0, numClinics).map(clinic => ({
        ...clinic,
        currentRates: Object.fromEntries(
          benchmarks.map(b => [b.id, clinic.currentRates[b.id] || 85])
        ),
        previousRates: Object.fromEntries(
          benchmarks.map(b => [b.id, clinic.previousRates[b.id] || 80])
        ),
      }));
    });
  }, [numClinics, benchmarks]);

  // Recalculate results when inputs change
  useEffect(() => {
    const newResults = calculateQIPPayouts(clinics, benchmarks, params);
    setResults(newResults);
  }, [clinics, benchmarks, params]);

  const handleExportCSV = () => {
    const csvContent = exportToCSV(results, benchmarks, params);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'qip-payout-results.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-medium text-text mb-2">QIP Payout Calculator</h1>
          <p className="text-gray-600">Dynamic Quality Improvement Program payout calculator</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Side - Inputs */}
          <div className="space-y-6">
            <ParameterInputs
              params={params}
              setParams={setParams}
              numClinics={numClinics}
              setNumClinics={setNumClinics}
              numBenchmarks={numBenchmarks}
              setNumBenchmarks={setNumBenchmarks}
            />
            
            <BenchmarkTable
              benchmarks={benchmarks}
              setBenchmarks={setBenchmarks}
            />
            
            <ClinicTable
              clinics={clinics}
              setClinics={setClinics}
              benchmarks={benchmarks}
            />
          </div>

          {/* Right Side - Outputs */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-medium text-text">Results</h2>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              >
                Export CSV
              </button>
            </div>
            
            <PayoutResults results={results} />
            
            <Charts results={results} />
          </div>
        </div>
      </div>
    </div>
  );
}