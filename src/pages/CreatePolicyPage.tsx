import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PolicyForm from '@/components/policy/PolicyForm';
import { mockApi } from '@/services/mockData';
import { PolicyStatus } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function CreatePolicyPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Convert objectives string to array
      const objectives = data.objectives.split('\n').filter((o: string) => o.trim());
      
      const policyData = {
        ...data,
        objectives,
        status: PolicyStatus.DRAFT,
        budget: data.budget ? Number(data.budget) : undefined,
        responsibleOfficer: user?.name || '',
        createdBy: user?.id || '',
      };

      await mockApi.policies.create(policyData);
      
      // Show success message (in production, use a toast notification)
      alert('Policy created successfully!');
      navigate('/policies');
    } catch (error) {
      console.error('Failed to create policy:', error);
      alert('Failed to create policy. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Policy</h1>
          <p className="text-gray-600 mt-1">
            Draft a new policy proposal for review and approval
          </p>
        </div>

        <PolicyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </Layout>
  );
}
