import { Benchmark } from '@/types';

interface BenchmarkTableProps {
  benchmarks: Benchmark[];
  setBenchmarks: (benchmarks: Benchmark[]) => void;
}

export default function BenchmarkTable({ benchmarks, setBenchmarks }: BenchmarkTableProps) {
  const handleBenchmarkChange = (index: number, key: keyof Benchmark, value: number) => {
    // If only one benchmark, force weight to 1
    if (key === 'weight' && benchmarks.length === 1) {
      const single = [...benchmarks];
      single[0] = { ...single[0], weight: 1 };
      setBenchmarks(single);
      return;
    }

    const newBenchmarks = [...benchmarks];
    newBenchmarks[index] = { ...newBenchmarks[index], [key]: value };
    
    // Enforce weights sum to 1: clamp non-last values, auto-adjust last to 1 - sum(previous)
    if (key === 'weight' && benchmarks.length > 1) {
      const isLastBenchmark = index === benchmarks.length - 1;

      if (!isLastBenchmark) {
        // Clamp current value to [0,1]
        let current = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

        // Sum of all non-last weights excluding current index
        let othersSum = 0;
        for (let i = 0; i < newBenchmarks.length - 1; i++) {
          if (i !== index) othersSum += newBenchmarks[i].weight || 0;
        }

        // Cap current so that othersSum + current <= 1
        if (othersSum + current > 1) {
          current = Math.max(0, 1 - othersSum);
        }
        newBenchmarks[index] = { ...newBenchmarks[index], weight: current };

        // Auto-fill last benchmark weight as the remaining share
        const lastWeight = Math.max(0, 1 - (othersSum + current));
        newBenchmarks[newBenchmarks.length - 1] = {
          ...newBenchmarks[newBenchmarks.length - 1],
          weight: lastWeight,
        };
      }
    }
    
    setBenchmarks(newBenchmarks);
  };

  return (
    <div className="bg-white border border-secondary rounded-lg p-6">
      <h3 className="text-lg font-medium text-text mb-4">Benchmarks</h3>
      {benchmarks.length > 1 && (
        <p className="text-sm text-gray-600 mb-4">
          Note: Weights must sum to 1. The last benchmark weight will automatically adjust.
        </p>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className="text-left py-3 px-4 text-sm font-medium text-text">ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Benchmark Rate (%)</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Weight (decimal)</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((benchmark, index) => (
              <tr key={benchmark.id} className={index % 2 === 0 ? 'bg-tableRow' : 'bg-white'}>
                <td className="py-3 px-4 text-sm text-text font-medium">{benchmark.id}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={benchmark.rate}
                    onChange={(e) => handleBenchmarkChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={benchmark.weight ?? 1}
                    onChange={(e) => handleBenchmarkChange(index, 'weight', parseFloat(e.target.value) || 0)}
                    disabled={(benchmarks.length === 1) || (index === benchmarks.length - 1 && benchmarks.length > 1)}
                    className={`w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${
                      (benchmarks.length === 1) || (index === benchmarks.length - 1 && benchmarks.length > 1) 
                        ? 'bg-gray-100 text-gray-600' 
                        : ''
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}