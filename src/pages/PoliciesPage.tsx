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

export default function PoliciesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastType(null);
      setToastMessage('');
    }, 4000);
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      // Fetch from new API endpoint
      const response = await fetch('https://policy-users-go.onrender.com/api/policies', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load policies: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      // Map API response to local format
      const mappedPolicies = (result.policies || []).map((p: any) => ({
        id: p.policy_id,
        code: p.code,
        title: p.title,
        description: '', // Not in list response
        status: PolicyStatus.DRAFT, // Default status
        priority: (p.priority_level?.toUpperCase() || 'MEDIUM') as PolicyPriority,
        ministry: p.responsible_ministry,
        responsibleOfficer: '', // Not in API response
        createdAt: p.created_at,
        updatedAt: p.created_at, // Use created_at as fallback
        version: 1, // Default version
      }));
      
      console.log('Mapped Policies:', mappedPolicies);
      setPolicies(mappedPolicies);
    } catch (error: any) {
      console.error('Failed to load policies:', error);
      // Don't show error toast on first load, just use fallback
      // Fallback to mock data on error
      try {
        const data = await mockApi.policies.getAll();
        setPolicies(data);
      } catch (e) {
        console.error('Failed to load mock data:', e);
        setPolicies([]); // Set empty array to prevent undefined errors
      }
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

  // Map policy status to Badge variant
  const getStatusBadgeVariant = (status: PolicyStatus): 'primary' | 'success' | 'warning' | 'gray' | 'blue' | 'danger' => {
    switch (status) {
      case PolicyStatus.COMPLETED:
        return 'success';
      case PolicyStatus.APPROVED:
        return 'success';
      case PolicyStatus.REJECTED:
        return 'danger';
      case PolicyStatus.LEGAL_REVIEW:
      case PolicyStatus.EVALUATION:
        return 'warning';
      case PolicyStatus.DRAFT:
        return 'gray';
      case PolicyStatus.STAKEHOLDER_CONSULTATION:
      case PolicyStatus.MONITORING:
        return 'blue';
      default:
        return 'primary';
    }
  };

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
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                {policy.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{policy.code}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(policy.status)}>{statusConfig.label}</Badge>
          </div>

          {/* Description */}
          {policy.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{policy.description}</p>
          )}

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building className="h-4 w-4" />
              <span>{policy.ministry}</span>
            </div>
            {policy.responsibleOfficer && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>{policy.responsibleOfficer}</span>
              </div>
            )}
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
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
            <p className="text-gray-600">Manage and track policy development lifecycle</p>
          </div>
        </div>

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
            try {
              // Map form data to API format
              const policyPayload = {
                title: data.title,
                description: data.description,
                problem_statement: data.problemStatement,
                target_population: data.targetPopulation,
                objectives: data.objectives,
                alignment_vision_2050: data.alignmentVision2050,
                alignment_nst: data.alignmentNST,
                responsible_ministry: data.ministry,
                priority_level: data.priority,
              };

              // Call the new API endpoint
              const response = await fetch('https://policy-users-go.onrender.com/api/policies', {
                method: 'POST',
                headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(policyPayload),
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to create policy: ${response.statusText}`);
              }

              const result = await response.json();
              console.log('Policy created:', result.policy);
              showToast(`Policy created successfully! Code: ${result.policy?.code || 'N/A'}`, 'success');
            } catch (err: any) {
              console.error('Error creating policy:', err);
              showToast(err.message || 'Failed to create policy. Please try again.', 'error');
              throw err;
            }
          }}
          isSubmitting={isSubmitting}
          showActions={false}
          visibleStep={modalStep}
        />
      </Modal>

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
      
    </Layout>
  );
}
