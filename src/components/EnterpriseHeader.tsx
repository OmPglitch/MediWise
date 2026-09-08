import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Download,
  AlertTriangle,
  Bell,
  Server,
  ShieldCheck,
  Search,
  CheckCircle,
  RefreshCw,
  LogIn,
  UserPlus,
  User,
  Lock,
  LogOut,
  ChevronDown,
  Shield,
  KeyRound,
  Laptop,
  Truck,
  Sun,
  Moon
} from 'lucide-react';
import { ActiveTab, TenantScope, UserProfile, UserRole, ThemeMode } from '../types';
import { ROLE_DETAILS, DEMO_USERS } from '../data/mockUsers';

interface EnterpriseHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  tenantScope: TenantScope;
  setTenantScope: (scope: TenantScope) => void;
  onOpenEmergencyModal: () => void;
  onTriggerTelemetryExport: () => void;
  onOpenNotifications: () => void;
  isRollbackActive: boolean;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenProfileModal: () => void;
  onLockSession: () => void;
  onLogout: () => void;
  onSwitchPersona: (role: UserRole) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  activeTab,
  setActiveTab,
  tenantScope,
  setTenantScope,
  onOpenEmergencyModal,
  onTriggerTelemetryExport,
  onOpenNotifications,
  isRollbackActive,
  currentUser,
  isAuthenticated,
  onOpenAuthModal,
  onOpenProfileModal,
  onLockSession,
  onLogout,
  onSwitchPersona,
  theme,
  onToggleTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleMeta = currentUser ? ROLE_DETAILS[currentUser.role] : null;


  return (
    <header className="flex justify-between items-center w-full px-6 h-14 bg-[#0d1424] border-b border-[#1e293b] fixed top-0 left-0 right-0 z-50 select-none shadow-md backdrop-blur-md">
      {/* Left: Brand Identity & Search */}
      <div className="flex items-center gap-5">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveTab('overview')}
          title="Return to Command Center"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-white text-[15px] font-['Hanken_Grotesk'] leading-tight flex items-center gap-1.5">
              MediWise Operations
              {isRollbackActive && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ROLLBACK v4.11.9
                </span>
              )}
            </span>
            <span className="text-[10px] text-[#94a3b8] font-mono leading-none">Enterprise Clinical Mesh</span>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-[#1e293b] hidden md:block"></div>

        {/* Live Telemetry Health Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#090d16]/80 border border-[#1e293b] text-xs font-mono text-[#cbd5e1]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold">K8S & REDIS 99.98%</span>
          <span className="text-[#64748b]">•</span>
          <span className="text-[#94a3b8]">138ms P95</span>
        </div>

        {/* Quick Search */}
        <div className="relative w-64 hidden xl:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partner, NDC, SKU, salt..."
            className="w-full h-8 pl-8 pr-12 text-xs bg-[#090d16] border border-[#1e293b] rounded focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none text-[#e2e8f0] placeholder-[#64748b] transition-all"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#64748b] bg-[#1e293b] px-1 rounded border border-[#334155]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Middle: Scope Selector & View Switcher */}
      <div className="hidden md:flex items-center gap-6 h-full">
        <nav className="flex items-center gap-2 h-full">
          <button
            onClick={() => setTenantScope('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
              tenantScope === 'all'
                ? 'text-white bg-[#1e293b] border border-[#334155]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            All Tenants
          </button>
          <button
            onClick={() => setTenantScope('regional')}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
              tenantScope === 'regional'
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/60'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Regional Partners
          </button>
          <button
            onClick={() => setTenantScope('ops')}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
              tenantScope === 'ops'
                ? 'text-white bg-[#1e293b] border border-[#334155]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Platform Ops
          </button>
        </nav>

        {/* Portal Switcher Button */}
        <div className="flex items-center p-0.5 rounded bg-[#090d16] border border-[#1e293b]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
              activeTab !== 'patient' && activeTab !== 'deliveries'
                ? 'bg-[#0284c7] text-white shadow-sm font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>Ops Console</span>
          </button>
          <button
            onClick={() => setActiveTab('patient')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'patient'
                ? 'bg-[#0284c7] text-white shadow-sm font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>Customer Portal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'deliveries'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-sm font-semibold'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Deliveries</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Right: Actions & Director Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTriggerTelemetryExport}
          className="h-8 px-3 border border-[#1e293b] bg-[#090d16] text-[#cbd5e1] hover:bg-[#1e293b] hover:text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Export JSON telemetry stream"
        >
          <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="hidden sm:inline">Export Telemetry</span>
        </button>

        <button
          onClick={onOpenEmergencyModal}
          className="h-8 px-3 bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer border border-red-500/40"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Emergency Override</span>
        </button>

        <div className="flex items-center gap-1 border-l border-[#1e293b] pl-3">
          <button
            onClick={onOpenNotifications}
            className="p-1.5 text-[#94a3b8] hover:text-white rounded hover:bg-[#1e293b] relative transition-colors cursor-pointer"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1.5 text-[#94a3b8] hover:text-white rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
            title="DNS & Gateways"
          >
            <Server className="w-4 h-4" />
          </button>

          {/* Light / Dark Mode Quick Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[#94a3b8] hover:text-white rounded hover:bg-[#1e293b] transition-all cursor-pointer flex items-center justify-center relative group"
            title={theme === 'dark' ? 'Switch to Sterile Light Mode' : 'Switch to Clinical Dark Mode'}
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600 group-hover:-rotate-12 transition-transform duration-200" />
            )}
          </button>

          {/* Authenticated User Profile or Sign-In / Register Buttons */}
          {isAuthenticated && currentUser ? (
            <div className="relative ml-1" ref={dropdownRef}>
              <div
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-[#1e293b] transition-colors border border-transparent hover:border-[#334155]"
                title={`${currentUser.name} (${currentUser.roleTitle})`}
              >
                <div className="w-8 h-8 rounded-full border border-cyan-500/40 bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-cyan-200 flex items-center justify-center font-bold text-xs shadow-inner">
                  {currentUser.avatarInitials}
                </div>
                <div className="hidden 2xl:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <ChevronDown className="w-3 h-3 text-[#64748b]" />
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/80 leading-tight">
                    {roleMeta?.label.split(' ')[0]} • 0x7FA3
                  </span>
                </div>
              </div>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-11 w-64 bg-[#0d1424] border border-[#1e293b] rounded-lg shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  {/* User Overview */}
                  <div className="p-2.5 bg-[#090d16] border border-[#1e293b] rounded mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs truncate">{currentUser.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${roleMeta?.badgeColor}`}>
                        {currentUser.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#94a3b8] truncate">{currentUser.email}</div>
                    <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5 truncate">{currentUser.organization}</div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfileModal();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-white hover:bg-[#1e293b] rounded flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Profile & Security Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuthModal('login');
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] rounded flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                      <span>Switch Account / Identity</span>
                    </button>

                    <button
                      onClick={() => {
                        onToggleTheme();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-white hover:bg-[#1e293b] rounded flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {theme === 'dark' ? (
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-cyan-500" />
                        )}
                        <span>Theme Mode</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#090d16] border border-[#1e293b] text-[#94a3b8] uppercase font-bold">
                        {theme === 'dark' ? 'Dark' : 'Light'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLockSession();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 rounded flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>HIPAA Workstation Lock</span>
                    </button>

                    <div className="border-t border-[#1e293b] my-1"></div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick 1-Click Sign Out Button */}
              <button
                onClick={onLogout}
                className="h-8 px-2.5 bg-red-950/30 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer ml-1"
                title="Sign out completely from this session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="h-8 px-3 bg-[#090d16] hover:bg-[#1e293b] border border-[#1e293b] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
