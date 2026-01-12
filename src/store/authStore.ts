import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  canAccess: (resource: string) => boolean;
}

/**
 * Mock Authentication - Replace with real API calls
 */
const mockLogin = async (email: string, _password: string): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock users
  const mockUsers: Record<string, User> = {
    'admin@gmail.com': {
      id: '1',
      email: 'admin@gmail.com',
      name: 'John Mukiza',
      role: UserRole.SUPER_ADMIN,
      institution: 'Office of the Prime Minister',
      avatar: 'https://ui-avatars.com/api/?name=John+Mukiza',
      createdAt: new Date(),
    },
    'ministry@gov.rw': {
      id: '2',
      email: 'ministry@gov.rw',
      name: 'Marie Uwase',
      role: UserRole.MINISTRY_OFFICER,
      institution: 'Ministry of Finance and Economic Planning',
      avatar: 'https://ui-avatars.com/api/?name=Marie+Uwase',
      createdAt: new Date(),
    },
    'district@gov.rw': {
      id: '3',
      email: 'district@gov.rw',
      name: 'Paul Habimana',
      role: UserRole.DISTRICT_OFFICER,
      institution: 'Gasabo District',
      district: 'Gasabo',
      avatar: 'https://ui-avatars.com/api/?name=Paul+Habimana',
      createdAt: new Date(),
    },
    'sector@gov.rw': {
      id: '4',
      email: 'sector@gov.rw',
      name: 'Claire Umutesi',
      role: UserRole.SECTOR_OFFICER,
      district: 'Gasabo',
      sector: 'Remera',
      avatar: 'https://ui-avatars.com/api/?name=Claire+Umutesi',
      createdAt: new Date(),
    },
    'citizen@example.com': {
      id: '5',
      email: 'citizen@example.com',
      name: 'Jean Niyonzima',
      role: UserRole.CITIZEN,
      district: 'Gasabo',
      avatar: 'https://ui-avatars.com/api/?name=Jean+Niyonzima',
      createdAt: new Date(),
    },
    'auditor@gov.rw': {
      id: '6',
      email: 'auditor@gov.rw',
      name: 'Grace Kagabo',
      role: UserRole.AUDITOR,
      institution: 'Office of the Auditor General',
      avatar: 'https://ui-avatars.com/api/?name=Grace+Kagabo',
      createdAt: new Date(),
    },
  };

  const user = mockUsers[email];
  if (!user) {
    throw new Error('Invalid credentials');
  }

  return {
    user,
    token: 'mock-jwt-token-' + user.id,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  login: async (email: string, password: string) => {
    try {
      const { user, token } = await mockLogin(email, password);
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true });
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
      } catch (error) {
        console.error('Failed to parse user data:', error);
        get().logout();
      }
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
