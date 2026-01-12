import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { MessageSquare, ThumbsUp, MessageCircle, Plus } from 'lucide-react';
import { mockCitizenFeedback } from '@/services/mockData';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

export default function CitizenFeedbackPage() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const isCitizen = user?.role === UserRole.CITIZEN;

  const statusColors = {
    SUBMITTED: 'primary',
    UNDER_REVIEW: 'warning',
    RESPONDED: 'success',
    RESOLVED: 'success',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Citizen Feedback</h1>
            <p className="text-gray-600 mt-1">
              {isCitizen ? 'Share your feedback on policies' : 'Manage citizen feedback and responses'}
            </p>
          </div>
          {isCitizen && (
            <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Submit Feedback
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-primary-50 rounded-lg mb-3">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mockCitizenFeedback.length}</p>
              <p className="text-sm text-gray-600">Total Feedback</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-success-50 rounded-lg mb-3">
                <ThumbsUp className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockCitizenFeedback.filter(f => f.type === 'APPRECIATION').length}
              </p>
              <p className="text-sm text-gray-600">Appreciation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-warning-50 rounded-lg mb-3">
                <MessageCircle className="h-6 w-6 text-warning-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockCitizenFeedback.filter(f => f.type === 'SUGGESTION').length}
              </p>
              <p className="text-sm text-gray-600">Suggestions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="inline-flex p-3 bg-blue-50 rounded-lg mb-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockCitizenFeedback.filter(f => f.status === 'RESPONDED').length}
              </p>
              <p className="text-sm text-gray-600">Responded</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCitizenFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 border-2 border-primary-100 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{feedback.subject}</h4>
                        <Badge variant={statusColors[feedback.status] as any}>
                          {feedback.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(feedback.createdAt)}</p>
                    </div>
                    <Badge variant="primary">{feedback.type}</Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{feedback.message}</p>
                  {feedback.response && (
                    <div className="mt-3 p-3 bg-success-50 border-2 border-success-200 rounded-lg">
                      <p className="text-sm font-medium text-success-900 mb-1">Response:</p>
                      <p className="text-sm text-success-800">{feedback.response}</p>
                      {feedback.respondedAt && (
                        <p className="text-xs text-success-600 mt-1">
                          Responded on {formatDate(feedback.respondedAt)}
                        </p>
                      )}
                    </div>
                  )}
                  {!feedback.response && !isCitizen && (
                    <Button variant="primary" size="sm">Respond</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Feedback"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary">Submit Feedback</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Feedback Type"
            options={[
              { value: 'FEEDBACK', label: 'General Feedback' },
              { value: 'SUGGESTION', label: 'Suggestion' },
              { value: 'COMPLAINT', label: 'Complaint' },
              { value: 'APPRECIATION', label: 'Appreciation' },
            ]}
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            required
          />
          <Input label="Subject" placeholder="Brief description of your feedback" required />
          <Textarea label="Message" placeholder="Provide detailed feedback..." rows={5} required />
        </div>
      </Modal>
    </Layout>
  );
}
