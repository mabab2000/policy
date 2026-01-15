import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { mockKPIs } from '@/services/mockData';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'user' | 'project' | 'kpis' | 'targets'>('user');

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [projectInfo, setProjectInfo] = useState({
    organization: '',
    project_name: '',
    description: '',
  });

  const [kpis, setKpis] = useState(() => mockKPIs);

  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  const [kpiForm, setKpiForm] = useState({ name: '', description: '', baseline: '', current: '', unit: '', target: '', weight: '' });
  const [targetForm, setTargetForm] = useState({ kpiId: '', target: '' });

  const openAddKpi = () => { setKpiForm({ name: '', description: '', baseline: '', current: '', unit: '', target: '', weight: '' }); setIsKpiModalOpen(true); };
  const closeAddKpi = () => setIsKpiModalOpen(false);
  const openAddTarget = () => { setTargetForm({ kpiId: kpis[0]?.id || '', target: '' }); setIsTargetModalOpen(true); };
  const closeAddTarget = () => setIsTargetModalOpen(false);

  const handleSaveKpi = () => {
    const newKpi = {
      id: String(Date.now()),
      imihigoId: '1',
      name: kpiForm.name,
      description: kpiForm.description,
      baseline: Number(kpiForm.baseline) || 0,
      target: Number(kpiForm.target) || 0,
      current: Number(kpiForm.current) || 0,
      unit: kpiForm.unit,
      weight: Number(kpiForm.weight) || 0,
      policyId: undefined,
    } as any;
    setKpis((s) => [newKpi, ...s]);
    setIsKpiModalOpen(false);
  };

  const handleSaveTarget = () => {
    setKpis((s) => s.map(k => k.id === targetForm.kpiId ? { ...k, target: Number(targetForm.target) || k.target } : k));
    setIsTargetModalOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account, project info and KPI targets</p>
        </div>

        <div className="border-b-2 border-gray-200">
          <nav className="flex gap-8" role="tablist" aria-label="Settings Tabs">
            {(['user', 'project', 'kpis', 'targets'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab === 'user' ? 'User Information' : tab === 'project' ? 'Project Information' : tab === 'kpis' ? 'KPIs' : 'Targets'}
              </button>
            ))}
          </nav>
        </div>

        {/* Modals */}
        <Modal title="Add KPI" isOpen={isKpiModalOpen} onClose={closeAddKpi} footer={(
          <>
            <Button variant="outline" onClick={closeAddKpi}>Cancel</Button>
            <Button onClick={handleSaveKpi}>Save KPI</Button>
          </>
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={kpiForm.name} onChange={(e) => setKpiForm({ ...kpiForm, name: e.target.value })} />
            <Input label="Unit" value={kpiForm.unit} onChange={(e) => setKpiForm({ ...kpiForm, unit: e.target.value })} />
            <Input label="Baseline" value={kpiForm.baseline} onChange={(e) => setKpiForm({ ...kpiForm, baseline: e.target.value })} />
            <Input label="Current" value={kpiForm.current} onChange={(e) => setKpiForm({ ...kpiForm, current: e.target.value })} />
            <Input label="Target" value={kpiForm.target} onChange={(e) => setKpiForm({ ...kpiForm, target: e.target.value })} />
            <Input label="Weight" value={kpiForm.weight} onChange={(e) => setKpiForm({ ...kpiForm, weight: e.target.value })} />
            <Textarea label="Description" value={kpiForm.description} onChange={(e) => setKpiForm({ ...kpiForm, description: e.target.value })} />
          </div>
        </Modal>

        <Modal title="Add / Update Target" isOpen={isTargetModalOpen} onClose={closeAddTarget} footer={(
          <>
            <Button variant="outline" onClick={closeAddTarget}>Cancel</Button>
            <Button onClick={handleSaveTarget}>Save Target</Button>
          </>
        )}>
          <div className="grid grid-cols-1 gap-4">
            <Select
              label="KPI"
              options={kpis.map(k => ({ value: k.id, label: k.name }))}
              value={targetForm.kpiId}
              onChange={(e) => setTargetForm({ ...targetForm, kpiId: e.target.value })}
            />
            <Input label="Target" value={targetForm.target} onChange={(e) => setTargetForm({ ...targetForm, target: e.target.value })} />
          </div>
        </Modal>

        {activeTab === 'user' && (
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
                <Input
                  label="Email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <Button onClick={() => alert('Saved user info')}>Save</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'project' && (
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Organization"
                  value={projectInfo.organization}
                  onChange={(e) => setProjectInfo({ ...projectInfo, organization: e.target.value })}
                />
                <Input
                  label="Project Name"
                  value={projectInfo.project_name}
                  onChange={(e) => setProjectInfo({ ...projectInfo, project_name: e.target.value })}
                />
                <Textarea
                  label="Description"
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <Button onClick={() => alert('Saved project info')}>Save</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'kpis' && (
          <Card>
            <CardHeader>
              <CardTitle>KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="p-3 border-2 border-primary-100 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{kpi.name}</p>
                      <p className="text-sm text-gray-500">Baseline: {kpi.baseline} • Current: {kpi.current}</p>
                    </div>
                    <div className="text-sm text-gray-700">Unit: {kpi.unit || 'n/a'}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'targets' && (
          <Card>
            <CardHeader>
              <CardTitle>Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="p-3 border-2 border-primary-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{kpi.name}</p>
                        <p className="text-sm text-gray-500">Baseline: {kpi.baseline}</p>
                      </div>
                      <div className="w-48">
                        <label className="text-xs text-gray-500">Target</label>
                        <Input value={String(kpi.target)} onChange={() => {}} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={() => alert('KPIs saved')}>Save KPI Targets</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
