import React, { useState } from 'react';
import {
  X,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ThermometerSnowflake,
  CreditCard,
  Building2,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { DrugItem, DeliveryOrder, DeliverySpeed, DeliveryAddress } from '../../types';
import { DEFAULT_DELIVERY_ADDRESS } from '../../data/mockDeliveries';

interface OrderDeliveryModalProps {
  isOpen: boolean;
  drug: DrugItem | null;
  onClose: () => void;
  onConfirmOrder: (order: DeliveryOrder) => void;
  userEmail?: string;
  userName?: string;
}

export const OrderDeliveryModal: React.FC<OrderDeliveryModalProps> = ({
  isOpen,
  drug,
  onClose,
  onConfirmOrder,
  userName = 'Om Patil',
}) => {
  const [selectedSpeed, setSelectedSpeed] = useState<DeliverySpeed>('same_day');
  const [selectedPartner, setSelectedPartner] = useState<string>(drug?.partnerOffers[0]?.partnerName || 'Tata 1mg');
  const [quantity, setQuantity] = useState<number>(1);
  const [address, setAddress] = useState<DeliveryAddress>({
    ...DEFAULT_DELIVERY_ADDRESS,
    recipientName: userName || 'Om Patil',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !drug) return null;

  // Selected offer
  const activeOffer = drug.partnerOffers.find((o) => o.partnerName === selectedPartner) || drug.partnerOffers[0];
  const unitPrice = activeOffer?.price || drug.genericPriceAvg;
  const subtotal = unitPrice * quantity;
  const originalBrandedTotal = drug.brandPrice * quantity;
  const totalSavings = originalBrandedTotal - subtotal;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const now = new Date();
      const orderDateStr = now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

      let expectedDate = 'Tomorrow, Sep 9';
      let expectedWindow = 'By 2:00 PM';
      let speedLabel = '🚀 Next-Day Express Delivery';
      let status: DeliveryOrder['status'] = 'pharmacist_verified';

      if (selectedSpeed === 'same_day') {
        expectedDate = 'Today, Sep 8';
        expectedWindow = '5:00 PM – 7:30 PM';
        speedLabel = '⚡ Same-Day Priority Cold-Chain';
        status = 'out_for_delivery';
      } else if (selectedSpeed === 'in_store_pickup') {
        expectedDate = 'Today in 45 mins';
        expectedWindow = 'Ready by 1:30 PM';
        speedLabel = '🏥 45-Minute In-Store Pickup';
        status = 'pharmacist_verified';
      }

      const newOrder: DeliveryOrder = {
        id: `deliv-${Date.now()}`,
        orderNumber: `ORD-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        trackingNumber: `FDX-COLD-${Math.floor(1000000 + Math.random() * 9000000)}`,
        drugId: drug.id,
        drugName: `${drug.brandName} (${drug.activeSalt})`,
        activeSalt: drug.activeSalt,
        dosageForm: drug.dosageForm,
        quantity: quantity,
        pharmacyPartner: selectedPartner,
        carrier: 'FedEx HealthCare Priority Cold-Chain',
        deliverySpeed: selectedSpeed,
        deliverySpeedLabel: speedLabel,
        status: status,
        statusLabel: status === 'out_for_delivery' ? 'Out for Delivery' : 'Prescription Verified & Packing',
        orderDate: orderDateStr,
        expectedDeliveryDate: expectedDate,
        expectedDeliveryTimeWindow: expectedWindow,
        deliveryCountdownText: selectedSpeed === 'same_day' ? 'Arriving today in ~2.5 hrs' : 'Guaranteed Delivery Tomorrow',
        deliveryAddress: address,
        unitPrice: unitPrice,
        totalPrice: subtotal,
        savingsAmount: totalSavings,
        shippingFee: 0.00,
        coldChain: {
          required: true,
          currentTempCelsius: 4.2,
          targetRange: '2.0°C – 8.0°C',
          sensorStatus: 'optimal',
          fipsSealNumber: `FIPS-140-SEAL-${Math.floor(10000 + Math.random() * 90000)}`,
        },
        timeline: [
          {
            step: 1,
            label: 'Order Placed & Digital Rx Verification',
            timestamp: 'Just now',
            location: 'MediWise Operations Gateway',
            completed: true,
            note: 'Bioequivalent generic parity verified (FDA AB standard).',
          },
          {
            step: 2,
            label: 'Pharmacist Inspection & FIPS Cold-Chain Seal',
            timestamp: 'In Progress',
            location: `${selectedPartner} Fulfillment Center`,
            completed: selectedSpeed === 'same_day',
            isCurrent: selectedSpeed !== 'same_day',
            note: 'NDC verification & calibrated temperature logger activated.',
          },
          {
            step: 3,
            label: 'Courier Dispatched & Route Optimization',
            timestamp: selectedSpeed === 'same_day' ? 'Scheduled Today 3:00 PM' : 'Tomorrow Morning',
            location: 'Regional Logistics Center',
            completed: false,
            isCurrent: selectedSpeed === 'same_day',
          },
          {
            step: 4,
            label: 'Out for Delivery to Recipient',
            timestamp: expectedDate,
            location: address.city,
            completed: false,
          },
          {
            step: 5,
            label: 'Delivered & Signed',
            timestamp: expectedWindow,
            location: `${address.street}, ${address.aptSuite || ''}`,
            completed: false,
          },
        ],
        courier: {
          name: 'Marco Diaz',
          phone: '(408) 555-8371',
          vehicle: 'Cold-Chain EV Van #42',
          stopsAway: 5,
          currentLocationName: 'Entering San Jose Metro District',
          rating: 4.96,
        },
      };

      onConfirmOrder(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        {/* Amazon-style Header */}
        <div className="p-4 border-b border-[#1e293b] bg-[#090d16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-['Hanken_Grotesk']">
                  Order Bioequivalent Generic Refill
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                  FREE PRIME DISPATCH
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Prescription fulfillment via certified partner pharmacies • Continuous cold-chain tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-white p-1 rounded hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Medication Highlight Card */}
          <div className="p-4 bg-[#090d16] border border-[#1e293b] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-['Hanken_Grotesk']">
                  {drug.brandName}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono">
                  FDA AB {drug.parityPercent}% Parity
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Generic: <strong className="text-white">{drug.activeSalt}</strong> • {drug.dosageForm}
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>You save ₹{(drug.brandPrice - unitPrice).toFixed(2)} ({drug.savingsPercent}%) vs branded retail</span>
              </div>
            </div>

            {/* Quantity Selector & Price */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1e293b]">
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  ₹{subtotal.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#64748b] block line-through font-mono">
                  ₹{originalBrandedTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-[#94a3b8]">Qty (Months):</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="h-7 px-2 bg-[#0d1424] border border-[#334155] rounded text-white text-xs font-mono outline-none cursor-pointer"
                >
                  <option value={1}>1 (30 Days)</option>
                  <option value={2}>2 (60 Days)</option>
                  <option value={3}>3 (90 Days - Best Value)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amazon-style Delivery Speed Options */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white uppercase font-['Hanken_Grotesk'] tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Choose Delivery Speed & Schedule</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> Order within 2h 45m for same-day
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Same Day */}
              <div
                onClick={() => setSelectedSpeed('same_day')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedSpeed === 'same_day'
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-sm'
                    : 'bg-[#090d16] border-[#1e293b] hover:border-[#334155]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span className="text-cyan-400">⚡ Same-Day Priority</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">FREE Prime</span>
                </div>
                <div className="text-[11px] text-[#cbd5e1] font-medium">
                  Arrives <strong className="text-white">Today, Sep 8</strong> by 7:30 PM
                </div>
                <div className="text-[10px] text-[#94a3b8] mt-1 flex items-center gap-1">
                  <ThermometerSnowflake className="w-3 h-3 text-cyan-400" />
                  <span>Refrigerated 2°C–8°C thermal insulation</span>
                </div>
              </div>

              {/* Option 2: Next Day */}
              <div
                onClick={() => setSelectedSpeed('next_day')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedSpeed === 'next_day'
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-sm'
                    : 'bg-[#090d16] border-[#1e293b] hover:border-[#334155]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span className="text-emerald-400">🚀 Next-Day Express</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">FREE</span>
                </div>
                <div className="text-[11px] text-[#cbd5e1] font-medium">
                  Arrives <strong className="text-white">Tomorrow, Sep 9</strong> by 2:00 PM
                </div>
                <div className="text-[10px] text-[#94a3b8] mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Guaranteed morning delivery slot</span>
                </div>
              </div>

              {/* Option 3: Standard Delivery */}
              <div
                onClick={() => setSelectedSpeed('standard')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedSpeed === 'standard'
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-sm'
                    : 'bg-[#090d16] border-[#1e293b] hover:border-[#334155]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span>📦 Standard Medical Saver</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">FREE</span>
                </div>
                <div className="text-[11px] text-[#cbd5e1] font-medium">
                  Arrives in 2–3 Business Days
                </div>
                <div className="text-[10px] text-[#94a3b8] mt-1">
                  Climate-controlled protective shipper
                </div>
              </div>

              {/* Option 4: Store Pickup */}
              <div
                onClick={() => setSelectedSpeed('in_store_pickup')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedSpeed === 'in_store_pickup'
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-sm'
                    : 'bg-[#090d16] border-[#1e293b] hover:border-[#334155]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span className="text-amber-400">🏥 In-Store Pickup</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">READY IN 45M</span>
                </div>
                <div className="text-[11px] text-[#cbd5e1] font-medium">
                  Ready <strong className="text-white">Today</strong> at Apollo / CVS Hub
                </div>
                <div className="text-[10px] text-[#94a3b8] mt-1">
                  Pick up at counter with barcode ID
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white uppercase font-['Hanken_Grotesk'] tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Delivery Address & Gate Instructions</span>
              </label>
              <button
                type="button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
              >
                {isEditingAddress ? 'Save Address' : 'Edit Address'}
              </button>
            </div>

            {isEditingAddress ? (
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded-lg space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-0.5">Recipient Full Name</label>
                    <input
                      type="text"
                      value={address.recipientName}
                      onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
                      className="w-full h-8 px-2 bg-[#0d1424] border border-[#334155] rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-0.5">Phone Number</label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full h-8 px-2 bg-[#0d1424] border border-[#334155] rounded text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#94a3b8] block mb-0.5">Street Address & Apartment</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full h-8 px-2 bg-[#0d1424] border border-[#334155] rounded text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-0.5">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full h-8 px-2 bg-[#0d1424] border border-[#334155] rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-0.5">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full h-8 px-2 bg-[#0d1424] border border-[#334155] rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94a3b8] block mb-0.5">Zip Code</label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-full h-8 px-2 bg-[#0d1424] border border-[#334155] rounded text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#94a3b8] block mb-0.5">Delivery Instructions (Gate code, concierge)</label>
                  <input
                    type="text"
                    value={address.instructions}
                    onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                    className="w-full h-8 px-2 bg-[#0d1424] border border-[#334155] rounded text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#090d16] border border-[#1e293b] rounded-lg flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">
                    {address.recipientName} • <span className="font-mono text-[#94a3b8]">{address.phone}</span>
                  </div>
                  <div className="text-[#cbd5e1] text-[11px]">
                    {address.street}, {address.aptSuite && `${address.aptSuite}, `}{address.city}, {address.state} {address.zipCode}
                  </div>
                  <div className="text-[10px] text-cyan-300/80 font-mono">
                    Instructions: "{address.instructions}"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fulfillment Partner Pharmacy Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white uppercase font-['Hanken_Grotesk'] tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accredited Dispensing Pharmacy Network</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {drug.partnerOffers.map((offer) => (
                <div
                  key={offer.partnerName}
                  onClick={() => setSelectedPartner(offer.partnerName)}
                  className={`p-2.5 rounded border text-left cursor-pointer transition-all ${
                    selectedPartner === offer.partnerName
                      ? 'bg-[#1e293b] border-cyan-400 shadow-sm'
                      : 'bg-[#090d16] border-[#1e293b] hover:border-[#334155]'
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">{offer.partnerName}</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">₹{offer.price.toFixed(2)}</div>
                  <div className="text-[10px] text-[#94a3b8]">{offer.delivery}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cold-Chain & HIPAA Security Guarantee */}
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-lg flex items-start gap-2.5 text-[11px] text-cyan-200">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Cold-Chain Temperature Assurance:</span> Shipped in validated vacuum-insulated VIP packaging with an active Bluetooth/Cellular IoT temperature logger maintaining 2.0°C to 8.0°C. Verified upon delivery via tamper-evident FIPS barcode.
            </div>
          </div>
        </div>

        {/* Modal Footer: Summary & Place Order */}
        <div className="p-4 border-t border-[#1e293b] bg-[#090d16] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-left w-full sm:w-auto">
            <div className="text-xs text-[#94a3b8]">
              Total Payment (Includes Free Prime Shipping):
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">
                ₹{subtotal.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                (Saved ₹{totalSavings.toFixed(2)})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#94a3b8] hover:text-white rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Prescription Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
