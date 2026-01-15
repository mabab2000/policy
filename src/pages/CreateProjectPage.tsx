import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

type ToastType = 'success' | 'error' | null;

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [projectName, setProjectName] = useState('');
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [scorp, setScorp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>(null);

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

    if (!user) {
      showToast('You must be logged in to create a project', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        project_name: projectName,
        organization,
        description,
        scorp,
        user_id: user.id,
      };

      const res = await axios.post('https://policy-users-go.onrender.com/api/projects', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 201 && res.data?.project?.id) {
        // update local project_ids
        try {
          const raw = localStorage.getItem('project_ids');
          const existing: string[] = raw ? JSON.parse(raw) : [];
          existing.push(res.data.project.id);
          localStorage.setItem('project_ids', JSON.stringify(existing));
        } catch (e) {
          // ignore
        }

        showToast('Project created successfully', 'success');
        navigate('/dashboard');
      } else {
        showToast('Failed to create project', 'error');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create project';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Project</h1>
          <p className="text-sm text-gray-600 mt-1">Create your first project to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border-2 border-primary-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Project name" required value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            <Input label="Organization" required value={organization} onChange={(e) => setOrganization(e.target.value)} />
            <div className="md:col-span-2">
              <Textarea label="Description" required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Textarea label="Scorp" value={scorp} onChange={(e) => setScorp(e.target.value)} helperText="Scope / objectives" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting}>Create Project</Button>
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
