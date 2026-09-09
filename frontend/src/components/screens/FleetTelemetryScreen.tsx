import React, { useState, useEffect } from 'react';
import {
  Thermometer,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Bluetooth,
  Zap,
  RefreshCw,
  MapPin,
  Download,
  Shield,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FLEETVehicleSensor } from '../../types';
import { MOCK_FLEET_VEHICLES } from '../../data/mockPhase5Data';
import { AuditEvent } from '../../types';

interface FleetTelemetryScreenProps {
  onAddAuditEvent: (event: AuditEvent) => void;
}

export const FleetTelemetryScreen: React.FC<FleetTelemetryScreenProps> = ({ onAddAuditEvent }) => {
  const [vehicles, setVehicles] = useState<FLEETVehicleSensor[]>(MOCK_FLEET_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(MOCK_FLEET_VEHICLES[0].vehicleId);
  const [tickCount, setTickCount] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // Simulate live BLE telemetry updates every 5s
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setTickCount((t) => t + 1);
      setVehicles((prev) =>
        prev.map((v) => {
          const drift = (Math.random() - 0.5) * 0.3;
          const newTemp = parseFloat((v.chillerTempCelsius + drift).toFixed(1));
          const clamped = Math.max(1.0, Math.min(10.0, newTemp));
          const newStatus: FLEETVehicleSensor['compressorState'] =
            clamped > 8.5 ? 'warning' : clamped < 1.5 ? 'warning' : 'active';
          const predicted =
            clamped > 7.5 ? Math.floor(20 + Math.random() * 15) :
            clamped < 2.5 ? Math.floor(15 + Math.random() * 10) : null;
          return {
            ...v,
            chillerTempCelsius: clamped,
            compressorState: newStatus,
            predictedBreachMinutes: predicted,
            lastPingSecondsAgo: Math.floor(Math.random() * 20),
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  const selected = vehicles.find((v) => v.vehicleId === selectedVehicleId) ?? vehicles[0];

  const fleetStats = {
    total: vehicles.length,
    optimal: vehicles.filter((v) => v.compressorState === 'active' && !v.predictedBreachMinutes).length,
    warning: vehicles.filter((v) => v.compressorState === 'warning' || v.predictedBreachMinutes !== null).length,
    idle: vehicles.filter((v) => v.compressorState === 'idle').length,
  };

  const tempColor = (temp: number, min: number, max: number) => {
    if (temp < min - 0.5 || temp > max + 0.5) return 'text-rose-400';
    if (temp > max - 0.5 || temp < min + 0.5) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const compressorBadge = (state: FLEETVehicleSensor['compressorState']) => {
    const map = {
      active: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      idle: 'bg-[#1e293b] text-[#94a3b8] border-[#334155]',
      warning: 'bg-amber-950 text-amber-300 border-amber-800',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${map[state]}`}>{state}</span>;
  };

  // Gauge arc SVG helper
  const TempGauge = ({ temp, min, max }: { temp: number; min: number; max: number }) => {
    const range = max - min + 4; // a bit of extra range for visual
    const normalized = Math.max(0, Math.min(1, (temp - (min - 2)) / range));
    const angle = -130 + normalized * 260;
    const rad = (angle * Math.PI) / 180;
    const cx = 60, cy = 60, r = 44;
    const nx = cx + r * Math.cos(rad);
    const ny = cy + r * Math.sin(rad);
    const isOk = temp >= min && temp <= max;
    const needleColor = isOk ? '#10b981' : '#f59e0b';
    return (
      <svg width="120" height="80" viewBox="0 0 120 80">
        {/* Track arc */}
        <path d="M 16 70 A 44 44 0 0 1 104 70" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
        {/* Safe zone arc (approx 2–8°C) */}
        <path d="M 30 57 A 44 44 0 0 1 90 57" fill="none" stroke="#065f46" strokeWidth="8" strokeLinecap="round" />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={needleColor} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill={needleColor} />
        {/* Value */}
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="13" fontWeight="bold" fill={needleColor} fontFamily="monospace">
          {temp.toFixed(1)}°C
        </text>
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="7" fill="#64748b">
          {min}°C – {max}°C
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
            <Bluetooth className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-['Hanken_Grotesk'] flex items-center gap-2">
              BLE Fleet Cold-Chain Telemetry
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Phase 5 · Sprint 5.2
              </span>
            </h1>
            <p className="text-xs text-[#94a3b8]">
              Real-time BLE beacon telemetry from refrigerated pharmacy vans with ML anomaly prediction
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive((l) => !l)}
            className={`h-8 px-3 text-xs font-semibold rounded flex items-center gap-1.5 border transition-colors cursor-pointer ${
              isLive
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : 'bg-[#0d1424] border-[#1e293b] text-[#94a3b8]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-[#64748b]'}`} />
            {isLive ? 'BLE LIVE' : 'PAUSED'}
          </button>
          <button className="h-8 px-3 bg-[#0d1424] border border-[#1e293b] hover:bg-[#1e293b] text-[#cbd5e1] text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-cyan-400" /> Export Cold-Chain Report
          </button>
        </div>
      </div>

      {/* Fleet KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Fleet', value: fleetStats.total, color: 'text-white', icon: Truck },
          { label: 'Temp Optimal', value: fleetStats.optimal, color: 'text-emerald-400', icon: CheckCircle2 },
          { label: 'At Risk / Warning', value: fleetStats.warning, color: 'text-amber-400', icon: AlertTriangle },
          { label: 'Idle / Parked', value: fleetStats.idle, color: 'text-[#94a3b8]', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-3 flex items-center gap-3">
            <Icon className={`w-5 h-5 shrink-0 ${color}`} />
            <div>
              <div className={`text-2xl font-extrabold font-mono ${color}`}>{value}</div>
              <div className="text-[11px] text-[#94a3b8]">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main: Vehicle List + Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Left: Vehicle List */}
        <div className="xl:col-span-2 space-y-1.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Active Fleet Vehicles</h2>
          {vehicles.map((v) => {
            const isWarning = v.compressorState === 'warning' || v.predictedBreachMinutes !== null;
            return (
              <button
                key={v.vehicleId}
                onClick={() => setSelectedVehicleId(v.vehicleId)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedVehicleId === v.vehicleId
                    ? 'bg-cyan-950/30 border-cyan-700/60'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700/60'
                    : 'bg-[#0d1424] border-[#1e293b] hover:border-cyan-800/40'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{v.plateNumber}</span>
                      {v.predictedBreachMinutes !== null && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950 text-red-300 border border-red-800 animate-pulse">
                          BREACH IN {v.predictedBreachMinutes}m
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5 truncate">{v.routeSector}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-extrabold font-mono ${tempColor(v.chillerTempCelsius, v.chillerTargetMinCelsius, v.chillerTargetMaxCelsius)}`}>
                      {v.chillerTempCelsius.toFixed(1)}°C
                    </span>
                    <div className="text-[10px] text-[#64748b]">{v.lastPingSecondsAgo}s ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  {compressorBadge(v.compressorState)}
                  <span className="text-[10px] text-[#64748b] font-mono">{v.bleBeaconId}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Vehicle Detail */}
        <div className="xl:col-span-3 space-y-3">
          {/* Header */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg overflow-hidden">
            <div className="p-4 bg-[#090d16] border-b border-[#1e293b] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">{selected.plateNumber}</h3>
                <p className="text-[11px] text-[#94a3b8]">{selected.driverName} · {selected.routeSector}</p>
              </div>
              <div className="flex items-center gap-2">
                {compressorBadge(selected.compressorState)}
                <span className="text-[10px] text-[#64748b] font-mono">{selected.bleBeaconId}</span>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Temp Gauge */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#64748b] uppercase font-bold mb-2">Chiller Temperature</span>
                <TempGauge
                  temp={selected.chillerTempCelsius}
                  min={selected.chillerTargetMinCelsius}
                  max={selected.chillerTargetMaxCelsius}
                />
                <span className={`text-[11px] font-semibold mt-1 ${
                  selected.chillerTempCelsius >= selected.chillerTargetMinCelsius &&
                  selected.chillerTempCelsius <= selected.chillerTargetMaxCelsius
                    ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {selected.chillerTempCelsius >= selected.chillerTargetMinCelsius &&
                  selected.chillerTempCelsius <= selected.chillerTargetMaxCelsius
                    ? '✓ Within Target Range'
                    : '⚠ Outside Target Range'}
                </span>
              </div>

              {/* Environment info */}
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Ambient Temp', value: `${selected.ambientTempCelsius.toFixed(1)}°C`, color: 'text-amber-400' },
                  { label: 'Chiller Target', value: `${selected.chillerTargetMinCelsius}°C – ${selected.chillerTargetMaxCelsius}°C`, color: 'text-cyan-400' },
                  { label: 'Last BLE Ping', value: `${selected.lastPingSecondsAgo}s ago`, color: 'text-white' },
                  { label: 'Compressor', value: selected.compressorState.toUpperCase(), color: selected.compressorState === 'active' ? 'text-emerald-400' : selected.compressorState === 'warning' ? 'text-amber-400' : 'text-[#94a3b8]' },
                ].map((row) => (
                  <div key={row.label} className="p-2 bg-[#090d16] rounded border border-[#1e293b] flex justify-between">
                    <span className="text-[#64748b]">{row.label}</span>
                    <span className={`font-mono font-semibold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* ML Predictor */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] text-[#64748b] uppercase font-bold mb-3">ML Breach Predictor</span>
                {selected.predictedBreachMinutes !== null ? (
                  <div className="text-center space-y-1.5">
                    <div className="w-16 h-16 rounded-full bg-red-950/60 border-2 border-red-500 flex items-center justify-center mx-auto animate-pulse">
                      <span className="text-lg font-extrabold text-red-300 font-mono">{selected.predictedBreachMinutes}m</span>
                    </div>
                    <div className="text-[11px] text-red-400 font-semibold">Breach Predicted</div>
                    <div className="text-[10px] text-[#94a3b8]">Alert sent to dispatch</div>
                  </div>
                ) : (
                  <div className="text-center space-y-1.5">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/40 border-2 border-emerald-600 flex items-center justify-center mx-auto">
                      <Shield className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold">Compliant</div>
                    <div className="text-[10px] text-[#94a3b8]">No breach risk detected</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mini temp chart (SVG sparkline) */}
          <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Temperature History (Last 60 min)
              </span>
              <span className="text-[10px] font-mono text-[#64748b]">BLE {selected.bleBeaconId} · Tick #{tickCount}</span>
            </div>
            <svg width="100%" height="60" viewBox="0 0 400 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Safe zone band */}
              <rect x="0" y="10" width="400" height="35" fill="#065f46" fillOpacity="0.15" />
              {/* Sparkline path — synthetic data based on current temp */}
              {(() => {
                const base = selected.chillerTempCelsius;
                const pts = Array.from({ length: 20 }, (_, i) => {
                  const x = (i / 19) * 400;
                  const noise = (Math.sin(i * 0.8 + tickCount * 0.3) * 0.6) + (Math.random() - 0.5) * 0.3;
                  const temp = base + noise;
                  const y = 55 - ((temp - 0) / 12) * 55;
                  return `${x},${Math.max(2, Math.min(58, y))}`;
                });
                const pathD = `M ${pts.join(' L ')}`;
                return (
                  <>
                    <path d={`${pathD} L 400,60 L 0,60 Z`} fill="url(#tempGrad)" />
                    <polyline points={pts.join(' ')} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                );
              })()}
              {/* Labels */}
              <text x="2" y="12" fontSize="7" fill="#065f46">8°C</text>
              <text x="2" y="45" fontSize="7" fill="#065f46">2°C</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
