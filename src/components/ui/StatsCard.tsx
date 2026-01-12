import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning';
}

export default function StatsCard({ title, value, icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      border: 'border-primary-200',
    },
    success: {
      bg: 'bg-success-50',
      text: 'text-success-600',
      border: 'border-success-200',
    },
    warning: {
      bg: 'bg-warning-50',
      text: 'text-warning-600',
      border: 'border-warning-200',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-lg p-6 border-2 ${colors.border} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <div className={colors.text}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
