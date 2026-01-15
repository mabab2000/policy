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
      border: 'border-blue-500',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      iconText: 'text-white',
      shadow: 'shadow-blue-500/20',
    },
    success: {
      border: 'border-green-500',
      iconBg: 'bg-gradient-to-br from-green-400 to-green-600',
      iconText: 'text-white',
      shadow: 'shadow-green-500/20',
    },
    warning: {
      border: 'border-yellow-500',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconText: 'text-white',
      shadow: 'shadow-yellow-500/20',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl p-6 border-2 ${colors.border} shadow-lg ${colors.shadow} transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-3">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <span className="text-sm font-bold text-gray-800">
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-2 font-medium">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${colors.iconBg} p-4 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
          <div className={colors.iconText}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
