import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Stakeholder } from '@/types';
import { mockApi } from '@/services/mockData';

export default function StakeholdersPage() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStakeholders();
  }, []);

  const loadStakeholders = async () => {
    try {
      setLoading(true);
      const data = await mockApi.stakeholders.getAll();
      setStakeholders(data);
    } catch (error) {
      console.error('Failed to load stakeholders:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Organization',
      accessor: (row: Stakeholder) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <Badge variant="primary">{row.type}</Badge>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson' as keyof Stakeholder,
    },
    {
      header: 'Email',
      accessor: (row: Stakeholder) => (
        <a href={`mailto:${row.email}`} className="text-primary-600 hover:underline flex items-center gap-1">
          <Mail className="h-4 w-4" />
          {row.email}
        </a>
      ),
    },
    {
      header: 'Phone',
      accessor: (row: Stakeholder) => (
        <a href={`tel:${row.phone}`} className="text-primary-600 hover:underline flex items-center gap-1">
          <Phone className="h-4 w-4" />
          {row.phone}
        </a>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stakeholder Management</h1>
            <p className="text-gray-600 mt-1">
              Manage stakeholders and track consultation feedback
            </p>
          </div>
          <Button variant="primary" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Stakeholder
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>All Stakeholders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table<Stakeholder> data={stakeholders} columns={columns} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <div className="inline-flex p-3 bg-primary-50 rounded-lg mb-3">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stakeholders.length}</p>
                    <p className="text-sm text-gray-600">Total Stakeholders</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <div className="inline-flex p-3 bg-success-50 rounded-lg mb-3">
                      <Users className="h-6 w-6 text-success-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stakeholders.filter(s => s.type === 'PRIVATE').length}
                    </p>
                    <p className="text-sm text-gray-600">Private Sector</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <div className="inline-flex p-3 bg-warning-50 rounded-lg mb-3">
                      <Users className="h-6 w-6 text-warning-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stakeholders.filter(s => s.type === 'INTERNATIONAL').length}
                    </p>
                    <p className="text-sm text-gray-600">International</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <div className="inline-flex p-3 bg-blue-50 rounded-lg mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stakeholders.filter(s => s.type === 'CSO').length}
                    </p>
                    <p className="text-sm text-gray-600">CSOs</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
