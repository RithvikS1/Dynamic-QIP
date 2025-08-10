import { Clinic, Benchmark } from '@/types';

interface ClinicTableProps {
  clinics: Clinic[];
  setClinics: (clinics: Clinic[]) => void;
  benchmarks: Benchmark[];
}

export default function ClinicTable({ clinics, setClinics, benchmarks }: ClinicTableProps) {
  const handleClinicChange = (index: number, key: keyof Clinic, value: string | number) => {
    const newClinics = [...clinics];
    if (key === 'name') {
      newClinics[index] = { ...newClinics[index], [key]: value as string };
    } else if (key === 'volume') {
      newClinics[index] = { ...newClinics[index], [key]: value as number };
    }
    setClinics(newClinics);
  };

  const handleRateChange = (clinicIndex: number, benchmarkId: string, rateType: 'current' | 'previous', value: number) => {
    const newClinics = [...clinics];
    if (rateType === 'current') {
      newClinics[clinicIndex] = {
        ...newClinics[clinicIndex],
        currentRates: { ...newClinics[clinicIndex].currentRates, [benchmarkId]: value }
      };
    } else {
      newClinics[clinicIndex] = {
        ...newClinics[clinicIndex],
        previousRates: { ...newClinics[clinicIndex].previousRates, [benchmarkId]: value }
      };
    }
    setClinics(newClinics);
  };

  return (
    <div className="bg-white border border-secondary rounded-lg p-6">
      <h3 className="text-lg font-medium text-text mb-4">Clinics</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Clinic Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Number of Patients</th>
              {benchmarks.map(benchmark => (
                <th key={`current-${benchmark.id}`} className="text-left py-3 px-4 text-sm font-medium text-text">
                  Current {benchmark.id} (%)
                </th>
              ))}
              {benchmarks.map(benchmark => (
                <th key={`previous-${benchmark.id}`} className="text-left py-3 px-4 text-sm font-medium text-text">
                  Previous {benchmark.id} (%)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic, clinicIndex) => (
              <tr key={clinic.id} className={clinicIndex % 2 === 0 ? 'bg-tableRow' : 'bg-white'}>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={clinic.name}
                    onChange={(e) => handleClinicChange(clinicIndex, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-[120px]"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    value={clinic.volume}
                    onChange={(e) => handleClinicChange(clinicIndex, 'volume', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-[100px]"
                  />
                </td>
                {benchmarks.map(benchmark => (
                  <td key={`current-${benchmark.id}`} className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={clinic.currentRates[benchmark.id] || 0}
                      onChange={(e) => handleRateChange(clinicIndex, benchmark.id, 'current', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-[80px]"
                    />
                  </td>
                ))}
                {benchmarks.map(benchmark => (
                  <td key={`previous-${benchmark.id}`} className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={clinic.previousRates[benchmark.id] || 0}
                      onChange={(e) => handleRateChange(clinicIndex, benchmark.id, 'previous', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-[80px]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}