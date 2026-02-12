import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  description: z.string().min(50, 'Description must be at least 50 characters'),
  objectives: z.string().min(20, 'Objectives are required'),
  problemStatement: z.string().min(30, 'Problem statement must be at least 30 characters'),
  targetPopulation: z.string().min(10, 'Target population is required'),
  priority: z.nativeEnum(PolicyPriority),
  alignmentVision2050: z.boolean(),
  alignmentNST: z.boolean(),
  ministry: z.string().min(1, 'Ministry selection is required'),
});

type PolicyFormData = z.infer<typeof policySchema>;

export interface PolicyFormHandles {
  submit: () => Promise<void>;
  validateStep: (step: number) => Promise<boolean>;
}

interface PolicyFormProps {
  onSubmit: (data: PolicyFormData) => Promise<void>;
  initialData?: Partial<PolicyFormData>;
  isSubmitting?: boolean;
  showActions?: boolean;
  visibleStep?: number | undefined;
}

const PolicyForm = forwardRef<PolicyFormHandles, PolicyFormProps>(function PolicyForm(
  { onSubmit, initialData, isSubmitting, showActions = true, visibleStep },
  ref
) {
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      title: '',
      description: '',
      objectives: '',
      problemStatement: '',
      targetPopulation: '',
      priority: PolicyPriority.MEDIUM,
      alignmentVision2050: false,
      alignmentNST: false,
      ministry: '',
      ...initialData,
    },
  });

  // objectives are handled as a single textarea value via react-hook-form

  const doSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      await doSubmit();
    },
    validateStep: async (step: number) => {
      const stepFields: Record<number, string[]> = {
        1: ['title', 'description', 'problemStatement', 'targetPopulation'],
        2: ['objectives'],
        3: ['alignmentVision2050', 'alignmentNST'],
        4: ['ministry', 'priority'],
      };
      const fields = stepFields[step] || [];
      if (fields.length === 0) return true;
      const res = await trigger(fields as any);
      return res;
    },
  }));

  return (
    <form onSubmit={doSubmit} className="space-y-6">
      {(visibleStep === undefined || visibleStep === 1) && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Policy Title"
              {...register('title')}
              error={errors.title?.message}
              placeholder="e.g., Digital Rwanda 2030 Strategy"
              required
            />

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
      )}

      {(visibleStep === undefined || visibleStep === 2) && (
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
      )}

      {(visibleStep === undefined || visibleStep === 3) && (
        <Card>
          <CardHeader>
            <CardTitle>Strategic Alignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="alignmentVision2050"
                  {...register('alignmentVision2050')}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="alignmentVision2050" className="flex-1 text-sm font-medium text-gray-900 cursor-pointer">
                  This policy aligns with Rwanda Vision 2050
                </label>
              </div>
              {errors.alignmentVision2050?.message && (
                <p className="text-sm text-red-600">{errors.alignmentVision2050.message}</p>
              )}

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="alignmentNST"
                  {...register('alignmentNST')}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="alignmentNST" className="flex-1 text-sm font-medium text-gray-900 cursor-pointer">
                  This policy aligns with the National Strategy for Transformation (NST)
                </label>
              </div>
              {errors.alignmentNST?.message && (
                <p className="text-sm text-red-600">{errors.alignmentNST.message}</p>
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Policies should align with Rwanda's national development frameworks to ensure coherence and strategic impact.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {(visibleStep === undefined || visibleStep === 4) && (
        <Card>
          <CardHeader>
            <CardTitle>Implementation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsible Ministry <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="ministry"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: '', label: 'Select a ministry...' },
                        ...RWANDA_MINISTRIES.map(m => ({ value: m, label: m }))
                      ]}
                      error={errors.ministry?.message}
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: PolicyPriority.CRITICAL, label: 'Critical' },
                        { value: PolicyPriority.HIGH, label: 'High' },
                        { value: PolicyPriority.MEDIUM, label: 'Medium' },
                        { value: PolicyPriority.LOW, label: 'Low' },
                      ]}
                      error={errors.priority?.message}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showActions && (
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            {initialData ? 'Update Policy' : 'Create Policy'}
          </Button>
        </div>
      )}
    </form>
  );
});

export default PolicyForm;
