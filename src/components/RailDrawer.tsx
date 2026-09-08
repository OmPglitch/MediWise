import React from 'react';
import {
  LayoutDashboard,
  Pill,
  Store,
  ShieldCheck,
  Settings,
  PlayCircle,
  FileCheck2,
  Terminal,
  Activity,
  HeartHandshake,
  User,
  Lock,
  ChevronRight,
  Truck
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { ROLE_DETAILS } from '../data/mockUsers';

interface RailDrawerProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRunAudit: () => void;
  isAuditing: boolean;
  isRollbackActive: boolean;
  currentUser: UserProfile | null;
  onOpenProfileModal: () => void;
  onLockSession: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export const RailDrawer: React.FC<RailDrawerProps> = ({
  activeTab,
  setActiveTab,
  onRunAudit,
  isAuditing,
  isRollbackActive,
  currentUser,
  onOpenProfileModal,
  onLockSession,
  onOpenAuthModal,
}) => {
  const roleMeta = currentUser ? ROLE_DETAILS[currentUser.role] : null;

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 flex flex-col justify-between p-3 border-r border-[#1e293b] bg-[#0b101d] z-40 select-none">
      <div className="flex flex-col gap-2">
        {/* Header Clinical Shield Brand Context */}
        <div className="px-3 py-2.5 mb-1 border-b border-[#1e293b]/80 bg-[#090d16]/40 rounded-t">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white font-['Hanken_Grotesk'] leading-none">
                MediWise Core
              </div>
              <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isRollbackActive ? 'v4.11.9-STABLE • 100% HEALTHY' : 'Prod v1.0.4 • 99.98% Healthy'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1">
          {/* 1: Overview & Analytics */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-950/80 to-[#1e293b]/60 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/40'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-cyan-400' : 'text-[#64748b]'}`} />
            <span className="flex-1">Overview & Analytics</span>
          </button>

          {/* 2: Drug Composition Catalog */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all text-left ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-cyan-950/80 to-[#1e293b]/60 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Pill className={`w-4 h-4 ${activeTab === 'catalog' ? 'text-cyan-400' : 'text-[#64748b]'}`} />
              <span>Drug Composition Catalog</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-900/50 text-cyan-300 border border-cyan-700/40 rounded">
              18,924
            </span>
          </button>

          {/* 3: Partner Pharmacy Network */}
          <button
            onClick={() => setActiveTab('partners')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all text-left ${
              activeTab === 'partners'
                ? 'bg-gradient-to-r from-cyan-950/80 to-[#1e293b]/60 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Store className={`w-4 h-4 ${activeTab === 'partners' ? 'text-cyan-400' : 'text-[#64748b]'}`} />
              <span>Partner Pharmacy Network</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#0284c7] text-white rounded">
              142
            </span>
          </button>

          {/* Deliveries & Prescription Tracking (Amazon-style) */}
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all text-left ${
              activeTab === 'deliveries'
                ? 'bg-gradient-to-r from-cyan-950/80 to-[#1e293b]/60 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className={`w-4 h-4 ${activeTab === 'deliveries' ? 'text-cyan-400' : 'text-[#64748b]'}`} />
              <span>Deliveries & Tracking</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
              Live
            </span>
          </button>

          {/* 4: Compliance & Audit Logs */}
          <button
            onClick={() => setActiveTab('compliance')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all text-left ${
              activeTab === 'compliance'
                ? 'bg-gradient-to-r from-cyan-950/80 to-[#1e293b]/60 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'compliance' ? 'text-cyan-400' : 'text-[#64748b]'}`} />
              <span>Compliance & Audit Logs</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>

          {/* 5: System Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-all text-left ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-cyan-950/80 to-[#1e293b]/60 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/40'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-cyan-400' : 'text-[#64748b]'}`} />
            <span>System Settings</span>
          </button>
        </nav>

        {/* Mid Action CTA */}
        <div className="mt-3 px-1">
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="w-full h-8 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white hover:from-[#1e293b] hover:to-[#334155] border border-[#334155] text-xs font-semibold rounded flex items-center justify-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-cyan-300">Auditing Mesh...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Compliance Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer Rail Tabs */}
      <div className="border-t border-[#1e293b] pt-2 flex flex-col gap-1.5">
        <a
          href="#hipaa"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('compliance');
          }}
          className="flex items-center justify-between px-3 py-1 text-[#94a3b8] hover:text-white text-xs hover:bg-[#1e293b]/40 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>HIPAA Attestation</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-800/40">
            VALID
          </span>
        </a>

        <a
          href="#diagnostics"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('settings');
          }}
          className="flex items-center justify-between px-3 py-1 text-[#94a3b8] hover:text-white text-xs hover:bg-[#1e293b]/40 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#64748b]" />
            <span>System Diagnostics</span>
          </div>
          <span className="text-[10px] font-mono text-[#64748b]">v1.0.4</span>
        </a>

        {/* SLA Status Indicator */}
        <div className="mt-1 px-3 py-2 bg-[#090d16]/70 rounded border border-[#1e293b]">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#94a3b8] mb-1">
            <span>HIPAA SLA STATUS</span>
            <span className="text-emerald-400 font-bold">99.98%</span>
          </div>
          <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.98%' }}></div>
          </div>
        </div>

        {/* User Identity & Session Lock Tile */}
        {currentUser ? (
          <div className="mt-1 p-2 bg-[#090d16] rounded border border-[#1e293b] flex items-center justify-between">
            <div
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 cursor-pointer min-w-0 flex-1 hover:opacity-80 transition-opacity"
              title="Open Account & Security Settings"
            >
              <div className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                {currentUser.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-white truncate leading-tight">{currentUser.name.split(' ')[0]}</div>
                <div className="text-[9px] font-mono text-cyan-400 truncate">{currentUser.role}</div>
              </div>
            </div>
            <button
              onClick={onLockSession}
              className="p-1 text-[#64748b] hover:text-amber-300 hover:bg-[#1e293b] rounded transition-colors cursor-pointer"
              title="HIPAA Workstation Lock"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="mt-1 p-1.5 bg-[#090d16] rounded border border-[#1e293b] flex gap-1">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="flex-1 py-1 text-center bg-[#1e293b] hover:bg-[#334155] text-white text-[11px] font-semibold rounded transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuthModal('register')}
              className="flex-1 py-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
