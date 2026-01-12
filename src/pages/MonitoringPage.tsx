import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart3, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/constants';

export default function MonitoringPage() {
  const progressData = [
    { month: 'Jan', planned: 20, actual: 18 },
    { month: 'Feb', planned: 25, actual: 24 },
    { month: 'Mar', planned: 30, actual: 28 },
    { month: 'Apr', planned: 35, actual: 33 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring & Evaluation</h1>
          <p className="text-gray-600 mt-1">Track performance, risks, and progress across all policies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-primary-50 rounded-lg mb-3">
                <BarChart3 className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-gray-600">Overall Performance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-success-50 rounded-lg mb-3">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">+12%</p>
              <p className="text-sm text-gray-600">Growth Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-warning-50 rounded-lg mb-3">
                <AlertCircle className="h-6 w-6 text-warning-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Active Risks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-blue-50 rounded-lg mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">142</p>
              <p className="text-sm text-gray-600">Reports Generated</p>
            </CardContent>
          </Card>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Progress Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border-2 border-primary-100 rounded-lg hover:bg-primary-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Progress Report #{i}</p>
                        <p className="text-sm text-gray-600">Submitted 2 days ago</p>
                      </div>
                      <span className="text-success-600 font-medium">65% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Budget constraints', severity: 'HIGH', color: 'warning' },
                  { title: 'Resource availability', severity: 'MEDIUM', color: 'primary' },
                  { title: 'Permit delays', severity: 'LOW', color: 'success' },
                ].map((risk, i) => (
                  <div key={i} className="p-3 border-2 border-primary-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{risk.title}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded bg-${risk.color}-100 text-${risk.color}-700 border-2 border-${risk.color}-200`}>
                        {risk.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
