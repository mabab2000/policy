import { UserRole, PolicyStatus, PolicyPriority } from '@/types';

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
};

/**
 * Role Display Names
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin (Central Government)',
  [UserRole.MINISTRY_OFFICER]: 'Ministry Officer',
  [UserRole.DISTRICT_OFFICER]: 'District Officer',
  [UserRole.SECTOR_OFFICER]: 'Sector/Cell Officer',
  [UserRole.CITIZEN]: 'Citizen',
  [UserRole.AUDITOR]: 'Auditor / M&E Officer',
};

/**
 * Policy Status Labels and Colors
 */
export const POLICY_STATUS_CONFIG: Record<
  PolicyStatus,
  { label: string; color: string; bgColor: string }
> = {
  [PolicyStatus.DRAFT]: {
    label: 'Draft',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
  [PolicyStatus.UNDER_REVIEW]: {
    label: 'Under Review',
    color: 'text-primary-700',
    bgColor: 'bg-primary-100',
  },
  [PolicyStatus.STAKEHOLDER_CONSULTATION]: {
    label: 'Stakeholder Consultation',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [PolicyStatus.CABINET_REVIEW]: {
    label: 'Cabinet Review',
    color: 'text-primary-700',
    bgColor: 'bg-primary-100',
  },
  [PolicyStatus.LEGAL_REVIEW]: {
    label: 'Legal Review',
    color: 'text-warning-700',
    bgColor: 'bg-warning-100',
  },
  [PolicyStatus.APPROVED]: {
    label: 'Approved',
    color: 'text-success-700',
    bgColor: 'bg-success-100',
  },
  [PolicyStatus.IN_IMPLEMENTATION]: {
    label: 'In Implementation',
    color: 'text-primary-700',
    bgColor: 'bg-primary-100',
  },
  [PolicyStatus.MONITORING]: {
    label: 'Monitoring',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  [PolicyStatus.EVALUATION]: {
    label: 'Evaluation',
    color: 'text-warning-700',
    bgColor: 'bg-warning-100',
  },
  [PolicyStatus.COMPLETED]: {
    label: 'Completed',
    color: 'text-success-700',
    bgColor: 'bg-success-100',
  },
  [PolicyStatus.REJECTED]: {
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};

/**
 * Policy Priority Configuration
 */
export const POLICY_PRIORITY_CONFIG: Record<
  PolicyPriority,
  { label: string; color: string }
> = {
  [PolicyPriority.CRITICAL]: { label: 'Critical', color: 'text-red-600' },
  [PolicyPriority.HIGH]: { label: 'High', color: 'text-warning-600' },
  [PolicyPriority.MEDIUM]: { label: 'Medium', color: 'text-primary-600' },
  [PolicyPriority.LOW]: { label: 'Low', color: 'text-success-600' },
};

/**
 * Rwanda Districts
 */
export const RWANDA_DISTRICTS = [
  'Kigali',
  'Gasabo',
  'Kicukiro',
  'Nyarugenge',
  'Bugesera',
  'Gatsibo',
  'Kayonza',
  'Kirehe',
  'Ngoma',
  'Nyagatare',
  'Rwamagana',
  'Burera',
  'Gakenke',
  'Gicumbi',
  'Musanze',
  'Rulindo',
  'Gisagara',
  'Huye',
  'Kamonyi',
  'Muhanga',
  'Nyamagabe',
  'Nyanza',
  'Nyaruguru',
  'Ruhango',
  'Karongi',
  'Ngororero',
  'Nyabihu',
  'Nyamasheke',
  'Rubavu',
  'Rusizi',
  'Rutsiro',
];

/**
 * Rwanda Ministries
 */
export const RWANDA_MINISTRIES = [
  'Office of the President',
  'Office of the Prime Minister',
  'Ministry of Finance and Economic Planning',
  'Ministry of Foreign Affairs and International Cooperation',
  'Ministry of Local Government',
  'Ministry of Education',
  'Ministry of Health',
  'Ministry of Infrastructure',
  'Ministry of Agriculture and Animal Resources',
  'Ministry of Trade and Industry',
  'Ministry of Justice',
  'Ministry of Defence',
  'Ministry of Internal Security',
  'Ministry of ICT and Innovation',
  'Ministry of Youth and Culture',
  'Ministry of Gender and Family Promotion',
  'Ministry of Public Service and Labour',
  'Ministry of Environment',
  'Ministry of Sports',
  'Ministry of National Unity and Civic Engagement',
];

/**
 * Navigation Routes by Role
 */
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    '/dashboard',
    '/policies',
    '/implementation',
    '/imihigo',
    '/monitoring',
    '/reports',
    '/users',
  ],
  [UserRole.MINISTRY_OFFICER]: [
    '/dashboard',
    '/policies',
    '/implementation',
    '/imihigo',
    '/monitoring',
    '/stakeholders',
  ],
  [UserRole.DISTRICT_OFFICER]: [
    '/dashboard',
    '/policies',
    '/execution',
    '/imihigo',
    '/monitoring',
    '/citizen-feedback',
  ],
  [UserRole.SECTOR_OFFICER]: [
    '/dashboard',
    '/execution',
    '/progress-reports',
    '/citizen-feedback',
  ],
  [UserRole.CITIZEN]: [
    '/dashboard',
    '/policies',
    '/feedback',
    '/my-feedback',
  ],
  [UserRole.AUDITOR]: [
    '/dashboard',
    '/policies',
    '/monitoring',
    '/evaluation',
    '/reports',
  ],
};

/**
 * Chart Colors (Blue, Green, Yellow theme)
 */
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#eab308',
  secondary: '#60a5fa',
  accent: '#facc15',
  info: '#14b8a6',
};
