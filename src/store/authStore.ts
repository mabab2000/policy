import { create } from 'zustand';
import axios from 'axios';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  projects?: unknown[];
  currentProject?: { project_name?: string; organization?: string; project_id?: string } | null;
  login: (email: string, password: string) => Promise<string[]>;
  fetchProfile: (userId?: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  canAccess: (resource: string) => boolean;
}

/**
 * Mock Authentication - Replace with real API calls
 */
// Real login against local auth service
const performLogin = async (email: string, password: string): Promise<{ token: string; project_ids: string[]; user_id?: string }> => {
  const res = await axios.post('https://policy-users-go.onrender.com/api/login', { email, password }, { headers: { 'Content-Type': 'application/json' } });
  return res.data;
};

const fetchUserProfile = async (userId: string, token: string) => {
  const res = await axios.get(`https://policy-users-go.onrender.com/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  login: async (email: string, password: string) => {
    try {
      const data = await performLogin(email, password);
      let token: string = data.token || '';
      // normalize token: remove leading 'Bearer ' if present
      if (token.toLowerCase().startsWith('bearer ')) {
        token = token.split(' ')[1];
      }
      const projectIds: string[] = data.project_ids || [];

      // minimal user object to keep app functioning until full profile is fetched
      const user = {
        id: data.user_id || 'unknown',
        email,
        name: email.split('@')[0],
        role: UserRole.CITIZEN,
        createdAt: new Date(),
      } as User;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('project_ids', JSON.stringify(projectIds));

      set({ user, token, isAuthenticated: true });

      // fetch full profile (projects, phone, full_name) if available
      if (data.user_id) {
        try {
          await get().fetchProfile(data.user_id);
        } catch (e) {
          // ignore profile fetch errors
        }
      }

      return projectIds;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
        // try to fetch profile in background
        try {
          const userId = (user && (user.id as string)) || undefined;
          if (userId) get().fetchProfile(userId).catch(() => {});
        } catch (e) {
          // ignore
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        get().logout();
      }
    }
  },

  fetchProfile: async (userId?: string) => {
    const { token } = get();
    if (!userId) userId = get().user?.id;
    if (!userId || !token) return;

    try {
      const data = await fetchUserProfile(userId, token);
      const projects = data.projects || [];
      const projectIds = projects.map((p: any) => p.project_id);

      const updatedUser = {
        ...(get().user || {}),
        name: data.user?.full_name || get().user?.name,
        email: data.user?.email || get().user?.email,
        phone: data.user?.phone || (get().user as any)?.phone,
      } as User;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('projects', JSON.stringify(projects));
      localStorage.setItem('project_ids', JSON.stringify(projectIds));

      set({ user: updatedUser, projects, currentProject: projects[0] || null });
    } catch (e) {
      console.error('Failed to fetch user profile', e);
    }
  },

  hasRole: (roles: UserRole[]) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },

  canAccess: (resource: string) => {
    const { user } = get();
    if (!user) return false;

    // Define access control rules
    const accessRules: Record<UserRole, string[]> = {
      [UserRole.SUPER_ADMIN]: ['*'], // Access to everything
      [UserRole.MINISTRY_OFFICER]: [
        'policies',
        'implementation',
        'stakeholders',
        'monitoring',
        'imihigo',
      ],
      [UserRole.DISTRICT_OFFICER]: [
        'policies',
        'execution',
        'monitoring',
        'imihigo',
        'citizen-feedback',
      ],
      [UserRole.SECTOR_OFFICER]: [
        'execution',
        'progress-reports',
        'citizen-feedback',
      ],
      [UserRole.CITIZEN]: [
        'policies',
        'feedback',
      ],
      [UserRole.AUDITOR]: [
        'policies',
        'monitoring',
        'evaluation',
        'reports',
      ],
    };

    const allowedResources = accessRules[user.role];
    return allowedResources.includes('*') || allowedResources.includes(resource);
  },
}));
