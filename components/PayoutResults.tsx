import { ClinicResults } from '@/types';

interface PayoutResultsProps {
  results: ClinicResults[];
}

export default function PayoutResults({ results }: PayoutResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDecimal = (value: number) => {
    return value.toFixed(4);
  };

  return (
    <div className="bg-white border border-secondary rounded-lg p-6">
      <h3 className="text-lg font-medium text-text mb-4">Payout Results</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Clinic</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Patients</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Base Share</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Perf. Factor</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Norm. Share</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Main Payout</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Bonus Payout</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text">Final Payout</th>
            </tr>
          </thead>
          <tbody>
            {results.map((clinic, index) => (
              <tr key={clinic.id} className={index % 2 === 0 ? 'bg-tableRow' : 'bg-white'}>
                <td className="py-3 px-4 text-sm font-medium text-text">{clinic.name}</td>
                <td className="py-3 px-4 text-sm text-text">{clinic.volume.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-text">{formatPercentage(clinic.results.baseShare)}</td>
                <td className="py-3 px-4 text-sm text-text">{formatDecimal(clinic.results.combinedPerformanceFactor)}</td>
                <td className="py-3 px-4 text-sm text-text">{formatPercentage(clinic.results.normalizedAdjustedShare)}</td>
                <td className="py-3 px-4 text-sm text-text">{formatCurrency(clinic.results.mainPayout)}</td>
                <td className="py-3 px-4 text-sm text-text">{formatCurrency(clinic.results.bonusPayout)}</td>
                <td className="py-3 px-4 text-sm font-medium text-primary">{formatCurrency(clinic.results.finalPayout)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-secondary font-medium">
              <td className="py-3 px-4 text-sm text-text">Total</td>
              <td className="py-3 px-4 text-sm text-text">
                {results.reduce((sum, clinic) => sum + clinic.volume, 0).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm text-text">100.00%</td>
              <td className="py-3 px-4 text-sm text-text">-</td>
              <td className="py-3 px-4 text-sm text-text">100.00%</td>
              <td className="py-3 px-4 text-sm text-text">
                {formatCurrency(results.reduce((sum, clinic) => sum + clinic.results.mainPayout, 0))}
              </td>
              <td className="py-3 px-4 text-sm text-text">
                {formatCurrency(results.reduce((sum, clinic) => sum + clinic.results.bonusPayout, 0))}
              </td>
              <td className="py-3 px-4 text-sm font-medium text-primary">
                {formatCurrency(results.reduce((sum, clinic) => sum + clinic.results.finalPayout, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}