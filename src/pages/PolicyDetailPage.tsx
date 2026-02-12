import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Clock,
  DollarSign,
  Calendar,
  Building,
  Target,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import logoUrl from '/logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Policy, PolicyStatus } from '@/types';
import { POLICY_STATUS_CONFIG, POLICY_PRIORITY_CONFIG } from '@/constants';
import { mockApi } from '@/services/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (id) {
      loadPolicy(id);
    }
  }, [id]);

  const loadPolicy = async (policyId: string) => {
    try {
      setLoading(true);
      
      // Fetch from API endpoint
      const response = await fetch(`https://policy-users-go.onrender.com/api/policies/${policyId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load policy: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Policy Detail API Response:', result);
      
      // Map API response to local format
      const p = result.policy;
      const mappedPolicy: Policy = {
        id: p.id,
        code: p.code,
        title: p.title,
        description: p.description || '',
        problemStatement: p.problem_statement || '',
        targetPopulation: p.target_population || '',
        objectives: typeof p.objectives === 'string' ? [p.objectives] : (p.objectives || []),
        status: PolicyStatus.DRAFT,
        priority: (p.priority_level?.toUpperCase() || 'MEDIUM') as any,
        ministry: p.responsible_ministry,
        responsibleOfficer: '',
        alignmentVision2050: p.alignment_vision_2050 ? '✓ Aligned with Rwanda Vision 2050' : 'Not aligned',
        alignmentNST: p.alignment_nst ? '✓ Aligned with National Strategy for Transformation' : 'Not aligned',
        budget: p.budget,
        startDate: p.start_date,
        endDate: p.end_date,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        version: p.version || 1,
        createdBy: p.created_by || '',
      };
      
      setPolicy(mappedPolicy);
    } catch (error: any) {
      console.error('Failed to load policy:', error);
      // Fallback to mock data
      try {
        const data = await mockApi.policies.getById(policyId);
        setPolicy(data ?? null);
      } catch (e) {
        setPolicy(null);
      }
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

  if (!policy) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Not Found</h3>
          <Button variant="primary" onClick={() => navigate('/policies')}>
            Back to Policies
          </Button>
        </div>
      </Layout>
    );
  }

  const statusConfig = POLICY_STATUS_CONFIG[policy.status];
  const priorityConfig = POLICY_PRIORITY_CONFIG[policy.priority];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Policy Header */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{policy.title}</h1>
                  <Badge variant={getStatusBadgeVariant(policy.status)}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <p className="text-gray-600">{policy.code}</p>
              </div>
             
              
              <Link to="/implementation" aria-label="View deep policy details" className="ml-3">
                <div className="group flex flex-col items-center ml-3">
                  <img
                    src={logoUrl}
                    alt="Policy deep details"
                    style={{ transform: 'perspective(600px) rotateX(8deg) rotateY(-6deg)' }}
                    className="h-12 w-12 rounded-full shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="text-xs text-gray-500 mt-1">Tap for details</span>
                  <span className="sr-only">Tap to view deep information about this policy</span>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Building className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ministry</p>
                  <p className="font-medium text-gray-900">{policy.ministry}</p>
                </div>
              </div>

              {policy.budget && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium text-gray-900">{formatCurrency(policy.budget)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {policy.startDate ? formatDate(policy.startDate) : 'TBD'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-900">
                    {policy.endDate ? formatDate(policy.endDate) : 'TBD'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description and Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {policy.description ? (
                <p className="text-gray-700">{policy.description}</p>
              ) : (
                <p className="text-gray-400 italic">No description available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              {policy.problemStatement ? (
                <p className="text-gray-700">{policy.problemStatement}</p>
              ) : (
                <p className="text-gray-400 italic">No problem statement available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Objectives */}
        {policy.objectives && policy.objectives.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Policy Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {policy.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Strategic Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vision 2050 Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {policy.alignmentVision2050 === 'Aligned with Vision 2050' ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
                <p className="text-gray-700">{policy.alignmentVision2050}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NST Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {policy.alignmentNST === 'Aligned with NST' ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
                <p className="text-gray-700">{policy.alignmentNST}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {policy.targetPopulation && (
              <div>
                <p className="text-sm font-medium text-gray-600">Target Population</p>
                <p className="text-gray-900 mt-1">{policy.targetPopulation}</p>
              </div>
            )}
            {policy.responsibleOfficer && (
              <div>
                <p className="text-sm font-medium text-gray-600">Responsible Officer</p>
                <p className="text-gray-900 mt-1">{policy.responsibleOfficer}</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-primary-100">
              <div>
                <p className="text-sm font-medium text-gray-600">Version</p>
                <p className="text-gray-900 mt-1">{policy.version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-gray-900 mt-1">{formatDate(policy.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-gray-900 mt-1">{formatDate(policy.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
