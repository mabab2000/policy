import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Target,
  BarChart3,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/ui/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockApi, mockPolicies, mockKPIs } from '@/services/mockData';
import { DashboardStats, Policy, PolicyStatus } from '@/types';
import { POLICY_STATUS_CONFIG } from '@/constants';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/constants';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPolicies, setRecentPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, policiesData] = await Promise.all([
        mockApi.dashboard.getStats(),
        mockApi.policies.getAll(),
      ]);
      setStats(statsData);
      setRecentPolicies(policiesData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  // Policy status distribution data
  const policyStatusData = Object.values(PolicyStatus).map(status => ({
    name: POLICY_STATUS_CONFIG[status].label,
    value: mockPolicies.filter(p => p.status === status).length,
  }));

  // Only show statuses that have a non-zero count (so legend shows only active colors)
  const visibleStatusData = policyStatusData.filter(d => d.value > 0);

  // Monthly progress data
  const monthlyProgressData = [
    { month: 'Jan', policies: 35, completion: 65 },
    { month: 'Feb', policies: 38, completion: 68 },
    { month: 'Mar', policies: 42, completion: 70 },
    { month: 'Apr', policies: 45, completion: 72 },
  ];

  // KPI Performance data
  const kpiPerformanceData = mockKPIs.map(kpi => ({
    name: kpi.name,
    current: kpi.current,
    target: kpi.target,
    achievement: Math.round((kpi.current / kpi.target) * 100),
  }));

  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
    CHART_COLORS.info,
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header removed per request */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Policies"
            value={stats?.totalPolicies || 0}
            icon={<FileText className="h-6 w-6" />}
            color="primary"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Active Policies"
            value={stats?.activePolicies || 0}
            icon={<TrendingUp className="h-6 w-6" />}
            color="success"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Completion Rate"
            value={`${stats?.averageCompletionRate || 0}%`}
            icon={<CheckCircle className="h-6 w-6" />}
            color="success"
          />
          <StatsCard
            title="Citizen Feedback"
            value={stats?.citizenFeedbackCount || 0}
            icon={<MessageSquare className="h-6 w-6" />}
            color="warning"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Policy Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={visibleStatusData}
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                    labelLine={false}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {visibleStatusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={hoveredIndex === index ? '#111827' : undefined}
                        strokeWidth={hoveredIndex === index ? 3 : 0}
                        opacity={hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.45}
                        onMouseEnter={() => setHoveredIndex(index)}
                      />
                    ))}
                  </Pie>

                  <Legend
                    // custom payload showing each visible status with its color
                    payload={visibleStatusData.map((d, i) => ({
                      value: d.name,
                      type: 'square',
                      color: COLORS[i % COLORS.length],
                    }))}
                    content={(props) => {
                      const payload = (props as any)?.payload || [];
                      if (!Array.isArray(payload) || payload.length === 0) return null;
                      return (
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                          {payload.map((entry: any, i: number) => (
                            <div
                              key={entry.value || i}
                              onMouseEnter={() => setHoveredIndex(i)}
                              onMouseLeave={() => setHoveredIndex(null)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <span
                                style={{ background: entry.color }}
                                className={`h-3 w-3 rounded-sm ${hoveredIndex === i ? 'ring-2 ring-offset-1 ring-primary-500' : ''}`}
                              />
                              <span className="text-sm text-gray-700">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    name="Completion %"
                  />
                  <Line
                    type="monotone"
                    dataKey="policies"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2}
                    name="Active Policies"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* KPI Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kpiPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                <Bar dataKey="current" fill={CHART_COLORS.primary} name="Current" />
                <Bar dataKey="target" fill={CHART_COLORS.success} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Policies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Policies</CardTitle>
              <Button variant="outline" onClick={() => navigate('/policies')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPolicies.map((policy) => {
                const statusConfig = POLICY_STATUS_CONFIG[policy.status];
                return (
                  <div
                    key={policy.id}
                    className="flex items-center justify-between p-4 border-2 border-primary-100 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/policies/${policy.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{policy.title}</h4>
                        <Badge className={`${statusConfig.bgColor} ${statusConfig.color} border-2`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{policy.ministry}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {formatDate(policy.createdAt)}
                      </p>
                    </div>
                    {policy.budget && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(policy.budget)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>


      </div>
    </Layout>
  );
}
