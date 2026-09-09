import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ThermometerSnowflake,
  ShieldCheck,
  Phone,
  MessageSquare,
  Share2,
  FileText,
  AlertTriangle,
  ChevronRight,
  Package,
  Navigation
} from 'lucide-react';
import { DeliveryOrder } from '../../types';

interface DeliveryTrackingModalProps {
  isOpen: boolean;
  order: DeliveryOrder | null;
  onClose: () => void;
  onUpdateInstructions?: (orderId: string, newInstructions: string) => void;
}

export const DeliveryTrackingModal: React.FC<DeliveryTrackingModalProps> = ({
  isOpen,
  order,
  onClose,
  onUpdateInstructions,
}) => {
  const [showInstructionsPrompt, setShowInstructionsPrompt] = useState(false);
  const [customInstructions, setCustomInstructions] = useState(order?.deliveryAddress.instructions || '');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopyTrackingLink = () => {
    navigator.clipboard?.writeText?.(`https://mediwise.health/track/${order.trackingNumber}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveInstructions = () => {
    if (onUpdateInstructions) {
      onUpdateInstructions(order.id, customInstructions);
    }
    setShowInstructionsPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        {/* Amazon-style Tracking Top Bar */}
        <div className="p-4 border-b border-[#1e293b] bg-[#090d16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {order.trackingNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e293b] text-[#cbd5e1] font-mono">
                  {order.orderNumber}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  order.status === 'delivered'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : order.status === 'out_for_delivery'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {order.statusLabel.toUpperCase()}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-['Hanken_Grotesk'] mt-0.5">
                {order.drugName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyTrackingLink}
              className="h-8 px-2.5 bg-[#1e293b] hover:bg-[#334155] text-xs text-[#cbd5e1] hover:text-white rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy secure tracking URL"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied Link!' : 'Share Track'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#64748b] hover:text-white p-1 rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Hero ETA Card (Amazon Style) */}
          <div className="p-5 bg-gradient-to-br from-[#090d16] to-[#0c192e] border border-cyan-500/30 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-cyan-400 font-bold">
                  EXPECTED MEDICAL DELIVERY
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Hanken_Grotesk'] mt-0.5">
                  {order.expectedDeliveryDate}
                </div>
                <div className="text-xs text-[#cbd5e1] flex items-center gap-1.5 mt-1">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Window: <strong className="text-white">{order.expectedDeliveryTimeWindow}</strong></span>
                  {order.deliveryCountdownText && (
                    <span className="text-emerald-400 font-semibold">• {order.deliveryCountdownText}</span>
                  )}
                </div>
              </div>

              {/* Carrier Pill */}
              <div className="bg-[#090d16] p-3 rounded-lg border border-[#1e293b] text-right shrink-0">
                <div className="text-[10px] text-[#94a3b8] uppercase font-mono">Carrier & Partner</div>
                <div className="text-xs font-bold text-white mt-0.5">{order.carrier}</div>
                <div className="text-[11px] text-cyan-300 font-mono mt-0.5">{order.pharmacyPartner}</div>
              </div>
            </div>

            {/* Visual Delivery Stepper Progress Bar (Amazon-Style 5-point bar) */}
            <div className="pt-3 border-t border-[#1e293b]">
              <div className="relative mb-6">
                {/* Horizontal Track Line */}
                <div className="absolute top-3.5 left-4 right-4 h-1 bg-[#1e293b] -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                    style={{
                      width:
                        order.status === 'delivered'
                          ? '100%'
                          : order.status === 'out_for_delivery'
                          ? '75%'
                          : order.status === 'in_transit'
                          ? '50%'
                          : '25%',
                    }}
                  ></div>
                </div>

                {/* 5 Step Icons */}
                <div className="flex justify-between relative z-10">
                  {[
                    { title: 'Ordered', icon: Package, done: true },
                    { title: 'Rx Verified', icon: ShieldCheck, done: true },
                    { title: 'In Transit', icon: Navigation, done: ['in_transit', 'out_for_delivery', 'delivered'].includes(order.status) },
                    { title: 'Out for Delivery', icon: Truck, done: ['out_for_delivery', 'delivered'].includes(order.status), active: order.status === 'out_for_delivery' },
                    { title: 'Delivered', icon: CheckCircle2, done: order.status === 'delivered', active: order.status === 'delivered' },
                  ].map((step, idx) => {
                    const IconComp = step.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center text-center max-w-[80px]">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                            step.done
                              ? 'bg-emerald-500 text-white shadow-md'
                              : step.active
                              ? 'bg-cyan-500 text-white animate-bounce'
                              : 'bg-[#1e293b] text-[#64748b] border border-[#334155]'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[10px] mt-1.5 font-medium leading-tight ${
                          step.done || step.active ? 'text-white' : 'text-[#64748b]'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Active Courier Telemetry Card (if out for delivery) */}
          {order.courier && order.status === 'out_for_delivery' && (
            <div className="p-4 bg-[#090d16] border border-cyan-500/40 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/60 border border-cyan-500 text-cyan-300 flex items-center justify-center font-bold text-sm">
                    {order.courier.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{order.courier.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                        ★ {order.courier.rating} Rated Driver
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94a3b8]">
                      Vehicle: <span className="text-white">{order.courier.vehicle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${order.courier.phone}`}
                    className="h-8 px-2.5 bg-[#1e293b] hover:bg-[#334155] text-white rounded flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Driver</span>
                  </a>
                </div>
              </div>

              {/* Simulated Live Route Checkpoint Map graphic */}
              <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>LIVE VEHICLE GPS TELEMETRY</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {order.courier.stopsAway} STOPS REMAINING
                  </span>
                </div>

                {/* SVG Geolocation Map */}
                <div className="relative rounded overflow-hidden border border-[#1e293b] bg-[#090d16]" style={{ height: '180px' }}>
                  <svg width="100%" height="180" viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg">
                    {/* Map background grid */}
                    <rect width="560" height="180" fill="#060a14" />
                    {/* Grid lines */}
                    {[30,60,90,120,150].map(y => <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#1e293b" strokeWidth="0.5" />)}
                    {[70,140,210,280,350,420,490].map(x => <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#1e293b" strokeWidth="0.5" />)}

                    {/* Road polyline (delivery route) */}
                    <polyline points="40,140 120,130 200,110 280,95 360,80 440,68 520,60"
                      fill="none" stroke="#1e4a6e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="40,140 120,130 200,110 280,95 360,80 440,68 520,60"
                      fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Completed route overlay */}
                    <polyline points="40,140 120,130 200,110 280,95 360,80"
                      fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Waypoint stops */}
                    {[{x:40,y:140,label:'Pharmacy'},{x:200,y:110,label:'Hub'},{x:360,y:80,label:'Check'},{x:520,y:60,label:'Dest'}].map((wp, i) => (
                      <g key={i}>
                        <circle cx={wp.x} cy={wp.y} r="5" fill={i < 3 ? '#10b981' : '#1e293b'} stroke={i < 3 ? '#34d399' : '#475569'} strokeWidth="1.5" />
                        <text x={wp.x} y={wp.y + 16} textAnchor="middle" fontSize="8" fill="#64748b">{wp.label}</text>
                      </g>
                    ))}

                    {/* Courier vehicle pin (animated) */}
                    <g>
                      <circle cx="360" cy="80" r="12" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2">
                        <animate attributeName="r" values="12;15;12" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="360" cy="80" r="5" fill="#38bdf8" />
                      {/* Heading arrow */}
                      <polygon points="360,67 364,75 356,75" fill="#38bdf8" />
                    </g>

                    {/* Destination pin */}
                    <g>
                      <circle cx="520" cy="60" r="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="520" cy="60" r="3" fill="#f59e0b" />
                      <line x1="520" y1="52" x2="520" y2="40" stroke="#f59e0b" strokeWidth="1.5" />
                      <rect x="520" y="32" width="26" height="10" rx="2" fill="#78350f" />
                      <text x="533" y="40" textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="bold">DEST</text>
                    </g>

                    {/* ETA badge */}
                    <rect x="8" y="8" width="90" height="22" rx="4" fill="#0c2d50" stroke="#0284c7" strokeWidth="1" />
                    <text x="14" y="17" fontSize="7" fill="#94a3b8">ETA</text>
                    <text x="14" y="26" fontSize="9" fill="#38bdf8" fontWeight="bold">{order.expectedDeliveryTimeWindow}</text>
                  </svg>
                  <div className="absolute bottom-2 right-2 text-[9px] font-mono text-cyan-500/70">Phase 3 · Courier Geolocation</div>
                </div>

                <p className="text-[11px] text-[#cbd5e1] mt-2">
                  Current Location: <strong className="text-white">{order.courier.currentLocationName}</strong>
                </p>
                <div className="mt-1.5 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full animate-pulse" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Proof of Delivery Card (if delivered) */}
          {order.proofOfDelivery && order.status === 'delivered' && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-['Hanken_Grotesk']">
                <CheckCircle2 className="w-4 h-4" />
                <span>OFFICIAL PROOF OF DELIVERY & ePHI ATTESTATION</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#cbd5e1] pt-1">
                <div>
                  <span className="text-[#94a3b8] block">Delivered At:</span>
                  <strong className="text-white font-mono">{order.proofOfDelivery.deliveredAt}</strong>
                </div>
                <div>
                  <span className="text-[#94a3b8] block">Received & Signed By:</span>
                  <strong className="text-white">{order.proofOfDelivery.signedBy}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#94a3b8] block">Verification Standard:</span>
                  <span className="font-mono text-cyan-300">{order.proofOfDelivery.verificationMethod}</span>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Cold-Chain & Package Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cold Chain Sensor */}
            <div className="p-3.5 bg-[#090d16] border border-[#1e293b] rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-white uppercase font-['Hanken_Grotesk'] flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
                  <span>Cold-Chain IoT Logger</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                  TEMP OPTIMAL
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-cyan-300 font-mono">
                  {order.coldChain.currentTempCelsius?.toFixed(1)}°C
                </span>
                <span className="text-[11px] text-[#94a3b8]">
                  Target: {order.coldChain.targetRange}
                </span>
              </div>
              <div className="text-[10px] text-[#94a3b8] font-mono">
                Security Seal: {order.coldChain.fipsSealNumber || 'FIPS-140 VERIFIED'}
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-3.5 bg-[#090d16] border border-[#1e293b] rounded-lg space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-white uppercase font-['Hanken_Grotesk'] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Delivery Address</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowInstructionsPrompt(!showInstructionsPrompt)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Update Notes
                </button>
              </div>
              <div className="text-xs text-white font-medium">
                {order.deliveryAddress.recipientName}
              </div>
              <div className="text-[11px] text-[#cbd5e1]">
                {order.deliveryAddress.street}, {order.deliveryAddress.aptSuite && `${order.deliveryAddress.aptSuite}, `}
                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </div>
              <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">
                Note: "{order.deliveryAddress.instructions}"
              </div>
            </div>
          </div>

          {/* Edit Instructions Subform */}
          {showInstructionsPrompt && (
            <div className="p-3 bg-[#0d1424] border border-[#334155] rounded-lg space-y-2">
              <label className="text-xs font-bold text-white block">
                Update Instructions for Medical Courier:
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Leave with building doorman, ring intercom 4B..."
                className="w-full h-8 px-2.5 bg-[#090d16] border border-[#334155] rounded text-white text-xs outline-none focus:border-cyan-400"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowInstructionsPrompt(false)}
                  className="px-2.5 py-1 text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveInstructions}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xs"
                >
                  Save Instructions
                </button>
              </div>
            </div>
          )}

          {/* Full Detailed Tracking Activity Timeline */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-white uppercase font-['Hanken_Grotesk'] tracking-wider block">
              Shipment Activity & Custody Chain History
            </span>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1e293b]">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="relative pl-6 space-y-0.5">
                  <div
                    className={`absolute left-0.5 top-1 w-3 h-3 rounded-full border-2 ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-400'
                        : item.isCurrent
                        ? 'bg-cyan-400 border-white animate-ping'
                        : 'bg-[#090d16] border-[#475569]'
                    }`}
                  ></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className={`text-xs font-bold ${item.completed ? 'text-white' : item.isCurrent ? 'text-cyan-300 font-semibold' : 'text-[#64748b]'}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#94a3b8]">
                      {item.timestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#94a3b8]">
                    {item.location}
                  </div>

                  {item.note && (
                    <div className="p-2 bg-[#090d16] border border-[#1e293b] rounded text-[10px] text-[#cbd5e1] font-mono mt-1">
                      {item.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1e293b] bg-[#090d16] flex justify-between items-center">
          <div className="text-[11px] text-[#94a3b8] font-mono">
            Shipment ID: <strong className="text-white">{order.id}</strong> • Encrypted FHIR Tracking
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
