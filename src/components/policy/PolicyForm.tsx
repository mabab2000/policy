import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PolicyPriority } from '@/types';
import { RWANDA_MINISTRIES } from '@/constants';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const policySchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  code: z.string().min(3, 'Policy code is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  objectives: z.string().min(20, 'Objectives are required'),
  problemStatement: z.string().min(30, 'Problem statement must be at least 30 characters'),
  targetPopulation: z.string().min(10, 'Target population is required'),
  priority: z.nativeEnum(PolicyPriority),
  alignmentVision2050: z.string().min(20, 'Vision 2050 alignment is required'),
  alignmentNST: z.string().min(20, 'NST alignment is required'),
  ministry: z.string().min(1, 'Ministry selection is required'),
  budget: z.string().optional(),
});

type PolicyFormData = z.infer<typeof policySchema>;

interface PolicyFormProps {
  onSubmit: (data: PolicyFormData) => Promise<void>;
  initialData?: Partial<PolicyFormData>;
  isSubmitting?: boolean;
}

export default function PolicyForm({ onSubmit, initialData, isSubmitting }: PolicyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: initialData,
  });

  // objectives are handled as a single textarea value via react-hook-form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Policy Title"
              {...register('title')}
              error={errors.title?.message}
              placeholder="e.g., Digital Rwanda 2030 Strategy"
              required
            />
            <Input
              label="Policy Code"
              {...register('code')}
              error={errors.code?.message}
              placeholder="e.g., POL-2024-001"
              required
            />
          </div>

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Provide a comprehensive description of the policy..."
            rows={4}
            required
          />

          <Textarea
            label="Problem Statement"
            {...register('problemStatement')}
            error={errors.problemStatement?.message}
            placeholder="What problem does this policy address?"
            rows={3}
            required
          />

          <Input
            label="Target Population"
            {...register('targetPopulation')}
            error={errors.targetPopulation?.message}
            placeholder="e.g., All Rwandan citizens, SMEs, Youth..."
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objectives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            label="Policy Objectives (one per line)"
            {...register('objectives')}
            error={errors.objectives?.message}
            placeholder="List the key objectives..."
            rows={5}
            required
            helperText="Enter each objective on a new line"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Strategic Alignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Alignment with Vision 2050"
            {...register('alignmentVision2050')}
            error={errors.alignmentVision2050?.message}
            placeholder="How does this policy align with Rwanda Vision 2050?"
            rows={3}
            required
          />

          <Textarea
            label="Alignment with National Strategy for Transformation (NST)"
            {...register('alignmentNST')}
            error={errors.alignmentNST?.message}
            placeholder="How does this policy support NST priority areas?"
            rows={3}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Responsible Ministry"
              {...register('ministry')}
              options={RWANDA_MINISTRIES.map(m => ({ value: m, label: m }))}
              error={errors.ministry?.message}
              required
            />

            <Select
              label="Priority Level"
              {...register('priority')}
              options={[
                { value: PolicyPriority.CRITICAL, label: 'Critical' },
                { value: PolicyPriority.HIGH, label: 'High' },
                { value: PolicyPriority.MEDIUM, label: 'Medium' },
                { value: PolicyPriority.LOW, label: 'Low' },
              ]}
              error={errors.priority?.message}
              required
            />
          </div>

          <Input
            label="Estimated Budget (RWF)"
            type="number"
            {...register('budget')}
            error={errors.budget?.message}
            placeholder="e.g., 50000000000"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" size="lg">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
          {initialData ? 'Update Policy' : 'Create Policy'}
        </Button>
      </div>
    </form>
  );
}
