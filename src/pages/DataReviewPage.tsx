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

  const renderBarChart = (chart: ChartData) => {
    const maxValue = getMaxValue(chart.values);
    
    return (
      <Card key={chart.title} className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
        </div>
        
        <div className="space-y-3">
          {chart.labels.map((label, index) => {
            const value = chart.values[index];
            const percentage = getPercentage(value, maxValue);
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Chart Type: {chart.chart_type.replace('_', ' ').toUpperCase()}
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
                  {data.charts.map((chart) => renderBarChart(chart))}
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
