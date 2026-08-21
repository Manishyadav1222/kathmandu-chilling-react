import { useState, useMemo } from 'react';
import { buildWhatsAppLink } from '../data/content';
import { WhatsAppIcon } from './Hero.jsx';
import { useReveal } from '../hooks/useReveal';
import { useAdminData } from '../context/AdminDataContext.jsx';

const COMMODITIES = [
  { id: 'dairy', name: 'Fresh Milk & Dairy', targetTemp: 3, pufBase: 100, hpPerTon: 0.22, color: '#35d6ff' },
  { id: 'apples', name: 'Apples & Fruits (Agro)', targetTemp: 1, pufBase: 100, hpPerTon: 0.20, color: '#3cd070' },
  { id: 'meat', name: 'Frozen Meat & Poultry', targetTemp: -20, pufBase: 150, hpPerTon: 0.35, color: '#ff7a45' },
  { id: 'pharma', name: 'Vaccines & Pharmaceuticals', targetTemp: 4, pufBase: 120, hpPerTon: 0.25, color: '#a855f7' },
  { id: 'icecream', name: 'Hard Ice Cream & Gelato', targetTemp: -25, pufBase: 150, hpPerTon: 0.40, color: '#ec4899' },
  { id: 'potato', name: 'Potatoes & Vegetables', targetTemp: 8, pufBase: 80, hpPerTon: 0.16, color: '#eab308' },
];

export default function ColdCalculator() {
  const headReveal = useReveal();
  const [selectedCommodity, setSelectedCommodity] = useState(COMMODITIES[0]);
  const [capacityTons, setCapacityTons] = useState(25);
  const [roomHeight, setRoomHeight] = useState(10); // in feet
  const [ambientPeak, setAmbientPeak] = useState('summer'); // 'summer' (40C) | 'moderate' (30C)

  const calc = useMemo(() => {
    const ambientTemp = ambientPeak === 'summer' ? 42 : 32;
    const deltaT = ambientTemp - selectedCommodity.targetTemp;

    // Approximate floor area needed in sq. ft (approx 6-8 sq ft per MT for standard stacking)
    const floorAreaSqFt = Math.round(capacityTons * 7.5);
    const lengthFt = Math.round(Math.sqrt(floorAreaSqFt * 1.3));
    const widthFt = Math.round(floorAreaSqFt / lengthFt);

    // Recommended PUF thickness
    let pufThickness = selectedCommodity.pufBase;
    if (ambientPeak === 'summer' && selectedCommodity.targetTemp < 0) {
      pufThickness = Math.max(150, pufThickness);
    }

    // Required refrigeration capacity (HP)
    const baseHp = capacityTons * selectedCommodity.hpPerTon;
    const ambientMultiplier = ambientPeak === 'summer' ? 1.25 : 1.0;
    const totalHp = Math.max(2, Math.round(baseHp * ambientMultiplier * 10) / 10);

    // Daily power consumption (kWh) with high-efficiency Inverter Scroll compressor
    const dailyKwh = Math.round(totalHp * 0.746 * 14 * 0.75); // running ~14 hrs/day at 75% load
    const standardKwh = Math.round(dailyKwh * 1.38); // non-inverter unit uses 38% more
    const rateNpr = 12.5; // average industrial electricity rate in Nepal per unit

    const monthlyCostNpr = Math.round(dailyKwh * 30 * rateNpr);
    const monthlySavingsNpr = Math.round((standardKwh - dailyKwh) * 30 * rateNpr);
    const annualSavingsNpr = monthlySavingsNpr * 12;

    return {
      floorAreaSqFt,
      lengthFt,
      widthFt,
      pufThickness,
      totalHp,
      dailyKwh,
      monthlyCostNpr,
      monthlySavingsNpr,
      annualSavingsNpr,
      deltaT,
    };
  }, [selectedCommodity, capacityTons, roomHeight, ambientPeak]);

  const waMessage = `Hi Kathmandu Chilling, I used your Cold Room Engineering Calculator for ${selectedCommodity.name} (${capacityTons} MT capacity, Target Temp ${selectedCommodity.targetTemp}°C). Calculated specs: ${calc.pufThickness}mm PUF, ${calc.totalHp} HP unit, ~${calc.floorAreaSqFt} sq ft. Please provide a formal quotation and layout drawing.`;
  const waLink = buildWhatsAppLink(waMessage);

  return (
    <section className="calculator-section" id="calculator">
      <div className="wrap">
        <div className="section-head reveal" ref={headReveal}>
          <div className="eyebrow">Smart Engineering Tool</div>
          <h2>Cold Room Capacity &amp; Energy ROI Calculator</h2>
          <p>
            Estimate required PUF insulation thickness, compressor refrigeration tonnage (HP), and
            monthly electricity savings for your cold storage in Nepal.
          </p>
        </div>

        <div className="calc-container">
          {/* Left Column: Inputs & Commodity Selection */}
          <div className="calc-inputs-col">
            <div className="calc-group">
              <label className="calc-label">1. Select Product / Storage Commodity</label>
              <div className="commodity-grid">
                {COMMODITIES.map((c) => (
                  <button
                    key={c.id}
                    className={`commodity-btn ${selectedCommodity.id === c.id ? 'active' : ''}`}
                    onClick={() => setSelectedCommodity(c)}
                    style={{
                      borderColor: selectedCommodity.id === c.id ? c.color : 'var(--line)',
                    }}
                  >
                    <span className="comm-name">{c.name}</span>
                    <span className="comm-temp mono">{c.targetTemp > 0 ? `+${c.targetTemp}°C` : `${c.targetTemp}°C`}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-group">
              <div className="calc-label-row">
                <label className="calc-label">2. Storage Capacity (Metric Tons)</label>
                <span className="calc-val-badge mono">{capacityTons} MT</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={capacityTons}
                onChange={(e) => setCapacityTons(Number(e.target.value))}
                className="calc-range-slider"
              />
              <div className="calc-ticks mono">
                <span>5 MT (Small)</span>
                <span>50 MT (Medium Hub)</span>
                <span>100 MT</span>
                <span>200 MT (Commercial)</span>
              </div>
            </div>

            <div className="calc-group">
              <label className="calc-label">3. Ambient Climate &amp; Location Condition in Nepal</label>
              <div className="climate-toggle-row">
                <button
                  className={`climate-btn ${ambientPeak === 'summer' ? 'active' : ''}`}
                  onClick={() => setAmbientPeak('summer')}
                >
                  ☀️ Terai / Summer Peak (38°C – 44°C)
                </button>
                <button
                  className={`climate-btn ${ambientPeak === 'moderate' ? 'active' : ''}`}
                  onClick={() => setAmbientPeak('moderate')}
                >
                  🏔️ Kathmandu Valley / Hilly (25°C – 32°C)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Engineering Output & Energy ROI */}
          <div className="calc-results-col">
            <div className="results-card">
              <div className="results-head">
                <div className="r-badge-row mono">
                  <span className="r-badge">ESTIMATED ENGINEERING SPECIFICATION</span>
                </div>
                <h3>{capacityTons} MT {selectedCommodity.name} Cold Room</h3>
              </div>

              {/* Specs Grid */}
              <div className="r-specs-grid">
                <div className="r-spec-box">
                  <span className="r-spec-lbl">Recommended PUF</span>
                  <strong className="r-spec-val">{calc.pufThickness} mm</strong>
                  <span className="r-spec-sub">Density 42 kg/m³</span>
                </div>
                <div className="r-spec-box">
                  <span className="r-spec-lbl">Compressor Capacity</span>
                  <strong className="r-spec-val">{calc.totalHp} HP</strong>
                  <span className="r-spec-sub">Bitzer / Copeland Scroll</span>
                </div>
                <div className="r-spec-box">
                  <span className="r-spec-lbl">Estimated Footprint</span>
                  <strong className="r-spec-val">~{calc.floorAreaSqFt} sq ft</strong>
                  <span className="r-spec-sub">{calc.lengthFt}ft × {calc.widthFt}ft ({roomHeight}ft H)</span>
                </div>
                <div className="r-spec-box">
                  <span className="r-spec-lbl">Target Temperature</span>
                  <strong className="r-spec-val" style={{ color: selectedCommodity.color }}>
                    {selectedCommodity.targetTemp > 0 ? `+${selectedCommodity.targetTemp}°C` : `${selectedCommodity.targetTemp}°C`}
                  </strong>
                  <span className="r-spec-sub">ΔT: {calc.deltaT}°C Differential</span>
                </div>
              </div>

              {/* Energy Savings & Financial ROI */}
              <div className="r-energy-roi-box">
                <div className="roi-head">
                  <span className="roi-icon">⚡</span>
                  <strong>High-Efficiency Power Calculation</strong>
                </div>
                <div className="roi-metrics-row">
                  <div>
                    <span className="roi-sub">Estimated Monthly Power</span>
                    <strong className="roi-num mono">NPR {calc.monthlyCostNpr.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="roi-sub">Monthly Power Savings</span>
                    <strong className="roi-num green mono">NPR {calc.monthlySavingsNpr.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="roi-annual-tag">
                  <span>💰 Estimated Annual Energy Savings: <strong>NPR {calc.annualSavingsNpr.toLocaleString()} / year</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="r-actions-row">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn whatsapp r-wa-btn"
                  onClick={() => {
                    if (addInquiry) {
                      addInquiry({
                        name: 'Calculator Quote Visitor',
                        phone: 'Via WhatsApp Sizing Export',
                        interest: `${selectedCommodity.name} (${capacityTons} MT)`,
                        district: ambientPeak === 'summer' ? 'Terai / Lowlands' : 'Kathmandu Valley / Mid-Hills',
                        details: `Spec: ${calc.pufThickness}mm PUF, ${calc.compressorHp} HP compressor, ${calc.volumeSqFt} sq. ft floor area. Est Monthly savings: NPR ${calc.monthlySavingsNpr.toLocaleString()}.`,
                      });
                    }
                  }}
                >
                  <WhatsAppIcon size={18} /> Send Spec to WhatsApp for Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
