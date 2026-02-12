import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { 
  Heart, 
  GraduationCap, 
  Wheat, 
  Factory, 
  TrendingUp, 
  Shield,
  Building2,
  Zap,
  Eye,
  EyeOff,
  Activity,
  Landmark,
  Users,
  Network,
  BarChart3,
  PieChart,
  Circle,
  Database,
  Cpu,
  Globe
} from 'lucide-react';
import logoUrl from '/logo.png';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Building3D {
  icon: any;
  title: string;
  color: string;
  gradient: string;
  height: number;
  width: number;
  depth: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

const architecturalBuildings: Building3D[] = [
  { 
    icon: Heart, 
    title: 'Health Center', 
    color: '#e74c3c',
    gradient: 'from-red-500 to-red-700',
    height: 180,
    width: 80,
    depth: 80,
    position: { x: -250, y: 50, z: -100 },
    rotation: { x: 60, y: -30, z: 0 }
  },
  { 
    icon: GraduationCap, 
    title: 'Education', 
    color: '#3498db',
    gradient: 'from-blue-500 to-blue-700',
    height: 220,
    width: 90,
    depth: 90,
    position: { x: 250, y: 30, z: -80 },
    rotation: { x: 60, y: 30, z: 0 }
  },
  { 
    icon: Wheat, 
    title: 'Agriculture', 
    color: '#27ae60',
    gradient: 'from-green-500 to-green-700',
    height: 150,
    width: 100,
    depth: 70,
    position: { x: -280, y: 120, z: 50 },
    rotation: { x: 60, y: -20, z: 0 }
  },
  { 
    icon: Factory, 
    title: 'Industry', 
    color: '#95a5a6',
    gradient: 'from-gray-500 to-gray-700',
    height: 200,
    width: 85,
    depth: 85,
    position: { x: 280, y: 140, z: 30 },
    rotation: { x: 60, y: 25, z: 0 }
  },
  { 
    icon: Building2, 
    title: 'Infrastructure', 
    color: '#16a085',
    gradient: 'from-teal-500 to-teal-700',
    height: 240,
    width: 95,
    depth: 95,
    position: { x: 0, y: -50, z: -120 },
    rotation: { x: 60, y: 0, z: 0 }
  },
  { 
    icon: Zap, 
    title: 'Energy', 
    color: '#f39c12',
    gradient: 'from-yellow-500 to-orange-700',
    height: 190,
    width: 75,
    depth: 75,
    position: { x: -150, y: -80, z: 20 },
    rotation: { x: 60, y: -15, z: 0 }
  },
  { 
    icon: Shield, 
    title: 'Security', 
    color: '#9b59b6',
    gradient: 'from-purple-500 to-purple-700',
    height: 170,
    width: 80,
    depth: 80,
    position: { x: 150, y: -60, z: 40 },
    rotation: { x: 60, y: 15, z: 0 }
  },
  { 
    icon: TrendingUp, 
    title: 'Economy', 
    color: '#e67e22',
    gradient: 'from-orange-500 to-orange-700',
    height: 210,
    width: 88,
    depth: 88,
    position: { x: 50, y: 180, z: 10 },
    rotation: { x: 60, y: 10, z: 0 }
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      const projectIds = await login(data.email, data.password);
      if (projectIds && projectIds.length > 0) {
        navigate('/dashboard');
      } else {
        navigate('/projects/create');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-slate-950"
      style={{
        perspective: '2500px',
        background: 'linear-gradient(to bottom, #020817 0%, #0a1628 50%, #030712 100%)',
      }}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}></div>

      {/* Animated Scan Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none animate-scan-lines"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.5) 2px, rgba(6, 182, 212, 0.5) 4px)',
        }}
      ></div>

      {/* Animated Scan Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none animate-scan-lines"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.5) 2px, rgba(6, 182, 212, 0.5) 4px)',
        }}
      ></div>

      {/* HUD Corner Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l-4 border-t-4 border-cyan-500/50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 border-r-4 border-t-4 border-cyan-500/50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 border-l-4 border-b-4 border-cyan-500/50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-4 border-b-4 border-cyan-500/50 pointer-events-none"></div>

      {/* Main HUD Container */}
      <div className="relative z-10 min-h-screen flex">
        
        {/* LEFT PANEL - Analytics Dashboard */}
        <div className="w-80 bg-slate-900/40 backdrop-blur-xl border-r-2 border-cyan-500/30 p-6 space-y-6 overflow-y-auto">
          {/* System Status */}
          <div className="space-y-3">
            <h3 className="text-cyan-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 animate-pulse" />
              SYSTEM STATUS
            </h3>
            
            {/* Circular Progress - Active Users */}
            <div className="bg-slate-800/60 rounded-xl p-4 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-mono">ACTIVE USERS</span>
                <Circle className="w-3 h-3 text-green-400 fill-green-400 animate-pulse" />
              </div>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="8" fill="none"/>
                  <circle cx="64" cy="64" r="56" stroke="url(#gradient1)" strokeWidth="8" fill="none"
                    strokeDasharray="351.86" strokeDashoffset="88" className="transition-all duration-1000"
                    strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-cyan-400">526</span>
                  <span className="text-xs text-slate-500 font-mono">ONLINE</span>
                </div>
              </div>
            </div>

            {/* SECTOR ACTIVITY removed per request */}

            {/* System Metrics (CPU removed) */}
            <div className="bg-slate-800/60 rounded-xl p-4 border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono">NETWORK</span>
                <span className="text-purple-400 text-sm font-bold font-mono">0.9 MB/s</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '78%' }}></div>
              </div>
            </div>

            {/* Sector List */}
            <div className="bg-slate-800/60 rounded-xl p-4 border border-cyan-500/20">
              <h4 className="text-slate-400 text-xs font-mono mb-3">MONITORED SECTORS</h4>
              <div className="space-y-2">
                {[
                  { icon: Heart, name: 'Health', value: 95, color: 'text-red-400' },
                  { icon: GraduationCap, name: 'Education', value: 88, color: 'text-blue-400' },
                  { icon: Wheat, name: 'Agriculture', value: 76, color: 'text-green-400' },
                  { icon: Factory, name: 'Industry', value: 82, color: 'text-gray-400' },
                ].map((sector, i) => (
                  <div key={i} className="flex items-center justify-between group hover:bg-slate-700/50 p-2 rounded transition-all">
                    <div className="flex items-center gap-2">
                      <sector.icon className={`w-4 h-4 ${sector.color}`} />
                      <span className="text-slate-300 text-xs font-mono">{sector.name}</span>
                    </div>
                    <span className="text-cyan-400 text-xs font-bold font-mono">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER - 3D City View & Login */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-slate-900/60 backdrop-blur-xl border-b-2 border-cyan-500/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full ring-2 ring-cyan-500/50" />
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono">
                  POLICY 360
                </h1>
                <p className="text-xs text-slate-500 font-mono">MULTI-SECTOR GOVERNANCE PLATFORM</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400 font-mono">SYSTEM ONLINE</span>
              </div>
              <div className="text-xs text-cyan-400 font-mono">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>
          </div>

          {/* 3D City View */}
          <div className="flex-1 relative overflow-hidden">
            {/* City Skyline Background */}
            <div className="absolute inset-0">
              {/* Background buildings */}
              <div className="absolute bottom-0 left-0 right-0 h-64 opacity-30">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bottom-0 bg-gradient-to-t from-slate-800 to-slate-700"
                    style={{
                      left: `${i * 5}%`,
                      width: `${Math.random() * 60 + 40}px`,
                      height: `${Math.random() * 150 + 100}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Central Platform with 3D Buildings */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  perspective: '2000px',
                  transform: `rotateX(${20 + mousePosition.y * 5}deg) rotateY(${mousePosition.x * 10}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.3s ease-out',
                }}
              >
                {/* Platform Base */}
                <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Holographic Circle Platform */}
                  <div className="w-96 h-96 relative">
                    {/* Outer rings */}
                    {[1, 2, 3].map((ring) => (
                      <div
                        key={ring}
                        className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping-slow"
                        style={{
                          transform: `translateZ(${ring * 10}px) scale(${1 + ring * 0.1})`,
                          animationDelay: `${ring * 0.3}s`,
                          animationDuration: '3s',
                        }}
                      ></div>
                    ))}
                    
                    {/* Center platform */}
                    <div className="absolute inset-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-500 border-4 border-cyan-400/50"
                      style={{
                        transform: 'translateZ(50px)',
                        boxShadow: '0 0 100px rgba(6, 182, 212, 0.5)',
                      }}
                    >
                      {/* Grid lines on platform */}
                      <div className="absolute inset-0 rounded-full opacity-30"
                        style={{
                          backgroundImage: `
                            radial-gradient(circle, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
                          `,
                          backgroundSize: '20px 20px',
                        }}
                      ></div>
                    </div>

                    {/* 3D Holographic Buildings around platform */}
                    {architecturalBuildings.map((building, index) => {
                      const Icon = building.icon;
                      const angle = (index / architecturalBuildings.length) * Math.PI * 2;
                      const radius = 180;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      
                      return (
                        <div
                          key={index}
                          className="absolute"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `
                              translate(-50%, -50%)
                              translate(${x}px, ${y}px)
                              translateZ(${building.height / 2}px)
                              rotateY(${-angle * (180 / Math.PI)}deg)
                            `,
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {/* Holographic Building */}
                          <div
                            className={`bg-gradient-to-t ${building.gradient} opacity-80backdrop-blur-sm border-2 border-cyan-400/50 relative hover:scale-110 transition-all duration-500 group animate-building-rise`}
                            style={{
                              width: '40px',
                              height: `${building.height * 0.5}px`,
                              boxShadow: `0 0 30px ${building.color}80`,
                              animationDelay: `${index * 0.15}s`,
                            }}
                          >
                            {/* Windows */}
                            <div className="absolute inset-2 space-y-1">
                              {[...Array(Math.floor(building.height / 40))].map((_, i) => (
                                <div key={i} className="grid grid-cols-2 gap-1">
                                  <div className="w-full h-2 bg-cyan-300/40 animate-window-blink" style={{ animationDelay: `${i * 0.3}s` }}></div>
                                  <div className="w-full h-2 bg-cyan-300/40 animate-window-blink" style={{ animationDelay: `${i * 0.3 + 0.15}s` }}></div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Icon */}
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                              <Icon className="w-5 h-5 text-cyan-400 drop-shadow-glow group-hover:scale-125 transition-transform" />
                            </div>
                          </div>

                          {/* Light beam from building */}
                          <div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-t from-cyan-400/60 to-transparent animate-pulse-slow"
                            style={{
                              height: '100px',
                              transform: 'translateX(-50%) translateZ(-10px)',
                            }}
                          ></div>
                        </div>
                      );
                    })}

                    {/* Central Hologram */}
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ transform: 'translateZ(100px)' }}
                    >
                      <div className="relative">
                        <Globe className="w-20 h-20 text-cyan-400 animate-spin-slow drop-shadow-glow" />
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Data Particles removed (caused rain-like dots) */}
            </div>

            {/* Login Form Overlay - Top */}
            <div className="absolute inset-0 flex items-start justify-center pointer-events-none pt-8">
              <div className="pointer-events-auto w-full max-w-md p-8">
                <div className="bg-slate-900/10 backdrop-blur-10xl rounded-2xl border-2 border-cyan-500/50 overflow-hidden relative"
                  style={{
                    boxShadow: '0 0 60px rgba(6, 182, 212, 0.4)',
                  }}
                >
                  {/* Scan line animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-full animate-scan-line pointer-events-none"></div>
                  
                  <div className="p-8 relative z-10">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-cyan-400 mb-2 font-mono">ACCESS CONTROL</h2>
                      
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      {error && (
                        <div className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm flex items-center gap-2 animate-shake">
                          <Shield className="w-4 h-4" />
                          {error}
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-cyan-400 text-xs font-mono uppercase tracking-wider">USER ID</label>
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="your.email@gov.rw"
                          className="w-full px-4 py-3 bg-slate-950/80 border-2 border-cyan-500/30 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all font-mono text-sm"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-xs font-mono">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-cyan-400 text-xs font-mono uppercase tracking-wider">ACCESS CODE</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            placeholder="* * * * * * * *"
                            className="w-full px-4 py-3 bg-slate-950/80 border-2 border-cyan-500/30 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all font-mono text-sm pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70 hover:text-cyan-400 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-400 text-xs font-mono">{errors.password.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-wider rounded-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 border-2 border-cyan-400/30 relative overflow-hidden group font-mono"
                        style={{
                          boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <span className="relative flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <Cpu className="w-5 h-5 animate-spin" />
                              AUTHENTICATING...
                            </>
                          ) : (
                            <>
                              <Shield className="w-5 h-5" />
                              ENTER SYSTEM
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Control Bar removed per request */}
        </div>

        {/* RIGHT PANEL - Statistics & Metrics */}
        <div className="w-80 bg-slate-900/40 backdrop-blur-xl border-l-2 border-cyan-500/30 p-6 space-y-6 overflow-y-auto">
          {/* Real-time Stats */}
          <div className="space-y-3">
            <h3 className="text-cyan-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              SECTOR ANALYTICS
            </h3>

            {/* Circular Progress Rings */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Health', value: 65, color: 'stroke-red-400', max: 100 },
                { label: 'Education', value: 85, color: 'stroke-blue-400', max: 100 },
                { label: 'Agriculture', value: 54, color: 'stroke-green-400', max: 100 },
                { label: 'Industry', value: 78, color: 'stroke-gray-400', max: 100 },
              ].map((stat, i) => {
                const circumference = 2 * Math.PI * 30;
                const offset = circumference - (stat.value / stat.max) * circumference;
                
                return (
                  <div key={i} className="bg-slate-800/60 rounded-xl p-3 border border-cyan-500/20">
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="transform -rotate-90 w-20 h-20">
                        <circle cx="40" cy="40" r="30" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="6" fill="none"/>
                        <circle cx="40" cy="40" r="30" className={stat.color} strokeWidth="6" fill="none"
                          strokeDasharray={circumference} strokeDashoffset={offset}
                          strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-cyan-400 font-mono">{stat.value}</span>
                      </div>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-2 font-mono">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Live Activity removed per request */}

            {/* Today's Statistics */}
            <div className="bg-slate-800/60 rounded-xl p-4 border border-cyan-500/20">
              <h4 className="text-slate-400 text-xs font-mono mb-3">TODAY'S OVERVIEW</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono">Total Logins</span>
                  <span className="text-cyan-400 text-lg font-bold font-mono">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono">Active Sessions</span>
                  <span className="text-green-400 text-lg font-bold font-mono">526</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono">Policies Updated</span>
                  <span className="text-blue-400 text-lg font-bold font-mono">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-mono">Reports Generated</span>
                  <span className="text-purple-400 text-lg font-bold font-mono">42</span>
                </div>
              </div>
            </div>

            {/* System Health removed per request */}
          </div>
        </div>
      </div>
    </div>
  );
}
          
