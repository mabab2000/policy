import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ExecutionPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Decentralized Execution</h1>
          <p className="text-gray-600 mt-1">Track activities and progress at district and sector level</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-primary-50 rounded-lg mb-3">
                <Activity className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">45</p>
              <p className="text-sm text-gray-600">Total Activities</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-success-50 rounded-lg mb-3">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-warning-50 rounded-lg mb-3">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-red-50 rounded-lg mb-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Delayed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Assigned Activities</CardTitle>
              <Button variant="primary">Submit Progress Report</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border-2 border-primary-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Activity {i}</h4>
                      <p className="text-sm text-gray-600">Project: Digital Infrastructure</p>
                    </div>
                    <div className="text-right">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${65 + i * 10}%` }} />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{65 + i * 10}% Complete</p>
                    </div>
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
