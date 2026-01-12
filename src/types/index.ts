/**
 * User Roles in the Rwanda Policy Management System
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MINISTRY_OFFICER = 'MINISTRY_OFFICER',
  DISTRICT_OFFICER = 'DISTRICT_OFFICER',
  SECTOR_OFFICER = 'SECTOR_OFFICER',
  CITIZEN = 'CITIZEN',
  AUDITOR = 'AUDITOR',
}

/**
 * User Entity
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  district?: string;
  sector?: string;
  avatar?: string;
  createdAt: Date;
}

/**
 * Authentication State
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

/**
 * Policy Status throughout lifecycle
 */
export enum PolicyStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  STAKEHOLDER_CONSULTATION = 'STAKEHOLDER_CONSULTATION',
  CABINET_REVIEW = 'CABINET_REVIEW',
  LEGAL_REVIEW = 'LEGAL_REVIEW',
  APPROVED = 'APPROVED',
  IN_IMPLEMENTATION = 'IN_IMPLEMENTATION',
  MONITORING = 'MONITORING',
  EVALUATION = 'EVALUATION',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

/**
 * Policy Priority Levels
 */
export enum PolicyPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Policy Entity
 */
export interface Policy {
  id: string;
  title: string;
  code: string;
  description: string;
  objectives: string[];
  problemStatement: string;
  targetPopulation: string;
  status: PolicyStatus;
  priority: PolicyPriority;
  version: number;
  alignmentVision2050: string;
  alignmentNST: string;
  ministry: string;
  responsibleOfficer: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Stakeholder Consultation
 */
export interface Stakeholder {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'CSO' | 'INTERNATIONAL';
  contactPerson: string;
  email: string;
  phone: string;
}

export interface ConsultationFeedback {
  id: string;
  policyId: string;
  stakeholderId: string;
  feedback: string;
  category: 'SUPPORT' | 'CONCERN' | 'SUGGESTION' | 'OBJECTION';
  status: 'PENDING' | 'REVIEWED' | 'ADDRESSED';
  createdAt: Date;
}

/**
 * Implementation Planning
 */
export interface Program {
  id: string;
  policyId: string;
  name: string;
  description: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  responsibleInstitution: string;
}

export interface Project {
  id: string;
  programId: string;
  name: string;
  description: string;
  budget: number;
  timeline: {
    startDate: Date;
    endDate: Date;
  };
  responsibleOfficer: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  projectId: string;
  name: string;
  description: string;
  budget: number;
  timeline: {
    startDate: Date;
    endDate: Date;
  };
  assignedTo: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress: number; // 0-100
}

/**
 * Imihigo (Performance Contract)
 */
export interface Imihigo {
  id: string;
  type: 'NATIONAL' | 'DISTRICT' | 'SECTOR';
  name: string;
  fiscalYear: string;
  entity: string; // District name or ministry
  kpis: KPI[];
  createdAt: Date;
}

export interface KPI {
  id: string;
  imihigoId: string;
  name: string;
  description: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  weight: number; // percentage contribution to overall score
  policyId?: string;
  activityId?: string;
}

/**
 * Monitoring & Evaluation
 */
export interface ProgressReport {
  id: string;
  activityId: string;
  reportDate: Date;
  progress: number;
  achievements: string;
  challenges: string;
  nextSteps: string;
  evidenceUrls: string[];
  reportedBy: string;
}

export interface Risk {
  id: string;
  policyId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: string;
  mitigation: string;
  status: 'IDENTIFIED' | 'MITIGATED' | 'RESOLVED';
  createdAt: Date;
}

/**
 * Citizen Engagement
 */
export interface CitizenFeedback {
  id: string;
  policyId: string;
  citizenId: string;
  type: 'FEEDBACK' | 'COMPLAINT' | 'SUGGESTION' | 'APPRECIATION';
  subject: string;
  message: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESPONDED' | 'RESOLVED';
  response?: string;
  respondedBy?: string;
  respondedAt?: Date;
  createdAt: Date;
}

/**
 * Dashboard Statistics
 */
export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  completedPolicies: number;
  policiesInDraft: number;
  averageCompletionRate: number;
  citizenFeedbackCount: number;
  performanceScore: number;
}

/**
 * Filter and Pagination
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API Response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
