import { CalculationParams } from '@/types';

interface ParameterInputsProps {
  params: CalculationParams;
  setParams: (params: CalculationParams) => void;
  numClinics: number;
  setNumClinics: (num: number) => void;
  numBenchmarks: number;
  setNumBenchmarks: (num: number) => void;
}

export default function ParameterInputs({
  params,
  setParams,
  numClinics,
  setNumClinics,
  numBenchmarks,
  setNumBenchmarks,
}: ParameterInputsProps) {
  const handleParamChange = (key: keyof CalculationParams, value: number) => {
    setParams({ ...params, [key]: value });
  };

  return (
    <div className="bg-white border border-secondary rounded-lg p-6">
      <h3 className="text-lg font-medium text-text mb-4">Parameters</h3>
      
      <div className="space-y-4">
        {/* Basic Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-regular text-text mb-1">
              Number of Clinics
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={numClinics}
              onChange={(e) => setNumClinics(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-regular text-text mb-1">
              Number of Benchmarks
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={numBenchmarks}
              onChange={(e) => setNumBenchmarks(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-regular text-text mb-1">
              Total Payout Pool ($)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={params.totalPayout}
              onChange={(e) => handleParamChange('totalPayout', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-regular text-text mb-1">
              Bonus Percentage (decimal)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={params.bonusPercentage}
              onChange={(e) => handleParamChange('bonusPercentage', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-regular text-text mb-2">
              Performance Sensitivity (α): {params.performanceSensitivity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.performanceSensitivity}
              onChange={(e) => handleParamChange('performanceSensitivity', parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block text-sm font-regular text-text mb-2">
              Volume Weighting (γ): {params.volumeWeighting.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.volumeWeighting}
              onChange={(e) => handleParamChange('volumeWeighting', parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}