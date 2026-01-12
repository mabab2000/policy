import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Scale, FileText, CheckCircle, Clock } from 'lucide-react';

export default function LegalCabinetPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal & Cabinet Review</h1>
          <p className="text-gray-600 mt-1">Track policies through legal and cabinet approval process</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-primary-50 rounded-lg mb-3">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-warning-50 rounded-lg mb-3">
                <Clock className="h-6 w-6 text-warning-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-success-50 rounded-lg mb-3">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-blue-50 rounded-lg mb-3">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Legal Review</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Cabinet Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Digital Rwanda 2030', status: 'Approved', date: '2024-01-15' },
                { title: 'Green Agriculture Modernization', status: 'Under Review', date: '2024-01-20' },
                { title: 'Universal Health Coverage', status: 'Legal Review', date: '2024-01-25' },
              ].map((item, i) => (
                <div key={i} className="p-4 border-2 border-primary-100 rounded-lg hover:bg-primary-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">Submitted: {item.date}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      item.status === 'Approved' ? 'bg-success-100 text-success-700 border-2 border-success-200' :
                      item.status === 'Under Review' ? 'bg-warning-100 text-warning-700 border-2 border-warning-200' :
                      'bg-primary-100 text-primary-700 border-2 border-primary-200'
                    }`}>
                      {item.status}
                    </span>
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
