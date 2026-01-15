import { 
  Policy, 
  PolicyStatus, 
  PolicyPriority,
  DashboardStats,
  Stakeholder,
  ConsultationFeedback,
  Program,
  Imihigo,
  KPI,
  ProgressReport,
  CitizenFeedback,
} from '@/types';

/**
 * Mock Policies Data
 */
export const mockPolicies: Policy[] = [
  {
    id: '1',
    title: 'Digital Rwanda 2030 Strategy',
    code: 'POL-2024-001',
    description: 'Comprehensive strategy to transform Rwanda into a digital economy',
    objectives: [
      'Achieve 100% digital literacy by 2030',
      'Increase ICT contribution to GDP to 15%',
      'Create 50,000 ICT jobs',
    ],
    problemStatement: 'Limited digital infrastructure and low digital adoption rates',
    targetPopulation: 'All Rwandan citizens and businesses',
    status: PolicyStatus.IN_IMPLEMENTATION,
    priority: PolicyPriority.CRITICAL,
    version: 2,
    alignmentVision2050: 'Pillar 3: Transformation for Prosperity',
    alignmentNST: 'Priority Area: ICT and Digital Economy',
    ministry: 'Ministry of ICT and Innovation',
    responsibleOfficer: 'Marie Uwase',
    budget: 50000000000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2030-12-31'),
    createdBy: '1',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Universal Health Coverage Enhancement',
    code: 'POL-2024-002',
    description: 'Strengthening healthcare access and quality across all districts',
    objectives: [
      'Achieve 95% health insurance coverage',
      'Reduce maternal mortality by 30%',
      'Establish health centers in all sectors',
    ],
    problemStatement: 'Gaps in healthcare access in rural areas',
    targetPopulation: 'All Rwandan citizens',
    status: PolicyStatus.MONITORING,
    priority: PolicyPriority.HIGH,
    version: 1,
    alignmentVision2050: 'Pillar 1: Human Development',
    alignmentNST: 'Priority Area: Health and Wellbeing',
    ministry: 'Ministry of Health',
    responsibleOfficer: 'Dr. Paul Habimana',
    budget: 75000000000,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2027-12-31'),
    createdBy: '2',
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    title: 'Green Agriculture Modernization',
    code: 'POL-2024-003',
    description: 'Sustainable agriculture practices and value chain development',
    objectives: [
      'Increase agricultural productivity by 50%',
      'Reduce post-harvest losses to 10%',
      'Create 100,000 agribusiness jobs',
    ],
    problemStatement: 'Low productivity and climate change impacts',
    targetPopulation: 'Farmers and agricultural cooperatives',
    status: PolicyStatus.STAKEHOLDER_CONSULTATION,
    priority: PolicyPriority.HIGH,
    version: 1,
    alignmentVision2050: 'Pillar 3: Transformation for Prosperity',
    alignmentNST: 'Priority Area: Agriculture and Food Security',
    ministry: 'Ministry of Agriculture and Animal Resources',
    responsibleOfficer: 'John Mukiza',
    budget: 40000000000,
    createdBy: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
];

/**
 * Mock Dashboard Statistics
 */
export const mockDashboardStats: DashboardStats = {
  totalPolicies: 45,
  activePolicies: 28,
  completedPolicies: 12,
  policiesInDraft: 5,
  averageCompletionRate: 72,
  citizenFeedbackCount: 1243,
  performanceScore: 85,
};

/**
 * Mock Stakeholders
 */
export const mockStakeholders: Stakeholder[] = [
  {
    id: '1',
    name: 'Rwanda ICT Chamber',
    type: 'PRIVATE',
    contactPerson: 'Alex Ntare',
    email: 'alex@ictchamber.rw',
    phone: '+250788123456',
  },
  {
    id: '2',
    name: 'World Bank Rwanda',
    type: 'INTERNATIONAL',
    contactPerson: 'Sarah Johnson',
    email: 'sjohnson@worldbank.org',
    phone: '+250788234567',
  },
];

/**
 * Mock Consultation Feedback
 */
export const mockConsultationFeedback: ConsultationFeedback[] = [
  {
    id: '1',
    policyId: '3',
    stakeholderId: '1',
    feedback: 'We support this initiative but recommend more focus on digital literacy for farmers',
    category: 'SUGGESTION',
    status: 'REVIEWED',
    createdAt: new Date('2024-01-15'),
  },
];

/**
 * Mock Programs
 */
export const mockPrograms: Program[] = [
  {
    id: '1',
    policyId: '1',
    name: 'Digital Infrastructure Development',
    description: 'Nationwide broadband and 4G deployment',
    budget: 20000000000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2026-12-31'),
    responsibleInstitution: 'Ministry of ICT and Innovation',
  },
];

/**
 * Mock Imihigo
 */
export const mockImihigo: Imihigo[] = [
  {
    id: '1',
    type: 'NATIONAL',
    name: 'National Imihigo 2024-2025',
    fiscalYear: '2024-2025',
    entity: 'Government of Rwanda',
    kpis: [],
    createdAt: new Date('2024-01-01'),
  },
];

/**
 * Mock KPIs
 */
export const mockKPIs: KPI[] = [
  {
    id: '1',
    imihigoId: '1',
    name: 'Broadband Coverage',
    description: 'Number of broadband connections',
    baseline: 600,
    target: 8000,
    current: 1800,
    unit: 'connections',
    weight: 20,
    policyId: '1',
  },
  {
    id: '2',
    imihigoId: '1',
    name: 'Health Insurance Coverage',
    description: 'Number of people covered by health insurance',
    baseline: 1200,
    target: 6000,
    current: 2500,
    unit: 'people',
    weight: 15,
    policyId: '2',
  },
  {
    id: '3',
    imihigoId: '1',
    name: 'Roads Paved (km)',
    description: 'Kilometers of strategic roads paved',
    baseline: 600,
    target: 3500,
    current: 1400,
    unit: 'km',
    weight: 18,
    policyId: '1',
  },
  {
    id: '4',
    imihigoId: '1',
    name: 'Youth Employment Rate',
    description: 'Number of youth employed in formal sector',
    baseline: 1200,
    target: 10000,
    current: 4000,
    unit: 'jobs',
    weight: 17,
    policyId: '1',
  },
];

/**
 * Mock Progress Reports
 */
export const mockProgressReports: ProgressReport[] = [
  {
    id: '1',
    activityId: '1',
    reportDate: new Date('2024-01-15'),
    progress: 65,
    achievements: 'Completed fiber optic installation in 5 districts',
    challenges: 'Delays in obtaining right-of-way permits',
    nextSteps: 'Accelerate permits process and begin installation in remaining districts',
    evidenceUrls: [],
    reportedBy: '3',
    status: 'approved',
  },
  {
    id: '2',
    activityId: '2',
    reportDate: new Date('2024-02-02'),
    progress: 30,
    achievements: 'Staff training scheduled and materials prepared',
    challenges: 'Limited trainer availability',
    nextSteps: 'Confirm trainers and start sessions',
    evidenceUrls: [],
    reportedBy: '2',
    status: 'potential',
  },
  {
    id: '3',
    activityId: '4',
    reportDate: new Date('2024-03-10'),
    progress: 12,
    achievements: 'Procurement initiated',
    challenges: 'Budget constraints',
    nextSteps: 'Request supplemental funds',
    evidenceUrls: [],
    reportedBy: '4',
    status: 'rejected',
  },
];

/**
 * Mock Citizen Feedback
 */
export const mockCitizenFeedback: CitizenFeedback[] = [
  {
    id: '1',
    policyId: '1',
    citizenId: '5',
    type: 'SUGGESTION',
    subject: 'Digital Literacy Training',
    message: 'Please provide more training sessions in rural areas',
    status: 'UNDER_REVIEW',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    policyId: '2',
    citizenId: '5',
    type: 'APPRECIATION',
    subject: 'Improved Healthcare Access',
    message: 'Thank you for the new health center in our sector',
    status: 'RESPONDED',
    response: 'Thank you for your feedback. We are committed to improving healthcare access.',
    respondedBy: '3',
    respondedAt: new Date('2024-01-22'),
    createdAt: new Date('2024-01-21'),
  },
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API functions
 */
export const mockApi = {
  policies: {
    getAll: async () => {
      await delay(500);
      return mockPolicies;
    },
    getById: async (id: string) => {
      await delay(300);
      return mockPolicies.find(p => p.id === id);
    },
    create: async (data: Partial<Policy>) => {
      await delay(500);
      const newPolicy: Policy = {
        ...data,
        id: String(mockPolicies.length + 1),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Policy;
      mockPolicies.push(newPolicy);
      return newPolicy;
    },
    update: async (id: string, data: Partial<Policy>) => {
      await delay(500);
      const index = mockPolicies.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPolicies[index] = { ...mockPolicies[index], ...data, updatedAt: new Date() };
        return mockPolicies[index];
      }
      throw new Error('Policy not found');
    },
  },
  dashboard: {
    getStats: async () => {
      await delay(500);
      return mockDashboardStats;
    },
  },
  stakeholders: {
    getAll: async () => {
      await delay(300);
      return mockStakeholders;
    },
  },
  citizenFeedback: {
    getAll: async () => {
      await delay(300);
      return mockCitizenFeedback;
    },
    create: async (data: Partial<CitizenFeedback>) => {
      await delay(500);
      const newFeedback: CitizenFeedback = {
        ...data,
        id: String(mockCitizenFeedback.length + 1),
        status: 'SUBMITTED',
        createdAt: new Date(),
      } as CitizenFeedback;
      mockCitizenFeedback.push(newFeedback);
      return newFeedback;
    },
  },
};
