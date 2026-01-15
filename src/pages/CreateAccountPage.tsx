import { useState } from 'react';
import axios from 'axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

type ToastType = 'success' | 'error' | null;

export default function CreateAccountPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToast = (msg: string, type: ToastType = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastType(null);
      setToastMessage('');
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset inline errors
    setConfirmError('');
    setPhoneError('');

    // validate phone: exactly 10 digits
    const phoneTrimmed = phone.replace(/\D/g, '');
    if (!/^\d{10}$/.test(phoneTrimmed)) {
      setPhoneError('Phone must be exactly 10 digits');
      return;
    }

    // validate passwords match
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        full_name: fullName,
        email,
        phone: phone.replace(/\D/g, ''),
        password,
      };

      const res = await axios.post('https://policy-users-go.onrender.com/api/users', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 201) {
        showToast('Account created successfully', 'success');
        // clear form
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setConfirmError('');
        setPhoneError('');
      } else {
        showToast('Unexpected response from server', 'error');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create account';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create New Account</h1>
          <p className="text-sm text-gray-600 mt-1">Register a new user account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border-2 border-primary-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(digits);
                // show error while typing if not exact 10 digits
                if (digits.length > 0 && digits.length !== 10) {
                  setPhoneError('Phone must be exactly 10 digits');
                } else {
                  setPhoneError('');
                }
              }}
              error={phoneError}
            />

            <div className="md:col-span-2">
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Choose a strong password"
                className="pr-14"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center text-primary-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError('');
                }}
                error={confirmError}
                className="pr-14"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center text-primary-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>Create Account</Button>
          </div>
        </form>

        {toastType && (
          <div className={`fixed right-4 bottom-4 w-80 p-4 rounded-lg shadow-lg border-2 ${toastType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
