import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PolicyForm from '@/components/policy/PolicyForm';
import { useAuthStore } from '@/store/authStore';

export default function CreatePolicyPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
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

      // Call the API endpoint
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
      
      alert(`Policy created successfully! Code: ${result.policy?.code || 'N/A'}`);
      navigate('/policies');
    } catch (error: any) {
      console.error('Failed to create policy:', error);
      alert(error.message || 'Failed to create policy. Please try again.');
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
