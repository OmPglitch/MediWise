import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
  Sparkles,
  MapPin,
  FileText,
  RotateCcw,
  ThermometerSnowflake,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';
import { DeliveryOrder, DrugItem } from '../../types';

interface DeliveryManagementScreenProps {
  deliveries: DeliveryOrder[];
  drugs: DrugItem[];
  onTrackOrder: (order: DeliveryOrder) => void;
  onReorderDrug: (drugId: string) => void;
  onOpenDoctorSlip: (drug: DrugItem) => void;
  onNavigateToCatalog: () => void;
}

export const DeliveryManagementScreen: React.FC<DeliveryManagementScreenProps> = ({
  deliveries,
  drugs,
  onTrackOrder,
  onReorderDrug,
  onOpenDoctorSlip,
  onNavigateToCatalog,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'active'
        ? ['order_placed', 'pharmacist_verified', 'in_transit', 'out_for_delivery'].includes(d.status)
        : d.status === 'delivered';

    const matchesSearch =
      d.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pharmacyPartner.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate high-level stats
  const activeCount = deliveries.filter((d) => ['order_placed', 'pharmacist_verified', 'in_transit', 'out_for_delivery'].includes(d.status)).length;
  const totalSavings = deliveries.reduce((acc, curr) => acc + curr.savingsAmount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white font-['Hanken_Grotesk'] leading-tight">
              Your Medicine Orders & Prescriptions
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
              AMAZON-STYLE LIVE TRACKING
            </span>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Real-time fulfillment tracking, guaranteed delivery windows, and certified temperature monitoring
          </p>
        </div>

        <button
          onClick={onNavigateToCatalog}
          className="h-8 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Order Generic Refill</span>
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded-lg">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-mono">ACTIVE SHIPMENTS</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{activeCount}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">1 Out for Delivery Today</div>
        </div>

        <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded-lg">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-mono">TOTAL GENERIC SAVINGS</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">₹{totalSavings.toFixed(2)}</div>
          <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">Average 89.2% price reduction</div>
        </div>

        <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded-lg">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-mono">COLD-CHAIN COMPLIANCE</span>
            <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">100%</div>
          <div className="text-[10px] text-cyan-400 font-mono mt-0.5">All sensors within 2°C–8°C</div>
        </div>

        <div className="p-3 bg-[#0d1424] border border-[#1e293b] rounded-lg">
          <div className="flex items-center justify-between text-[#94a3b8] mb-1">
            <span className="text-[11px] font-mono">SHIPPING BENEFIT</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">FREE PRIME</div>
          <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">Unlimited Same-Day & Next-Day</div>
        </div>
      </div>

      {/* Active Alert Banner for Out-for-Delivery Item */}
      {deliveries.some((d) => d.status === 'out_for_delivery') && (
        <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-[#0d1424] border border-cyan-500/50 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-900/80 border border-cyan-400 text-cyan-300 flex items-center justify-center animate-pulse shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-['Hanken_Grotesk']">
                  Package Out for Delivery Today!
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  4 STOPS AWAY
                </span>
              </div>
              <p className="text-xs text-[#cbd5e1] mt-0.5">
                Lipitor 20mg (Atorvastatin Generic) • Expected between <strong className="text-white">1:00 PM – 3:30 PM</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const active = deliveries.find((d) => d.status === 'out_for_delivery');
              if (active) onTrackOrder(active);
            }}
            className="h-8 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <span>Track Live Package</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0d1424] border border-[#1e293b] rounded-lg p-3 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#090d16] p-1 rounded border border-[#1e293b]">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filterStatus === 'all' ? 'bg-[#1e293b] text-white font-semibold' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            All Orders ({deliveries.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filterStatus === 'active' ? 'bg-[#1e293b] text-cyan-300 font-semibold' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            In Transit ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              filterStatus === 'delivered' ? 'bg-[#1e293b] text-emerald-300 font-semibold' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Delivered ({deliveries.filter((d) => d.status === 'delivered').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by medicine or ID..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-[#090d16] border border-[#1e293b] rounded text-white placeholder-[#64748b] focus:border-[#0284c7] outline-none"
          />
        </div>
      </div>

      {/* Orders List (Amazon-Style Package Cards) */}
      <div className="space-y-4">
        {filteredDeliveries.map((order) => {
          const correspondingDrug = drugs.find((d) => d.id === order.drugId);

          return (
            <div
              key={order.id}
              className="bg-[#0d1424] border border-[#1e293b] rounded-xl overflow-hidden shadow-md hover:border-[#334155] transition-all"
            >
              {/* Amazon Order Top Metadata Strip */}
              <div className="bg-[#090d16] px-5 py-3 border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <span className="text-[10px] uppercase text-[#64748b] font-mono block">ORDER PLACED</span>
                    <span className="font-medium text-[#cbd5e1]">{order.orderDate.split(' ')[0]}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#64748b] font-mono block">TOTAL</span>
                    <span className="font-bold text-white font-mono">₹{order.totalPrice.toFixed(2)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#64748b] font-mono block">SHIP TO</span>
                    <span className="font-medium text-cyan-300">{order.deliveryAddress.recipientName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#64748b] font-mono block">ORDER # {order.orderNumber}</span>
                    <span className="text-[11px] font-mono text-[#94a3b8]">Track: {order.trackingNumber}</span>
                  </div>
                </div>
              </div>

              {/* Order Card Main Body */}
              <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                {/* Left: Product & ETA */}
                <div className="space-y-2 flex-1">
                  {/* Delivery Status Big Headline */}
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-extrabold font-['Hanken_Grotesk'] ${
                      order.status === 'delivered' ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {order.status === 'delivered'
                        ? `Delivered ${order.expectedDeliveryDate}`
                        : `Arriving ${order.expectedDeliveryDate}`}
                    </span>
                    <span className="text-xs text-[#94a3b8] font-mono">
                      ({order.expectedDeliveryTimeWindow})
                    </span>
                  </div>

                  {order.deliveryCountdownText && (
                    <div className="text-xs text-cyan-400 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{order.deliveryCountdownText}</span>
                    </div>
                  )}

                  {/* Drug Info */}
                  <div className="flex items-start gap-3 pt-2">
                    <div className="w-10 h-10 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-center text-cyan-400 shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Hanken_Grotesk']">
                        {order.drugName}
                      </h4>
                      <p className="text-xs text-[#94a3b8]">
                        {order.dosageForm} • Qty: {order.quantity} (30-day refill)
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px]">
                        <span className="text-[#94a3b8]">Dispensary: <strong className="text-white">{order.pharmacyPartner}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono font-semibold">Saved ₹{order.savingsAmount.toFixed(2)}</span>
                        {order.coldChain.required && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono flex items-center gap-1">
                            <ThermometerSnowflake className="w-2.5 h-2.5" />
                            <span>{order.coldChain.currentTempCelsius?.toFixed(1)}°C Cold-Chain</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Amazon-style Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-48 shrink-0">
                  <button
                    onClick={() => onTrackOrder(order)}
                    className="w-full h-8 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Package</span>
                  </button>

                  <button
                    onClick={() => onReorderDrug(order.drugId)}
                    className="w-full h-8 bg-[#090d16] hover:bg-[#1e293b] border border-[#1e293b] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buy Again / Refill</span>
                  </button>

                  {correspondingDrug && (
                    <button
                      onClick={() => onOpenDoctorSlip(correspondingDrug)}
                      className="w-full h-8 bg-[#090d16] hover:bg-[#1e293b] border border-[#1e293b] text-[#cbd5e1] text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Doctor Slip (PDF)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Step Bar Sneak-Peek */}
              <div className="px-5 py-2.5 bg-[#090d16]/70 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-[#94a3b8]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Deliver to: {order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                </div>
                <div className="font-mono text-cyan-300">
                  Carrier: {order.carrier}
                </div>
              </div>
            </div>
          );
        })}

        {filteredDeliveries.length === 0 && (
          <div className="p-12 text-center bg-[#0d1424] border border-[#1e293b] rounded-xl space-y-3">
            <Package className="w-10 h-10 text-[#64748b] mx-auto" />
            <h3 className="text-base font-bold text-white">No matching orders found</h3>
            <p className="text-xs text-[#94a3b8]">
              Try searching with another medication name, order number, or reset the status filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
