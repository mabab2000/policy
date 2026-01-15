import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      const projectIds = await login(data.email, data.password);
      if (projectIds && projectIds.length > 0) {
        navigate('/dashboard');
      } else {
        // If user has no projects, direct them to create-project page
        navigate('/projects/create');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/logo.png" 
              alt="Policy 360 Logo" 
              className="h-32 w-auto"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Policy Ideation to Implementation</h3>
                <p className="text-sm text-gray-600">
                  Complete lifecycle management from drafting to evaluation
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-success-100 flex items-center justify-center flex-shrink-0">
                <span className="text-success-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">KPI management</h3>
                <p className="text-sm text-gray-600">
                  Performance contracts aligned with national goals
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                <span className="text-warning-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Citizen Engagement</h3>
                <p className="text-sm text-gray-600">
                  Direct feedback and participation in policy development
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Sign In to Your Account</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="your.email@gov.rw"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={errors.password?.message}
                  placeholder="Enter your password"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  size="lg"
                  isLoading={isSubmitting}
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Don't have an account? <Link to="/create-account" className="text-primary-600 font-medium hover:underline">Create one</Link></p>
            <p className="mt-2 text-sm text-gray-600">Powered by Rwanda Artificial intelli (AI)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
