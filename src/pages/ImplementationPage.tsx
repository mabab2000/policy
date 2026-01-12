import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  CheckCircle, 
  Briefcase, 
  Target, 
  Calendar,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  Filter,
  Plus,
  FileText,
  ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Program {
  id: string;
  name: string;
  description: string;
  policy: string;
  status: 'planning' | 'active' | 'completed' | 'delayed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  lead: string;
  projectsCount: number;
  progress: number;
}

interface Project {
  id: string;
  name: string;
  program: string;
  status: 'planning' | 'active' | 'completed' | 'delayed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  lead: string;
  activitiesCount: number;
  progress: number;
}

interface Activity {
  id: string;
  name: string;
  project: string;
  status: 'pending' | 'active' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  startDate: string;
  dueDate: string;
  progress: number;
}

export default function ImplementationPage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'projects' | 'activities' | 'timeline'>('programs');

  const programs: Program[] = [
    {
      id: '1',
      name: 'Digital Rwanda Initiative',
      description: 'Comprehensive digital transformation program',
      policy: 'ICT Development Policy 2024',
      status: 'active',
      budget: 50000000,
      spent: 18500000,
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      lead: 'Ministry of ICT',
      projectsCount: 12,
      progress: 37
    },
    {
      id: '2',
      name: 'Healthcare Access Improvement',
      description: 'Expanding healthcare services to rural areas',
      policy: 'National Health Policy 2024',
      status: 'active',
      budget: 75000000,
      spent: 42300000,
      startDate: '2024-07-01',
      endDate: '2026-06-30',
      lead: 'Ministry of Health',
      projectsCount: 18,
      progress: 56
    },
    {
      id: '3',
      name: 'Education Quality Enhancement',
      description: 'Improving education standards and infrastructure',
      policy: 'Education Sector Policy 2024',
      status: 'planning',
      budget: 120000000,
      spent: 5200000,
      startDate: '2025-03-01',
      endDate: '2028-02-29',
      lead: 'Ministry of Education',
      projectsCount: 25,
      progress: 4
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'National Broadband Infrastructure',
      program: 'Digital Rwanda Initiative',
      status: 'active',
      budget: 15000000,
      spent: 8200000,
      startDate: '2025-01-15',
      endDate: '2026-08-15',
      lead: 'Rwanda ICT Chamber',
      activitiesCount: 45,
      progress: 55
    },
    {
      id: '2',
      name: 'Community Health Centers',
      program: 'Healthcare Access Improvement',
      status: 'active',
      budget: 25000000,
      spent: 18500000,
      startDate: '2024-09-01',
      endDate: '2025-12-01',
      lead: 'Partners in Health',
      activitiesCount: 32,
      progress: 74
    },
    {
      id: '3',
      name: 'Digital Learning Platform',
      program: 'Education Quality Enhancement',
      status: 'planning',
      budget: 8500000,
      spent: 850000,
      startDate: '2025-04-01',
      endDate: '2026-03-31',
      lead: 'Rwanda Education Board',
      activitiesCount: 28,
      progress: 10
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      name: 'Fiber optic cable installation - Kigali',
      project: 'National Broadband Infrastructure',
      status: 'active',
      priority: 'high',
      assignee: 'John Mukama',
      startDate: '2025-01-20',
      dueDate: '2025-03-15',
      progress: 65
    },
    {
      id: '2',
      name: 'Staff training for new health centers',
      project: 'Community Health Centers',
      status: 'completed',
      priority: 'critical',
      assignee: 'Dr. Sarah Uwimana',
      startDate: '2024-10-01',
      dueDate: '2024-11-30',
      progress: 100
    },
    {
      id: '3',
      name: 'Curriculum development for digital platform',
      project: 'Digital Learning Platform',
      status: 'pending',
      priority: 'medium',
      assignee: 'Prof. David Nkusi',
      startDate: '2025-04-15',
      dueDate: '2025-07-15',
      progress: 0
    },
    {
      id: '4',
      name: 'Equipment procurement for health centers',
      project: 'Community Health Centers',
      status: 'blocked',
      priority: 'high',
      assignee: 'Marie Uwase',
      startDate: '2024-11-01',
      dueDate: '2025-01-31',
      progress: 25
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'completed':
        return <Badge variant="primary">Completed</Badge>;
      case 'planning':
        return <Badge variant="warning">Planning</Badge>;
      case 'delayed':
        return <Badge variant="danger">Delayed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'blocked':
        return <Badge variant="danger">Blocked</Badge>;
      default:
        return <Badge variant="primary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="danger">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="primary">Medium</Badge>;
      case 'low':
        return <Badge variant="success">Low</Badge>;
      default:
        return <Badge variant="primary">{priority}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Implementation Planning</h1>
            <p className="text-gray-600 mt-1">Convert policies into programs, projects, and activities</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Program
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Programs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                  <p className="text-xs text-success-600 mt-1">+2 this month</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">55</p>
                  <p className="text-xs text-warning-600 mt-1">3 delayed</p>
                </div>
                <Briefcase className="h-8 w-8 text-success-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">RWF 245M</p>
                  <p className="text-xs text-gray-600 mt-1">66M spent</p>
                </div>
                <DollarSign className="h-8 w-8 text-warning-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">45%</p>
                  <p className="text-xs text-success-600 mt-1">On track</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200">
          <nav className="flex gap-8">
            {(['programs', 'projects', 'activities', 'timeline'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'programs' && (
          <Card>
            <CardHeader>
              <CardTitle>Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table<Program>
                data={programs}
                columns={[
                  {
                    header: 'Program Name',
                    accessor: (row: Program) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <p className="text-sm text-gray-500">{row.description}</p>
                        <p className="text-xs text-gray-400">{row.policy}</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Status',
                    accessor: (row: Program) => getStatusBadge(row.status),
                  },
                  {
                    header: 'Budget',
                    accessor: (row: Program) => (
                      <div>
                        <div className="font-medium">{formatCurrency(row.budget)}</div>
                        <p className="text-sm text-gray-500">
                          Spent: {formatCurrency(row.spent)} ({Math.round((row.spent / row.budget) * 100)}%)
                        </p>
                      </div>
                    ),
                  },
                  {
                    header: 'Timeline',
                    accessor: (row: Program) => (
                      <div className="text-sm">
                        <div>{formatDate(row.startDate)} - {formatDate(row.endDate)}</div>
                      </div>
                    ),
                  },
                  {
                    header: 'Lead',
                    accessor: (row: Program) => (
                      <div>
                        <div className="font-medium text-sm">{row.lead}</div>
                        <p className="text-xs text-gray-500">{row.projectsCount} projects</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Progress',
                    accessor: (row: Program) => (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{row.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${row.progress}%` }}
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
                onRowClick={(row) => console.log('View program:', row.id)}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'projects' && (
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table<Project>
                data={projects}
                columns={[
                  {
                    header: 'Project Name',
                    accessor: (row: Project) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <p className="text-sm text-gray-500">{row.program}</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Status',
                    accessor: (row: Project) => getStatusBadge(row.status),
                  },
                  {
                    header: 'Budget',
                    accessor: (row: Project) => (
                      <div>
                        <div className="font-medium">{formatCurrency(row.budget)}</div>
                        <p className="text-sm text-gray-500">
                          Spent: {formatCurrency(row.spent)} ({Math.round((row.spent / row.budget) * 100)}%)
                        </p>
                      </div>
                    ),
                  },
                  {
                    header: 'Timeline',
                    accessor: (row: Project) => (
                      <div className="text-sm">
                        <div>{formatDate(row.startDate)} - {formatDate(row.endDate)}</div>
                      </div>
                    ),
                  },
                  {
                    header: 'Lead',
                    accessor: (row: Project) => (
                      <div>
                        <div className="font-medium text-sm">{row.lead}</div>
                        <p className="text-xs text-gray-500">{row.activitiesCount} activities</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Progress',
                    accessor: (row: Project) => (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{row.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-success-600 h-2 rounded-full"
                            style={{ width: `${row.progress}%` }}
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
                onRowClick={(row) => console.log('View project:', row.id)}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'activities' && (
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table<Activity>
                data={activities}
                columns={[
                  {
                    header: 'Activity',
                    accessor: (row: Activity) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <p className="text-sm text-gray-500">{row.project}</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Status',
                    accessor: (row: Activity) => getStatusBadge(row.status),
                  },
                  {
                    header: 'Priority',
                    accessor: (row: Activity) => getPriorityBadge(row.priority),
                  },
                  {
                    header: 'Assignee',
                    accessor: 'assignee' as keyof Activity,
                  },
                  {
                    header: 'Due Date',
                    accessor: (row: Activity) => formatDate(row.dueDate),
                  },
                  {
                    header: 'Progress',
                    accessor: (row: Activity) => (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{row.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              row.status === 'completed' ? 'bg-success-600' : 
                              row.status === 'blocked' ? 'bg-red-600' : 'bg-warning-600'
                            }`}
                            style={{ width: `${row.progress}%` }}
                          />
                        </div>
                      </div>
                    ),
                  },
                ]}
                onRowClick={(row) => console.log('View activity:', row.id)}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Implementation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {programs.map((program, index) => (
                    <div key={program.id} className="relative">
                      {index !== programs.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300"></div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          program.status === 'active' ? 'bg-primary-600' :
                          program.status === 'completed' ? 'bg-success-600' :
                          program.status === 'delayed' ? 'bg-red-600' : 'bg-gray-400'
                        }`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{program.name}</h4>
                              <p className="text-sm text-gray-500">{program.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(program.startDate)} - {formatDate(program.endDate)}
                              </p>
                              <p className="text-sm text-gray-500">{program.projectsCount} projects</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            {getStatusBadge(program.status)}
                            <span className="text-sm text-gray-500">{program.lead}</span>
                            <div className="flex-1 max-w-xs">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${program.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{program.progress}% complete</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning-600" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.filter(a => a.status !== 'completed').slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{activity.name}</p>
                          <p className="text-xs text-gray-500">{activity.assignee}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDate(activity.dueDate)}</p>
                          {getPriorityBadge(activity.priority)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-600" />
                    Team Workload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['John Mukama', 'Dr. Sarah Uwimana', 'Prof. David Nkusi', 'Marie Uwase'].map((person) => (
                      <div key={person} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{person}</p>
                          <p className="text-xs text-gray-500">
                            {Math.floor(Math.random() * 5) + 1} active tasks
                          </p>
                        </div>
                        <div className="w-24">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
