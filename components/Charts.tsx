'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ClinicResults } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  results: ClinicResults[];
}

export default function Charts({ results }: ChartsProps) {
  const chartColors = [
    '#3B82F6', // Primary blue
    '#10B981', // Emerald
    '#F59E0B', // Amber  
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];

  const barChartData = {
    labels: results.map(clinic => clinic.name),
    datasets: [
      {
        label: 'Main Payout',
        data: results.map(clinic => clinic.results.mainPayout),
        backgroundColor: chartColors[0],
        borderRadius: 4,
      },
      {
        label: 'Bonus Payout',
        data: results.map(clinic => clinic.results.bonusPayout),
        backgroundColor: chartColors[1],
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, Helvetica, Roboto, sans-serif',
          },
          color: '#111827',
        },
      },
      title: {
        display: true,
        text: 'Payout Breakdown by Clinic',
        font: {
          family: 'Inter, Helvetica, Roboto, sans-serif',
          size: 16,
          weight: 500,
        },
        color: '#111827',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          font: {
            family: 'Inter, Helvetica, Roboto, sans-serif',
          },
          color: '#111827',
        },
      },
      y: {
        stacked: true,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          font: {
            family: 'Inter, Helvetica, Roboto, sans-serif',
          },
          color: '#111827',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
      },
    },
  };

  const pieChartData = {
    labels: results.map(clinic => clinic.name),
    datasets: [
      {
        label: 'Final Payout',
        data: results.map(clinic => clinic.results.finalPayout),
        backgroundColor: chartColors.slice(0, results.length),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: 'Inter, Helvetica, Roboto, sans-serif',
          },
          color: '#111827',
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                return {
                  text: `${label}: $${value.toLocaleString()}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: 'Final Payout Distribution',
        font: {
          family: 'Inter, Helvetica, Roboto, sans-serif',
          size: 16,
          weight: 500,
        },
        color: '#111827',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((sum: number, value: number) => sum + value, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  if (results.length === 0) {
    return (
      <div className="bg-white border border-secondary rounded-lg p-6">
        <h3 className="text-lg font-medium text-text mb-4">Charts</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data to display
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="bg-white border border-secondary rounded-lg p-6">
        <div className="h-80">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white border border-secondary rounded-lg p-6">
        <div className="h-80">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
}