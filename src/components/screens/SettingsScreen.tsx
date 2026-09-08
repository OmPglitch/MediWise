import React, { useState } from 'react';
import {
  Server,
  Sliders,
  Shield,
  Key,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Download,
  Zap,
  Clock,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
  Cpu,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { ServiceGateway, SystemConfig, ThemeMode } from '../../types';

interface SettingsScreenProps {
  gateways: ServiceGateway[];
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  onOpenConfigDiffModal: () => void;
  onOpenRollbackModal: () => void;
  isRollbackActive: boolean;
  onBackupSnapshot: () => void;
  onTestPing: (gatewayId: string) => void;
  pingingId: string | null;
  theme?: ThemeMode;
  onSelectTheme?: (mode: ThemeMode) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  gateways,
  systemConfig,
  setSystemConfig,
  onOpenConfigDiffModal,
  onOpenRollbackModal,
  isRollbackActive,
  onBackupSnapshot,
  onTestPing,
  pingingId,
  theme = 'dark',
  onSelectTheme,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'gateways' | 'quotas' | 'yaml' | 'appearance'>('gateways');

  return (
    <div className="space-y-5">
      {/* Post-Rollback Warning Banner (if rolled back) */}
      {isRollbackActive && (
        <div className="p-3.5 bg-amber-950/70 border border-amber-500/50 rounded flex items-center justify-between text-xs text-amber-200 shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white">PRODUCTION REVERSION ACTIVE:</span> Cluster running{' '}
              <strong className="font-mono text-cyan-300">v4.11.9-STABLE</strong>. Hotfix candidate v4.12.0
              rolled back. All 16 worker pods re-synchronized with baseline safety envelope.
            </div>
          </div>
          <span className="font-mono text-[11px] bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700/50 font-semibold">
            STATUS: RESTORED
          </span>
        </div>
      )}

      {/* Title Ribbon & Global Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-3 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-white font-['Hanken_Grotesk'] tracking-tight">
              Platform Configuration, Multi-Tenant & API Settings
            </h1>
            <span className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              {isRollbackActive ? 'v4.11.9-STABLE' : systemConfig.configVersion}
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] flex items-center gap-2 mt-1 flex-wrap font-mono">
            <span>Ingress: 48,290 req/min</span>
            <span className="text-[#334155]">•</span>
            <span>42 Managed API Keys</span>
            <span className="text-[#334155]">•</span>
            <span>8/8 Connected Services</span>
            <span className="text-[#334155]">•</span>
            <span>142 Tenant Contexts</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBackupSnapshot}
            className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-[#cbd5e1] hover:text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Backup Snapshot (JSON)</span>
          </button>

          <button
            onClick={onOpenRollbackModal}
            className="h-8 px-3 bg-[#0d1424] border border-amber-700/60 hover:bg-amber-950/40 text-amber-300 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rollback to v4.11.9</span>
          </button>

          <button
            onClick={onOpenConfigDiffModal}
            className="h-8 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Deploy Changes (Rolling Restart)</span>
          </button>
        </div>
      </div>

      {/* Subtab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2">
        <button
          onClick={() => setActiveSubtab('gateways')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeSubtab === 'gateways'
              ? 'bg-[#1e293b] text-white'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          Connected Gateways & Webhooks (6)
        </button>
        <button
          onClick={() => setActiveSubtab('quotas')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeSubtab === 'quotas'
              ? 'bg-[#1e293b] text-white'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          Algorithmic Guardrails & Quotas
        </button>
        <button
          onClick={() => setActiveSubtab('yaml')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeSubtab === 'yaml'
              ? 'bg-[#1e293b] text-white'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          Active Runtime YAML Definition
        </button>
        <button
          onClick={() => setActiveSubtab('appearance')}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
            activeSubtab === 'appearance'
              ? 'bg-[#1e293b] text-white'
              : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Appearance & Themes</span>
          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#090d16] border border-[#1e293b] text-cyan-300 font-bold uppercase">
            {theme}
          </span>
        </button>
      </div>

      {/* Tab 1: Connected Gateways & Webhooks */}
      {activeSubtab === 'gateways' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gateways.map((gw) => (
              <div
                key={gw.id}
                className="bg-[#0d1424] border border-[#1e293b] rounded p-4 flex flex-col justify-between h-48 hover:border-[#334155] transition-all shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: `${gw.color}25`, border: `1px solid ${gw.color}50` }}
                      >
                        {gw.code}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs font-['Hanken_Grotesk'] leading-tight">
                          {gw.name}
                        </div>
                        <div className="text-[10px] text-[#64748b] leading-tight">{gw.type}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      {gw.health}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 font-mono text-[10px] text-[#94a3b8]">
                    <div className="text-[#64748b] truncate">Endpoint: {gw.endpoint}</div>
                    <div className="text-cyan-400/90">{gw.authBadge}</div>
                    <div>Quota: {gw.quota}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1e293b] flex justify-between items-center text-xs">
                  <span className="font-mono text-[11px] text-[#94a3b8]">
                    Latency: <strong className="text-emerald-400">{gw.latency}</strong>
                  </span>
                  <button
                    onClick={() => onTestPing(gw.id)}
                    disabled={pingingId === gw.id}
                    className="h-6 px-2 bg-[#090d16] border border-[#1e293b] hover:border-cyan-500 text-[10px] font-medium text-white rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {pingingId === gw.id ? 'Pinging...' : 'Test Ping'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Algorithmic Guardrails & Quotas */}
      {activeSubtab === 'quotas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Guardrails Configuration */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-4 shadow-sm">
            <div className="pb-2 border-b border-[#1e293b]">
              <h2 className="text-sm md:text-base font-bold text-white font-['Hanken_Grotesk']">
                Algorithmic Bioequivalence Guardrails
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Adjust safety parameters enforced by the active substitution matcher
              </p>
            </div>

            {/* Slider 1: Confidence Floor */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-white">Bioequivalence Confidence Floor</span>
                <span className="font-mono font-bold text-cyan-400">
                  {(systemConfig.bioeqConfidenceFloor * 100).toFixed(2)}% ({systemConfig.bioeqConfidenceFloor})
                </span>
              </div>
              <input
                type="range"
                min="0.95"
                max="0.999"
                step="0.001"
                value={systemConfig.bioeqConfidenceFloor}
                onChange={(e) =>
                  setSystemConfig((prev) => ({
                    ...prev,
                    bioeqConfidenceFloor: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-[#64748b] block font-mono">
                PRD Requirement: Minimum 98.00% statistical parity required to recommend substitution
              </span>
            </div>

            {/* Slider 2: Cmax Tolerance Band */}
            <div className="space-y-1.5 pt-2 border-t border-[#1e293b]">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-white">Cmax Tolerance Band (Δ)</span>
                <span className="font-mono font-bold text-emerald-400">
                  ±{(systemConfig.bioeqCmaxToleranceBand * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.10"
                step="0.005"
                value={systemConfig.bioeqCmaxToleranceBand}
                onChange={(e) =>
                  setSystemConfig((prev) => ({
                    ...prev,
                    bioeqCmaxToleranceBand: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Disclaimer Enforcement */}
            <div className="space-y-1.5 pt-2 border-t border-[#1e293b]">
              <span className="text-xs font-medium text-white block">PRD §9 Disclaimer Enforcement</span>
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] text-xs flex justify-between items-center">
                <div>
                  <div className="font-mono text-emerald-400 font-bold">STRICT_PRD_SEC9</div>
                  <div className="text-[10px] text-[#64748b]">Mandatory doctor consent modal before cart handoff</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold">
                  ENFORCED
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Quotas */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-4 shadow-sm">
            <div className="pb-2 border-b border-[#1e293b]">
              <h2 className="text-sm md:text-base font-bold text-white font-['Hanken_Grotesk']">
                Multi-Tenant Quota & Ingress Throttling
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Distributed rate limiting and cache TTL parameters across tenant nodes
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#64748b] block">Tenant Isolation Mode</span>
                  <span className="text-white font-bold">Schema-Per-Tenant (Strict Multi-Tenancy)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 text-[10px]">
                  ACTIVE
                </span>
              </div>

              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#64748b] block">Redis Search Cache TTL</span>
                  <span className="text-white font-bold">1,800 seconds (30 minutes)</span>
                </div>
                <span className="text-[#94a3b8]">Auto-Purge on Ingest</span>
              </div>

              <div className="p-2.5 bg-[#090d16] rounded border border-[#1e293b] flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#64748b] block">Max Pharmacy Partners per Ingress Worker</span>
                  <span className="text-white font-bold">{systemConfig.maxTenantsPerNode} Partners</span>
                </div>
                <span className="text-emerald-400">Under Quota (142/150)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: YAML Editor */}
      {activeSubtab === 'yaml' && (
        <div className="bg-[#0d1424] border border-[#1e293b] rounded p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
            <div>
              <h2 className="text-sm font-bold text-white font-['Hanken_Grotesk']">
                Active Runtime Configuration YAML
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Immutable cryptographic manifest loaded by worker pods
              </p>
            </div>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              SHA-256: 0x8a92...e1c
            </span>
          </div>

          <pre className="p-4 bg-[#090d16] border border-[#1e293b] rounded font-mono text-xs text-[#cbd5e1] overflow-x-auto leading-relaxed">
{`# MediWise Production Cluster Manifest
version: "${isRollbackActive ? 'v4.11.9-STABLE' : systemConfig.configVersion}"
cluster_environment: "${systemConfig.clusterEnv}"
k8s_discovery_namespace: "${systemConfig.k8sDiscoveryNamespace}"

security:
  encryption_algorithm: "${systemConfig.encryptionAlgorithm}"
  vault_rotation_interval: "${systemConfig.vaultRotationInterval}"
  hipaa_export_logging: ${systemConfig.hipaaExportLogging}
  audit_hash_chain_anchor: "${systemConfig.auditHashChainAnchor}"

algorithmic_matching:
  bioeq_confidence_floor: ${systemConfig.bioeqConfidenceFloor}
  bioeq_cmax_tolerance: ${systemConfig.bioeqCmaxToleranceBand}
  disclaimer_enforcement: "${systemConfig.disclaimerEnforcementLevel}"

caching_and_messaging:
  redis_shard_topology: "${systemConfig.redisShardNodes}"
  rabbitmq_event_exchange: "${systemConfig.rabbitmqEventExchange}"
  dead_letter_policy: "${systemConfig.deadLetterPolicy}"
  kafka_telemetry_topic: "${systemConfig.kafkaTelemetryTopic}"`}
          </pre>
        </div>
      )}

      {/* Tab 4: Appearance & Visual Themes */}
      {activeSubtab === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#1e293b]">
              <div>
                <h2 className="text-base font-bold text-white font-['Hanken_Grotesk'] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Interface Theme & Display Ergonomics</span>
                </h2>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Select your preferred visual environment for clinical monitoring, ICU workstations, and patient consultations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#94a3b8] font-mono">Current Theme:</span>
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${
                  theme === 'dark'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {theme} Mode
                </span>
              </div>
            </div>

            {/* Theme Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              {/* Option 1: Clinical Dark Mode */}
              <div
                onClick={() => onSelectTheme && onSelectTheme('dark')}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  theme === 'dark'
                    ? 'bg-[#090d16] border-cyan-500 shadow-lg shadow-cyan-950/40 ring-2 ring-cyan-500/20'
                    : 'bg-[#090d16]/70 border-[#1e293b] hover:border-[#334155] opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center shadow-inner">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Clinical Dark Canvas</h3>
                        <p className="text-xs text-[#94a3b8]">Optimized for low-light & ICU environments</p>
                      </div>
                    </div>
                    {theme === 'dark' && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Dark Theme Mini Preview */}
                  <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded-lg space-y-2 mt-3 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-[#94a3b8]">
                      <span>Surface Contrast:</span>
                      <span className="text-emerald-400 font-bold">14.2:1 (AAA Pass)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#94a3b8]">
                      <span>Workstation Glare:</span>
                      <span className="text-cyan-300">Ultra-Low Fatigue</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1e293b] overflow-hidden flex gap-1 p-0.5">
                      <div className="h-full w-1/3 bg-cyan-500 rounded-full"></div>
                      <div className="h-full w-1/4 bg-emerald-500 rounded-full"></div>
                      <div className="h-full w-1/4 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8]">Palette: Obsidian & Deep Slate</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectTheme) onSelectTheme('dark');
                    }}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-[#1e293b] text-[#cbd5e1] hover:text-white'
                    }`}
                  >
                    {theme === 'dark' ? 'Selected' : 'Activate Dark'}
                  </button>
                </div>
              </div>

              {/* Option 2: Sterile Medical Light Mode */}
              <div
                onClick={() => onSelectTheme && onSelectTheme('light')}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  theme === 'light'
                    ? 'bg-white border-cyan-600 shadow-lg ring-2 ring-cyan-500/20'
                    : 'bg-white/90 border-[#cbd5e1] hover:border-[#94a3b8] opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center shadow-inner">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Sterile Laboratory Light</h3>
                        <p className="text-xs text-slate-600">High-ambient daylight & consultation desks</p>
                      </div>
                    </div>
                    {theme === 'light' && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Light Theme Mini Preview */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 mt-3 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Surface Contrast:</span>
                      <span className="text-emerald-600 font-bold">12.8:1 (AAA Pass)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Ambient Daylight:</span>
                      <span className="text-cyan-700 font-bold">Optimal Readability</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden flex gap-1 p-0.5">
                      <div className="h-full w-1/3 bg-cyan-600 rounded-full"></div>
                      <div className="h-full w-1/4 bg-emerald-600 rounded-full"></div>
                      <div className="h-full w-1/4 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Palette: Pure White & Cool Slate</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectTheme) onSelectTheme('light');
                    }}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                      theme === 'light'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {theme === 'light' ? 'Selected' : 'Activate Light'}
                  </button>
                </div>
              </div>
            </div>

            {/* Regulatory & Display Guidelines note */}
            <div className="mt-5 p-3.5 bg-[#090d16] border border-[#1e293b] rounded-lg text-xs text-[#94a3b8] flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="font-semibold text-white">Persistent Session Storage:</span> Your visual preference is securely preserved across browser sessions. You can also toggle between Light and Dark mode at any moment via the top-header quick icon (<Sun className="w-3 h-3 inline text-amber-400 mx-0.5" /> / <Moon className="w-3 h-3 inline text-cyan-400 mx-0.5" />).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
