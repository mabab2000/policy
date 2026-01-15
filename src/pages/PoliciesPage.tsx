import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Policy, PolicyStatus, PolicyPriority } from '@/types';
import { POLICY_STATUS_CONFIG, POLICY_PRIORITY_CONFIG } from '@/constants';
import { mockApi } from '@/services/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function PoliciesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await mockApi.policies.getAll();
      setPolicies(data);
    } catch (error) {
      console.error('Failed to load policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || policy.status === statusFilter;
    const matchesPriority = !priorityFilter || policy.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const canCreatePolicy = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.MINISTRY_OFFICER;

  const columns = [
    {
      header: 'Code',
      accessor: 'code' as keyof Policy,
      className: 'font-medium',
    },
    {
      header: 'Title',
      accessor: (row: Policy) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-sm text-gray-500">{row.ministry}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: Policy) => {
        const config = POLICY_STATUS_CONFIG[row.status];
        return (
          <Badge variant="primary" className={`${config.bgColor} ${config.color} border-2`}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: 'Priority',
      accessor: (row: Policy) => {
        const config = POLICY_PRIORITY_CONFIG[row.priority];
        return (
          <span className={`font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      header: 'Budget',
      accessor: (row: Policy) => row.budget ? formatCurrency(row.budget) : '-',
    },
    {
      header: 'Created',
      accessor: (row: Policy) => formatDate(row.createdAt),
    },
  ];

  return (
    <Layout>
      <div className="space-y-0 mt-0">
        {/* Header */}
        <div className="flex items-center justify-between">
         
          {canCreatePolicy && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/policies/create')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Policy
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border-2 border-primary-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                ...Object.values(PolicyStatus).map(status => ({
                  value: status,
                  label: POLICY_STATUS_CONFIG[status].label,
                })),
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              options={[
                { value: '', label: 'All Priorities' },
                ...Object.values(PolicyPriority).map(priority => ({
                  value: priority,
                  label: POLICY_PRIORITY_CONFIG[priority].label,
                })),
              ]}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredPolicies.length === 0 ? (
          <EmptyState
            icon={<Filter className="h-16 w-16" />}
            title="No policies found"
            description="No policies match your search criteria. Try adjusting your filters."
            action={
              canCreatePolicy ? (
                <Button variant="primary" onClick={() => navigate('/policies/create')}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Policy
                </Button>
              ) : undefined
            }
          />
        ) : (
          <Table<Policy & Record<string, unknown>>
            data={filteredPolicies as (Policy & Record<string, unknown>)[]}
            columns={columns}
            onRowClick={(policy) => navigate(`/policies/${policy.id}`)}
          />
        )}

        {/* Summary */}
        <div className="bg-white p-4 rounded-lg border-2 border-primary-200 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {filteredPolicies.length} of {policies.length} policies
            </span>
            <div className="flex gap-4">
              <span className="text-gray-600">
                <span className="font-semibold text-primary-600">
                  {policies.filter(p => p.status === PolicyStatus.IN_IMPLEMENTATION).length}
                </span>{' '}
                In Implementation
              </span>
              <span className="text-gray-600">
                <span className="font-semibold text-success-600">
                  {policies.filter(p => p.status === PolicyStatus.COMPLETED).length}
                </span>{' '}
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
