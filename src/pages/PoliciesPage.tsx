import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, Building, User } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import PolicyForm, { PolicyFormHandles } from '@/components/policy/PolicyForm';
import { useRef } from 'react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Policy, PolicyStatus, PolicyPriority } from '@/types';
import { POLICY_STATUS_CONFIG, POLICY_PRIORITY_CONFIG } from '@/constants';
import { mockApi } from '@/services/mockData';
import { formatDate } from '@/lib/utils';
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

  const canCreatePolicy = true; // show add controls on page (modal handles permission if needed)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<PolicyFormHandles | null>(null);

  const PolicyCard = ({ policy }: { policy: Policy }) => {
    const statusConfig = POLICY_STATUS_CONFIG[policy.status];
    const priorityConfig = POLICY_PRIORITY_CONFIG[policy.priority];

    return (
      <div 
        className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        onClick={() => navigate(`/policies/${policy.id}`)}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
              <p className="text-gray-600">Manage and track policy development lifecycle</p>
            </div>
          </div>
          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building className="h-4 w-4" />
              <span>{policy.ministry}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{policy.responsibleOfficer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(policy.createdAt)}</span>
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${priorityConfig.color}`}>
              Priority: {priorityConfig.label}
            </span>
            <div className="text-xs text-gray-400">
              v{policy.version}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
            {/* Add Policy icon button on same filter row */}
            <div className="flex items-center">
              <button
                onClick={() => { setModalStep(1); setIsModalOpen(true); }}
                aria-label="Add Policy"
                className="ml-auto bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
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
          <>
            {/* 3D Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolicies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Showing {filteredPolicies.length} of {policies.length} policies
                </span>
                <div className="flex gap-6">
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
          </>
        )}
      </div>
      {/* Modal for creating policy */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Create Policy — Step ${modalStep} of 4`}
        size="lg"
        footer={
          <div className="w-full flex items-center justify-between">
            <div />
            <div className="flex items-center gap-2">
              {modalStep > 1 && (
                <Button variant="outline" onClick={() => setModalStep(s => Math.max(1, s - 1))}>
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                isLoading={isSubmitting}
                onClick={async () => {
                  try {
                    if (!formRef.current) return;
                    const valid = await formRef.current.validateStep(modalStep);
                    if (!valid) return;
                    if (modalStep < 4) {
                      setModalStep(s => s + 1);
                      return;
                    }
                    // final submit
                    setIsSubmitting(true);
                    await formRef.current.submit();
                    setIsModalOpen(false);
                    await loadPolicies();
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {modalStep < 4 ? 'Next' : 'Create'}
              </Button>
            </div>
          </div>
        }
      >
        <PolicyForm
          ref={formRef}
          onSubmit={async (data) => {
            // Prepare data similar to CreatePolicyPage
            const objectives = data.objectives.split('\n').filter((o: string) => o.trim());
            const policyData = {
              ...data,
              objectives,
              status: PolicyStatus.DRAFT,
              responsibleOfficer: user?.name || '',
              createdBy: user?.id || '',
            };
            await mockApi.policies.create(policyData);
            alert('Policy created successfully!');
          }}
          isSubmitting={isSubmitting}
          showActions={false}
          visibleStep={modalStep}
        />
      </Modal>

      
    </Layout>
  );
}


