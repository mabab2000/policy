import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Target, TrendingUp, Award } from 'lucide-react';
import { mockKPIs } from '@/services/mockData';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/constants';

export default function ImihigoPage() {
  const kpiData = mockKPIs.map(kpi => ({
    name: kpi.name,
    baseline: kpi.baseline,
    current: kpi.current,
    target: kpi.target,
  }));

  const progressData = [
    { month: 'Jan', planned: 20, actual: 18 },
    { month: 'Feb', planned: 25, actual: 24 },
    { month: 'Mar', planned: 30, actual: 28 },
    { month: 'Apr', planned: 35, actual: 33 },
  ];

  return (
    <Layout>
      <div className="mt-2 space-y-4">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-primary-50 rounded-lg mb-3">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">24</p>
              <p className="text-gray-600">Active KPIs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-success-50 rounded-lg mb-3">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">78%</p>
              <p className="text-gray-600">Avg Achievement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-warning-50 rounded-lg mb-3">
                <Award className="h-8 w-8 text-warning-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">18</p>
              <p className="text-gray-600">Targets Met</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>KPI Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill={CHART_COLORS.secondary} name="Baseline" />
                <Bar dataKey="current" fill={CHART_COLORS.primary} name="Current" />
                <Bar dataKey="target" fill={CHART_COLORS.success} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned vs Actual Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke={CHART_COLORS.warning} strokeWidth={2} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke={CHART_COLORS.primary} strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>District Imihigo Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Gasabo', 'Kicukiro', 'Nyarugenge'].map((district, index) => (
                <div key={district} className="flex items-center justify-between p-4 border-2 border-primary-100 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{district} District</p>
                    <p className="text-sm text-gray-600">FY 2024-2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{85 - index * 3}%</p>
                    <p className="text-sm text-gray-600">Performance Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
