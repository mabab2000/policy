import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  MessageSquare,
  CheckCircle,
  Scale,
  TrendingUp,
  Database,
  UserPlus,
  FolderPlus,
  FilePlus,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { ROLE_LABELS } from '@/constants';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: ReactNode;
  label: string;
  path: string;
  roles: UserRole[];
}

const navigation: NavItem[] = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: 'Dashboard',
    path: '/dashboard',
    roles: [UserRole.SUPER_ADMIN, UserRole.MINISTRY_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.SECTOR_OFFICER, UserRole.CITIZEN, UserRole.AUDITOR],
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: 'Policies',
    path: '/policies',
    roles: [UserRole.SUPER_ADMIN, UserRole.MINISTRY_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.SECTOR_OFFICER, UserRole.CITIZEN, UserRole.AUDITOR],
  },

  {
    icon: <Database className="h-5 w-5" />,
    label: 'Data Collection',
    path: '/data-collection',
    roles: [UserRole.SUPER_ADMIN, UserRole.MINISTRY_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.SECTOR_OFFICER, UserRole.CITIZEN, UserRole.AUDITOR],
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: 'Citizen Feedback',
    path: '/citizen-feedback',
    roles: [UserRole.SUPER_ADMIN, UserRole.MINISTRY_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.SECTOR_OFFICER, UserRole.CITIZEN, UserRole.AUDITOR],
  },
  

  {
    icon: <Scale className="h-5 w-5" />,
    label: 'Legal & Cabinet',
    path: '/legal-cabinet',
    roles: [UserRole.SUPER_ADMIN, UserRole.MINISTRY_OFFICER, UserRole.DISTRICT_OFFICER, UserRole.SECTOR_OFFICER, UserRole.CITIZEN, UserRole.AUDITOR],
  },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout, currentProject } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-primary-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-primary-50"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{(currentProject?.organization || 'Organization') + '/' + (currentProject?.project_name || 'Project')}</h1>
                </div>
                {/* collapse toggle moved into sidebar */}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-4 focus:outline-none"
                aria-expanded={isProfileOpen}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{(user as any)?.phone || ''}</p>
                </div>
                <div className="h-10 w-10 rounded-full border-2 border-primary-300 bg-primary-600 text-white flex items-center justify-center font-bold">
                  {(() => {
                    const fullName = (user?.name || '') as string;
                    if (!fullName) return 'U';
                    const parts = fullName.trim().split(/\s+/);
                    let initials = '';
                    if (parts.length === 1) {
                      initials = parts[0].slice(0, 2).toUpperCase();
                    } else {
                      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                    }
                    return initials;
                  })()}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border-2 border-primary-100 rounded-lg shadow-lg z-50">
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
          <aside
          className={`
            fixed inset-y-0 left-0 top-16 z-30 ${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r-2 border-primary-200
            transform transition-all duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          `}
        >

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-0 top-0 translate-x-1/2 translate-y-1/2 p-2 rounded-full bg-white border-2 border-primary-200 text-gray-600 shadow-sm hover:bg-primary-50 z-10"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>

          <nav className="p-4 space-y-1">
            {/* first nav item rendered with collapse toggle on same line */}
            {filteredNavigation.length > 0 && (
              (() => {
                const first = filteredNavigation[0];
                const rest = filteredNavigation.slice(1);
                const isActiveFirst = location.pathname === first.path;
                return (
                  <>
                    <div className="mb-2">
                      <Link
                        to={first.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-2 pr-8'} py-2 rounded-lg transition-colors border-2 w-full
                          ${isActiveFirst ? 'bg-primary-50 text-primary-700 border-primary-300 font-medium' : 'text-gray-700 hover:bg-primary-50 border-transparent hover:border-primary-200'}`}
                      >
                        {first.icon}
                        {!isCollapsed && <span>{first.label}</span>}
                      </Link>
                    </div>

                    {rest.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-2'} py-2 rounded-lg transition-colors border-2
                            ${isActive ? 'bg-primary-50 text-primary-700 border-primary-300 font-medium' : 'text-gray-700 hover:bg-primary-50 border-transparent hover:border-primary-200'}`}
                        >
                          {item.icon}
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      );
                    })}
                  </>
                );
              })()
            )}

            {/* Settings and Logout moved to header profile dropdown */}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 lg:p-8 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
