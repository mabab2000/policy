import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Loader2, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface ChartData {
  chart_type: string;
  title: string;
  labels: string[];
  values: number[];
}

interface ProjectResults {
  project_id: string;
  charts: ChartData[];
}

type ToastType = 'success' | 'error' | null;

export default function DataReviewPage() {
  const { currentProject } = useAuthStore();
  const [data, setData] = useState<ProjectResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);

  const showToast = (msg: string, type: ToastType = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastType(null);
      setToastMessage('');
    }, 4000);
  };

  useEffect(() => {
    const fetchChartData = async () => {
      if (!currentProject?.project_id) {
        setError('No project selected');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://policy-pre-analyser.onrender.com/projects/${currentProject.project_id}/results`,
          {
            headers: {
              'accept': 'application/json',
            },
          }
        );

        setData(response.data);
      } catch (err: any) {
        const message = err?.response?.data?.message || err.message || 'Failed to fetch chart data';
        setError(message);
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [currentProject?.project_id]);

  const handleAnalysisPaspace = async () => {
    if (!currentProject?.project_id) {
      showToast('No project selected', 'error');
      return;
    }

    setAnalysisLoading(true);
    try {
      const resp = await axios.get(
        `https://policy-pre-analyser.onrender.com/projects/${currentProject.project_id}/organized-results`,
        { headers: { accept: 'application/json' } }
      );

      // If the endpoint returns charts, update local data
      if (resp?.data) {
        setData(resp.data as ProjectResults);
      }

      const message = resp?.data?.message || 'Organized results fetched successfully';
      showToast(message, 'success');
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to fetch organized results';
      showToast(message, 'error');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const getMaxValue = (values: number[]) => Math.max(...values);
  const getPercentage = (value: number, max: number) => (value / max) * 100;

  const renderLineChart = (chart: ChartData) => {
    const maxValue = getMaxValue(chart.values);
    const minValue = Math.min(...chart.values);
    const range = maxValue - minValue || 1;
    const width = 700;
    const height = 350;
    const padding = 60;
    const bottomPadding = 80;

    const xStep = (width - 2 * padding) / (chart.values.length - 1 || 1);
    const yScale = (height - padding - bottomPadding) / range;

    const points = chart.values.map((val, idx) => {
      const x = padding + idx * xStep;
      const y = height - bottomPadding - ((val - minValue) * yScale);
      return `${x},${y}`;
    }).join(' ');

    return (
      <Card key={chart.title} className="p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-900">{chart.title}</h3>
        </div>
        
        <div className="w-full overflow-x-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minHeight: '300px' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => {
              const y = padding + (i * (height - padding - bottomPadding) / 4);
              return (
                <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              );
            })}
            
            {/* Area under line */}
            <polygon
              points={`${padding},${height - bottomPadding} ${points} ${width - padding},${height - bottomPadding}`}
              fill="url(#lineGradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points and labels */}
            {chart.values.map((val, idx) => {
              const x = padding + idx * xStep;
              const y = height - bottomPadding - ((val - minValue) * yScale);
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="6" fill="white" stroke="#3b82f6" strokeWidth="3" />
                  <text x={x} y={y - 15} textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e293b">
                    {val.toLocaleString()}
                  </text>
                  <text x={x} y={height - bottomPadding + 25} textAnchor="middle" fontSize="12" fill="#475569" fontWeight="500">
                    {chart.labels[idx]}
                  </text>
                </g>
              );
            })}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map(i => {
              const val = maxValue - (i * range / 4);
              const y = padding + (i * (height - padding - bottomPadding) / 4);
              return (
                <text key={i} x={padding - 15} y={y + 5} textAnchor="end" fontSize="13" fill="#64748b" fontWeight="500">
                  {Math.round(val).toLocaleString()}
                </text>
              );
            })}
          </svg>
        </div>
        
        <div className="mt-4 pt-4 border-t-2 border-gray-200">
          <div className="text-sm text-gray-600 font-medium">
            📊 {chart.chart_type.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </Card>
    );
  };

  const renderPieChart = (chart: ChartData) => {
    const total = chart.values.reduce((sum, val) => sum + val, 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    
    let currentAngle = -90;
    const slices = chart.values.map((value, idx) => {
      const percentage = (value / total) * 100;
      const angle = (value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = 150 + 100 * Math.cos(startRad);
      const y1 = 150 + 100 * Math.sin(startRad);
      const x2 = 150 + 100 * Math.cos(endRad);
      const y2 = 150 + 100 * Math.sin(endRad);
      const largeArc = angle > 180 ? 1 : 0;

      return { startAngle, endAngle, percentage, value, x1, y1, x2, y2, largeArc, color: colors[idx % colors.length] };
    });

    return (
      <Card key={chart.title} className="p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">{chart.title}</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
          <div className="relative">
            <svg viewBox="0 0 300 300" className="w-72 h-72">
              {slices.map((slice, idx) => (
                <g key={idx}>
                  <path
                    d={`M 150 150 L ${slice.x1} ${slice.y1} A 100 100 0 ${slice.largeArc} 1 ${slice.x2} ${slice.y2} Z`}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="3"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </g>
              ))}
              <circle cx="150" cy="150" r="50" fill="white" />
              <text x="150" y="145" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1f2937">Total</text>
              <text x="150" y="165" textAnchor="middle" fontSize="20" fontWeight="700" fill="#3b82f6">{total.toLocaleString()}</text>
            </svg>
          </div>
          
          <div className="flex-1 space-y-3 w-full">
            {chart.labels.map((label, idx) => {
              const slice = slices[idx];
              return (
                <div key={idx} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ backgroundColor: slice.color }}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800 truncate">{label}</span>
                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                          {slice.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${slice.percentage}%`, backgroundColor: slice.color }}></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{slice.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t-2 border-gray-200">
          <div className="text-sm text-gray-600 font-medium">
            📊 {chart.chart_type.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </Card>
    );
  };

  const renderHistogram = (chart: ChartData) => {
    const maxValue = getMaxValue(chart.values);
    const numBars = chart.values.length;
    const totalWidth = Math.max(800, numBars * 100);
    const height = 400;
    const padding = 60;
    const bottomPadding = 100;
    const barWidth = (totalWidth - 2 * padding) / numBars;

    return (
      <Card key={chart.title} className="p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">{chart.title}</h3>
        </div>
        
        <div className="w-full overflow-x-auto bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg">
          <svg viewBox={`0 0 ${totalWidth} ${height}`} className="w-full h-auto" style={{ minHeight: '350px' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const y = padding + (i * (height - padding - bottomPadding) / 5);
              return (
                <line key={i} x1={padding} y1={y} x2={totalWidth - padding} y2={y} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
              );
            })}
            
            {/* Y-axis */}
            <line x1={padding} y1={padding} x2={padding} y2={height - bottomPadding} stroke="#64748b" strokeWidth="2" />
            
            {/* X-axis */}
            <line x1={padding} y1={height - bottomPadding} x2={totalWidth - padding} y2={height - bottomPadding} stroke="#64748b" strokeWidth="2" />
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const val = maxValue - (i * maxValue / 5);
              const y = padding + (i * (height - padding - bottomPadding) / 5);
              return (
                <text key={i} x={padding - 15} y={y + 5} textAnchor="end" fontSize="14" fill="#475569" fontWeight="600">
                  {Math.round(val).toLocaleString()}
                </text>
              );
            })}
            
            {/* Bars */}
            {chart.values.map((val, idx) => {
              const barHeight = ((val / maxValue) * (height - padding - bottomPadding));
              const x = padding + idx * barWidth + barWidth * 0.15;
              const y = height - bottomPadding - barHeight;
              const width = barWidth * 0.7;
              const barColor = `hsl(${220 + idx * 20}, 70%, 55%)`;
              
              return (
                <g key={idx}>
                  {/* Bar shadow */}
                  <rect
                    x={x + 3}
                    y={y + 3}
                    width={width}
                    height={barHeight}
                    fill="#000000"
                    opacity="0.1"
                    rx="6"
                  />
                  
                  {/* Main bar with gradient */}
                  <defs>
                    <linearGradient id={`barGrad${idx}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={barColor} stopOpacity="1" />
                      <stop offset="100%" stopColor={barColor} stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={barHeight}
                    fill={`url(#barGrad${idx})`}
                    stroke={barColor}
                    strokeWidth="2"
                    rx="6"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  
                  {/* Value label on top of bar */}
                  <text
                    x={x + width / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="15"
                    fill="#1e293b"
                    fontWeight="700"
                  >
                    {val.toLocaleString()}
                  </text>
                  
                  {/* X-axis label */}
                  <text
                    x={x + width / 2}
                    y={height - bottomPadding + 25}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#475569"
                    fontWeight="600"
                  >
                    {chart.labels[idx].length > 15 ? chart.labels[idx].substring(0, 12) + '...' : chart.labels[idx]}
                  </text>
                  
                  {/* Full label if truncated */}
                  {chart.labels[idx].length > 15 && (
                    <text
                      x={x + width / 2}
                      y={height - bottomPadding + 42}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#64748b"
                      fontWeight="500"
                    >
                      {chart.labels[idx].substring(12)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Data summary table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Category</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700">Value</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {chart.labels.map((label, idx) => {
                const total = chart.values.reduce((a, b) => a + b, 0);
                const percentage = ((chart.values[idx] / total) * 100).toFixed(1);
                return (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800">{label}</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900">{chart.values[idx].toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-4 border-t-2 border-gray-200">
          <div className="text-sm text-gray-600 font-medium">
            📊 {chart.chart_type.replace('_', ' ').toUpperCase()} • Total: {chart.values.reduce((a, b) => a + b, 0).toLocaleString()}
          </div>
        </div>
      </Card>
    );
  };

  const renderBarChart = (chart: ChartData) => {
    const maxValue = getMaxValue(chart.values);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    return (
      <Card key={chart.title} className="p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">{chart.title}</h3>
        </div>
        
        <div className="space-y-4 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
          {chart.labels.map((label, index) => {
            const value = chart.values[index];
            const percentage = getPercentage(value, maxValue);
            const barColor = colors[index % colors.length];
            
            return (
              <div key={index} className="space-y-2 bg-white p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                  <span className="text-sm font-bold text-gray-900 px-3 py-1 bg-gray-100 rounded-full">
                    {value.toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 rounded-full transition-all duration-500 ease-out relative"
                      style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}dd 100%)`
                      }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20"></div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 mt-1 inline-block">{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t-2 border-gray-200">
          <div className="text-sm text-gray-600 font-medium">
            📊 {chart.chart_type.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Review</h1>
            <p className="text-gray-600 mt-1">
              Review and analyze chart data from processed documents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Project: {currentProject?.project_name || 'No project selected'}</span>
            </div>

            <div>
              <Button
                variant="primary"
                onClick={handleAnalysisPaspace}
                disabled={!currentProject?.project_id || analysisLoading}
                className="flex items-center gap-2"
              >
                {analysisLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : null}
                Analysis paspace
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
              <span className="text-lg text-gray-600">Loading chart data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Error Loading Data</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Charts Grid */}
        {data && !loading && !error && (
          <>
            {data.charts.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Chart Data Available
                  </h3>
                  <p className="text-gray-600">
                    Process and analyze documents first to generate chart data
                  </p>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {data.charts.map((chart) => {
                    // Use pie chart for 3-4 values
                    if (chart.values.length >= 3 && chart.values.length <= 4) {
                      return renderPieChart(chart);
                    }
                    
                    // Use histogram for 5 or more values
                    if (chart.values.length >= 5) {
                      return renderHistogram(chart);
                    }
                    
                    // For 1-2 values, respect the chart_type
                    switch (chart.chart_type) {
                      case 'line_chart':
                        return renderLineChart(chart);
                      case 'pie_chart':
                        return renderPieChart(chart);
                      case 'histogram':
                        return renderHistogram(chart);
                      case 'bar_chart':
                      default:
                        return renderBarChart(chart);
                    }
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Data Summary</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Showing {data.charts.length} charts generated from analyzed documents in project "{currentProject?.project_name}".
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Toast Notification */}
        {toastType && (
          <div className={`fixed right-4 bottom-4 w-80 p-4 rounded-lg shadow-lg border-2 z-50 ${
            toastType === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toastMessage}
          </div>
        )}
      </div>
    </Layout>
  );
}
