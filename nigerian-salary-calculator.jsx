import React, { useState, useRef } from 'react';
import { DollarSign, Download, TrendingUp, ArrowRight, Lock, Check, Calculator, FileText, GitCompare, BarChart3, Sparkles, Calendar } from 'lucide-react';

// Nigerian Tax & Deduction Calculator Engine
const NigerianTaxCalculator = {
  deductionRates: {
    pension: 0.08,
    nhf: 0.025,
    nhia: 0.05,
    minimumTax: 0.01
  },

  // 2025 PAYE Tax Bands (Progressive)
  taxBands: [
    { min: 0, max: 300000, rate: 0.07 },
    { min: 300000, max: 600000, rate: 0.11 },
    { min: 600000, max: 1100000, rate: 0.15 },
    { min: 1100000, max: 1600000, rate: 0.19 },
    { min: 1600000, max: 3200000, rate: 0.21 },
    { min: 3200000, max: Infinity, rate: 0.24 }
  ],

  calculateCRA(grossAnnual) {
    const fixedRelief = 200000;
    const variableRelief = grossAnnual * 0.21; // 20% + 1% of gross emolument

    return {
      fixedRelief,
      variableRelief,
      total: Math.max(fixedRelief, variableRelief)
    };
  },

  calculateProgressiveTax(chargeableIncome) {
    let tax = 0;
    let remainingIncome = chargeableIncome;

    for (const band of this.taxBands) {
      if (remainingIncome <= 0) break;

      const taxableInBand = band.max === Infinity
        ? remainingIncome
        : Math.min(remainingIncome, band.max - band.min);

      tax += taxableInBand * band.rate;
      remainingIncome -= taxableInBand;
    }

    return tax;
  },

  calculateBreakdown(grossAnnual, includeNHIS = false) {
    const grossMonthly = grossAnnual / 12;
    
    // Pension: 8% of gross (employee contribution)
    const pensionMonthly = grossMonthly * this.deductionRates.pension;
    const pensionAnnual = pensionMonthly * 12;
    
    // NHF: 2.5% of gross (if earning >= 3000/month)
    const nhfMonthly = grossMonthly >= 3000 ? grossMonthly * this.deductionRates.nhf : 0;
    const nhfAnnual = nhfMonthly * 12;
    
    // NHIA / health insurance: configurable employee contribution option
    const nhisMonthly = includeNHIS ? grossMonthly * this.deductionRates.nhia : 0;
    const nhisAnnual = nhisMonthly * 12;
    
    // Taxable income base after statutory deductions
    const taxableAnnual = grossAnnual - pensionAnnual - nhfAnnual - nhisAnnual;
    
    // Consolidated Relief Allowance (CRA): higher of N200,000 or 21% of gross emolument
    const cra = this.calculateCRA(grossAnnual);
    const reliefAllowance = cra.total;
    
    // Calculate PAYE (progressive schedule)
    const chargeableIncome = Math.max(0, taxableAnnual - reliefAllowance);
    const progressivePAYE = this.calculateProgressiveTax(chargeableIncome);

    // Minimum tax: 1% of gross emolument when lower than computed PAYE
    const minimumTax = grossAnnual * this.deductionRates.minimumTax;
    const paye = Math.max(progressivePAYE, minimumTax);
    const minimumTaxApplied = paye > progressivePAYE;
    
    const payeMonthly = paye / 12;
    
    // Total deductions
    const totalDeductionsMonthly = pensionMonthly + nhfMonthly + nhisMonthly + payeMonthly;
    const totalDeductionsAnnual = pensionAnnual + nhfAnnual + nhisAnnual + paye;
    
    // Net pay
    const netMonthly = grossMonthly - totalDeductionsMonthly;
    const netAnnual = grossAnnual - totalDeductionsAnnual;
    
    return {
      monthly: {
        gross: grossMonthly,
        pension: pensionMonthly,
        nhf: nhfMonthly,
        nhis: nhisMonthly,
        paye: payeMonthly,
        totalDeductions: totalDeductionsMonthly,
        net: netMonthly
      },
      annual: {
        gross: grossAnnual,
        pension: pensionAnnual,
        nhf: nhfAnnual,
        nhis: nhisAnnual,
        paye: paye,
        totalDeductions: totalDeductionsAnnual,
        net: netAnnual,
        taxableIncome: taxableAnnual,
        reliefAllowance: reliefAllowance,
        chargeableIncome: chargeableIncome,
        progressivePAYE,
        minimumTax,
        minimumTaxApplied,
        craBreakdown: {
          fixedRelief: cra.fixedRelief,
          variableRelief: cra.variableRelief
        }
      }
    };
  },

  // Tax optimization suggestions
  getOptimizationTips(breakdown) {
    const tips = [];
    const annual = breakdown.annual;
    
    // Pension optimization
    if (annual.pension < annual.gross * 0.10) {
      tips.push({
        title: "Voluntary Pension Contributions",
        description: `You're contributing 8% (₦${annual.pension.toLocaleString()}). Consider increasing to 10% for additional tax relief and retirement security.`,
        potentialSaving: annual.gross * 0.02 * 0.24 // Potential tax saved at highest marginal rate
      });
    }
    
    // Life insurance (allowed deduction)
    tips.push({
      title: "Life Insurance Premium",
      description: "Life insurance premiums are tax-deductible. Consider a policy to reduce taxable income.",
      potentialSaving: 100000 * 0.24 // Example: N100k premium
    });
    
    // NHF optimization
    if (annual.nhf > 0) {
      tips.push({
        title: "NHF Contribution Tracking",
        description: `You're contributing ₦${annual.nhf.toLocaleString()}/year to NHF. Keep records - this qualifies you for Federal Mortgage loans at 6% interest.`,
        potentialSaving: 0
      });
    }
    
    return tips;
  }
};

// PDF Export Function
const generatePDF = async (breakdown, grossAnnual, includeNHIS) => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text('Nigerian Salary Breakdown', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-NG')}`, 20, 28);
  
  // Annual Summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Annual Summary', 20, 45);
  
  doc.setFontSize(10);
  let y = 55;
  
  const annualData = [
    ['Gross Annual Salary', `₦${breakdown.annual.gross.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
    ['Pension Contribution (8%)', `₦${breakdown.annual.pension.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
    ['NHF (2.5%)', `₦${breakdown.annual.nhf.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
  ];
  
  if (includeNHIS) {
    annualData.push(['NHIA / Health Insurance (5%)', `₦${breakdown.annual.nhis.toLocaleString('en-NG', {minimumFractionDigits: 2})}`]);
  }
  
  annualData.push(
    ['Taxable Income', `₦${breakdown.annual.taxableIncome.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
    ['Tax Relief Allowance', `₦${breakdown.annual.reliefAllowance.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
    ['Chargeable Income', `₦${breakdown.annual.chargeableIncome.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
    ['PAYE Tax', `₦${breakdown.annual.paye.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
  );
  
  annualData.forEach(([label, value]) => {
    doc.text(label, 20, y);
    doc.text(value, 120, y);
    y += 7;
  });
  
  // Net Pay
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text('Net Annual Pay', 20, y);
  doc.text(`₦${breakdown.annual.net.toLocaleString('en-NG', {minimumFractionDigits: 2})}`, 120, y);
  
  // Monthly Summary
  y += 15;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Monthly Breakdown', 20, y);
  
  y += 10;
  doc.setFontSize(10);
  
  const monthlyData = [
    ['Gross Monthly Salary', `₦${breakdown.monthly.gross.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
    ['Pension', `₦${breakdown.monthly.pension.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
    ['NHF', `₦${breakdown.monthly.nhf.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
  ];
  
  if (includeNHIS) {
    monthlyData.push(['NHIA / Health Insurance', `₦${breakdown.monthly.nhis.toLocaleString('en-NG', {minimumFractionDigits: 2})}`]);
  }
  
  monthlyData.push(
    ['PAYE', `₦${breakdown.monthly.paye.toLocaleString('en-NG', {minimumFractionDigits: 2})}`],
  );
  
  monthlyData.forEach(([label, value]) => {
    doc.text(label, 20, y);
    doc.text(value, 120, y);
    y += 7;
  });
  
  y += 5;
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text('Net Monthly Pay', 20, y);
  doc.text(`₦${breakdown.monthly.net.toLocaleString('en-NG', {minimumFractionDigits: 2})}`, 120, y);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by Nigerian Salary Calculator - For informational purposes only', 20, 280);
  
  doc.save('salary-breakdown.pdf');
};

export default function NigerianSalaryCalculator() {
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');
  const [grossAnnual, setGrossAnnual] = useState('');
  const [includeNHIS, setIncludeNHIS] = useState(false);
  const [breakdown, setBreakdown] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Comparison tool state
  const [comparisons, setComparisons] = useState([
    { id: 1, name: 'Current Job', salary: '', breakdown: null },
    { id: 2, name: 'Job Offer A', salary: '', breakdown: null }
  ]);
  
  const calculateSalary = () => {
    const annual = parseFloat(grossAnnual);
    if (isNaN(annual) || annual <= 0) return;
    
    const result = NigerianTaxCalculator.calculateBreakdown(annual, includeNHIS);
    setBreakdown(result);
  };
  
  const handlePremiumFeature = (feature) => {
    if (!isPremium) {
      setShowPaywall(true);
      setActiveTab(feature);
    }
  };
  
  const exportPDF = async () => {
    if (!isPremium) {
      handlePremiumFeature('pdf');
      return;
    }
    
    if (!breakdown) return;
    
    // Load jsPDF from CDN
    if (!window.jspdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => generatePDF(breakdown, parseFloat(grossAnnual), includeNHIS);
      document.head.appendChild(script);
    } else {
      generatePDF(breakdown, parseFloat(grossAnnual), includeNHIS);
    }
  };
  
  const calculateComparison = (index) => {
    const salary = parseFloat(comparisons[index].salary);
    if (isNaN(salary) || salary <= 0) return;
    
    const result = NigerianTaxCalculator.calculateBreakdown(salary, includeNHIS);
    const updated = [...comparisons];
    updated[index].breakdown = result;
    setComparisons(updated);
  };
  
  const addComparison = () => {
    if (comparisons.length >= 4) return;
    setComparisons([...comparisons, {
      id: Date.now(),
      name: `Option ${String.fromCharCode(65 + comparisons.length - 1)}`,
      salary: '',
      breakdown: null
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Load custom font */}
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      
      <style>{`
        * {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        
        .premium-badge {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }
        
        input:focus {
          outline: none;
          ring: 2px;
          ring-color: #10b981;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Calculator className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">PayCalc.ng</h1>
                <p className="text-xs text-slate-500">Nigerian Salary Calculator</p>
              </div>
            </div>
            
            {!isPremium ? (
              <button
                onClick={() => setShowPaywall(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg premium-badge text-white font-semibold text-sm hover:shadow-lg transition-all"
              >
                <Sparkles size={16} />
                Upgrade to Pro
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
                <Check size={16} className="text-amber-600" />
                <span className="text-sm font-semibold text-amber-900">Pro Member</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calculator size={16} className="inline mr-2" />
            Calculator
          </button>
          
          <button
            onClick={() => isPremium ? setActiveTab('projection') : handlePremiumFeature('projection')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all relative ${
              activeTab === 'projection'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <TrendingUp size={16} className="inline mr-2" />
            Annual Projection
            {!isPremium && <Lock size={12} className="inline ml-1" />}
          </button>
          
          <button
            onClick={() => isPremium ? setActiveTab('compare') : handlePremiumFeature('compare')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'compare'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GitCompare size={16} className="inline mr-2" />
            Compare Offers
            {!isPremium && <Lock size={12} className="inline ml-1" />}
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* Input Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-black mb-6 gradient-text">Calculate Your Salary</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Annual Gross Salary (₦)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                    <input
                      type="number"
                      value={grossAnnual}
                      onChange={(e) => setGrossAnnual(e.target.value)}
                      placeholder="e.g., 6000000"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 font-semibold text-lg mono"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-1">
                    Enter your total annual salary before deductions
                  </p>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="nhis"
                    checked={includeNHIS}
                    onChange={(e) => setIncludeNHIS(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="nhis" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Include NHIA / Health Insurance deduction (5%)
                    <span className="block text-xs text-slate-500 font-normal">
                      Optional employee contribution model used by some employers
                    </span>
                  </label>
                </div>
                
                <button
                  onClick={calculateSalary}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Calculate Breakdown
                  <ArrowRight size={20} className="inline ml-2" />
                </button>
              </div>
              
              {/* Quick Info */}
              <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl border border-emerald-200">
                <h3 className="font-bold text-sm text-emerald-900 mb-2">What's included?</h3>
                <ul className="text-xs text-emerald-800 space-y-1">
                  <li>✓ Pension contribution (8%)</li>
                  <li>✓ National Housing Fund (2.5%)</li>
                  <li>✓ PAYE Tax (Progressive rates)</li>
                  <li>✓ Consolidated Relief Allowance</li>
                  <li>✓ {includeNHIS ? 'NHIA / Health Insurance (5%)' : 'Optional NHIA / Health Insurance'}</li>
                </ul>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              {breakdown ? (
                <div className="animate-slideUp">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-black gradient-text">Your Breakdown</h2>
                    <button
                      onClick={exportPDF}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        isPremium
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <Download size={16} />
                      {isPremium ? 'Export PDF' : 'Pro Feature'}
                    </button>
                  </div>
                  
                  {/* Net Pay Highlight */}
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
                    <p className="text-sm font-semibold opacity-90 mb-1">Monthly Take-Home</p>
                    <p className="text-4xl font-black mono">
                      ₦{breakdown.monthly.net.toLocaleString('en-NG', {minimumFractionDigits: 2})}
                    </p>
                    <p className="text-sm opacity-75 mt-2">
                      Annual: ₦{breakdown.annual.net.toLocaleString('en-NG', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  
                  {/* Monthly Breakdown */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Monthly Deductions</h3>
                    
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-600">Gross Salary</span>
                      <span className="font-bold mono">₦{breakdown.monthly.gross.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 text-sm">Pension (8%)</span>
                      <span className="font-semibold text-red-600 mono">-₦{breakdown.monthly.pension.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 text-sm">NHF (2.5%)</span>
                      <span className="font-semibold text-red-600 mono">-₦{breakdown.monthly.nhf.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                    </div>
                    
                    {includeNHIS && breakdown.monthly.nhis > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600 text-sm">NHIA / Health Insurance (5%)</span>
                        <span className="font-semibold text-red-600 mono">-₦{breakdown.monthly.nhis.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-2 border-t border-slate-200 pt-3">
                      <span className="text-slate-600 text-sm">PAYE Tax</span>
                      <span className="font-semibold text-red-600 mono">-₦{breakdown.monthly.paye.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 bg-slate-50 rounded-lg px-4 mt-4">
                      <span className="font-bold text-slate-700">Total Deductions</span>
                      <span className="font-bold text-red-600 mono">-₦{breakdown.monthly.totalDeductions.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                  
                  {/* Effective Tax Rate */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-blue-900">Effective Statutory Deduction Rate</span>
                      <span className="text-lg font-bold text-blue-700 mono">
                        {((breakdown.monthly.totalDeductions / breakdown.monthly.gross) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 animate-pulse-slow">
                    <Calculator size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to calculate?</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Enter your annual salary to see a detailed breakdown of your take-home pay and deductions.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Annual Projection Tab */}
        {activeTab === 'projection' && isPremium && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 animate-fadeIn">
            <h2 className="text-2xl font-black mb-6 gradient-text">Annual Tax Projection & Planning</h2>
            
            {breakdown ? (
              <div className="space-y-6">
                {/* Annual Summary Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
                    <p className="text-sm font-semibold text-emerald-700 mb-1">Annual Gross</p>
                    <p className="text-2xl font-black text-emerald-900 mono">
                      ₦{breakdown.annual.gross.toLocaleString('en-NG')}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                    <p className="text-sm font-semibold text-red-700 mb-1">Total Deductions</p>
                    <p className="text-2xl font-black text-red-900 mono">
                      ₦{breakdown.annual.totalDeductions.toLocaleString('en-NG')}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 mb-1">Annual Net Pay</p>
                    <p className="text-2xl font-black text-blue-900 mono">
                      ₦{breakdown.annual.net.toLocaleString('en-NG')}
                    </p>
                  </div>
                </div>
                
                {/* Tax Calculation Details */}
                <div className="border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BarChart3 size={20} className="text-emerald-600" />
                    Tax Calculation Breakdown
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Gross Annual Income</span>
                      <span className="font-bold mono">₦{breakdown.annual.gross.toLocaleString('en-NG')}</span>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Less: Pension (8%)</span>
                      <span className="font-semibold text-red-600 mono">-₦{breakdown.annual.pension.toLocaleString('en-NG')}</span>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Less: NHF (2.5%)</span>
                      <span className="font-semibold text-red-600 mono">-₦{breakdown.annual.nhf.toLocaleString('en-NG')}</span>
                    </div>

                    {includeNHIS && (
                      <div className="flex justify-between py-2">
                        <span className="text-slate-600">Less: NHIA / Health Insurance (5%)</span>
                        <span className="font-semibold text-red-600 mono">-₦{breakdown.annual.nhis.toLocaleString('en-NG')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-2 border-t border-slate-200 font-semibold">
                      <span className="text-slate-700">Taxable Income</span>
                      <span className="mono">₦{breakdown.annual.taxableIncome.toLocaleString('en-NG')}</span>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Less: Consolidated Relief Allowance (CRA)</span>
                      <span className="font-semibold text-green-600 mono">-₦{breakdown.annual.reliefAllowance.toLocaleString('en-NG')}</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-t border-slate-200 font-semibold">
                      <span className="text-slate-700">Chargeable Income</span>
                      <span className="mono">₦{breakdown.annual.chargeableIncome.toLocaleString('en-NG')}</span>
                    </div>
                    
                    <div className="flex justify-between py-3 bg-red-50 rounded-lg px-4 mt-4">
                      <span className="font-bold text-red-900">Annual PAYE Tax</span>
                      <span className="font-black text-red-700 mono text-lg">₦{breakdown.annual.paye.toLocaleString('en-NG')}</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                      Progressive tax: ₦{breakdown.annual.progressivePAYE.toLocaleString('en-NG')} • Minimum tax (1%): ₦{breakdown.annual.minimumTax.toLocaleString('en-NG')}
                      {breakdown.annual.minimumTaxApplied ? ' (minimum tax applied)' : ''}
                    </p>
                  </div>
                </div>
                
                {/* Tax Optimization Tips */}
                <div className="border border-amber-200 rounded-xl p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-900">
                    <Sparkles size={20} className="text-amber-600" />
                    Tax Optimization Opportunities
                  </h3>
                  
                  <div className="space-y-4">
                    {NigerianTaxCalculator.getOptimizationTips(breakdown).map((tip, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-amber-200">
                        <h4 className="font-bold text-amber-900 mb-1">{tip.title}</h4>
                        <p className="text-sm text-slate-700 mb-2">{tip.description}</p>
                        {tip.potentialSaving > 0 && (
                          <p className="text-xs font-semibold text-green-600">
                            Potential annual saving: ₦{tip.potentialSaving.toLocaleString('en-NG')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Monthly Projection Chart */}
                <div className="border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-600" />
                    12-Month Projection
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left py-2 font-bold text-slate-700">Month</th>
                          <th className="text-right py-2 font-bold text-slate-700">Gross</th>
                          <th className="text-right py-2 font-bold text-slate-700">Deductions</th>
                          <th className="text-right py-2 font-bold text-slate-700">Net Pay</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-2">{month}</td>
                            <td className="text-right mono">₦{breakdown.monthly.gross.toLocaleString('en-NG', {maximumFractionDigits: 0})}</td>
                            <td className="text-right mono text-red-600">-₦{breakdown.monthly.totalDeductions.toLocaleString('en-NG', {maximumFractionDigits: 0})}</td>
                            <td className="text-right mono font-semibold text-emerald-600">₦{breakdown.monthly.net.toLocaleString('en-NG', {maximumFractionDigits: 0})}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">Calculate a salary first to see annual projections</p>
              </div>
            )}
          </div>
        )}

        {/* Compare Offers Tab */}
        {activeTab === 'compare' && isPremium && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black gradient-text">Compare Job Offers</h2>
              {comparisons.length < 4 && (
                <button
                  onClick={addComparison}
                  className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold text-sm hover:bg-emerald-200 transition-all"
                >
                  + Add Offer
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {comparisons.map((comp, idx) => (
                <div key={comp.id} className="border-2 border-slate-200 rounded-xl p-6 card-hover">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => {
                      const updated = [...comparisons];
                      updated[idx].name = e.target.value;
                      setComparisons(updated);
                    }}
                    className="font-bold text-lg mb-4 w-full border-b-2 border-transparent focus:border-emerald-500 outline-none"
                  />
                  
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Salary (₦)</label>
                    <input
                      type="number"
                      value={comp.salary}
                      onChange={(e) => {
                        const updated = [...comparisons];
                        updated[idx].salary = e.target.value;
                        setComparisons(updated);
                      }}
                      placeholder="e.g., 6000000"
                      className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-emerald-500 font-semibold mono"
                    />
                  </div>
                  
                  <button
                    onClick={() => calculateComparison(idx)}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all mb-4"
                  >
                    Calculate
                  </button>
                  
                  {comp.breakdown && (
                    <div className="space-y-2 text-sm">
                      <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <p className="text-xs text-emerald-700 font-semibold mb-1">Monthly Net</p>
                        <p className="text-xl font-black text-emerald-900 mono">
                          ₦{comp.breakdown.monthly.net.toLocaleString('en-NG', {maximumFractionDigits: 0})}
                        </p>
                      </div>
                      
                      <div className="flex justify-between py-2 border-t border-slate-100">
                        <span className="text-slate-600">PAYE</span>
                        <span className="font-semibold text-red-600 mono">₦{comp.breakdown.monthly.paye.toLocaleString('en-NG', {maximumFractionDigits: 0})}</span>
                      </div>
                      
                      <div className="flex justify-between py-2">
                        <span className="text-slate-600">Pension</span>
                        <span className="font-semibold text-red-600 mono">₦{comp.breakdown.monthly.pension.toLocaleString('en-NG', {maximumFractionDigits: 0})}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-lg mt-2">
                        <span className="text-slate-600 font-semibold">Effective Rate</span>
                        <span className="font-bold mono">
                          {((comp.breakdown.monthly.totalDeductions / comp.breakdown.monthly.gross) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {comparisons.filter(c => c.breakdown).length >= 2 && (
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-lg mb-4 text-blue-900">Comparison Insights</h3>
                {(() => {
                  const calculated = comparisons.filter(c => c.breakdown);
                  const best = calculated.reduce((max, c) => 
                    c.breakdown.monthly.net > max.breakdown.monthly.net ? c : max
                  );
                  const netDiff = best.breakdown.monthly.net - calculated.find(c => c.id !== best.id).breakdown.monthly.net;
                  
                  return (
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-900">
                        <strong>{best.name}</strong> offers the highest monthly net pay at{' '}
                        <span className="font-bold mono">₦{best.breakdown.monthly.net.toLocaleString('en-NG', {maximumFractionDigits: 0})}</span>
                      </p>
                      <p className="text-blue-800">
                        That's <span className="font-bold">₦{netDiff.toLocaleString('en-NG', {maximumFractionDigits: 0})}/month</span> more than the next best offer.
                      </p>
                      <p className="text-blue-800">
                        Annual difference: <span className="font-bold">₦{(netDiff * 12).toLocaleString('en-NG', {maximumFractionDigits: 0})}</span>
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      {showPaywall && !isPremium && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 premium-badge rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2">Upgrade to PayCalc Pro</h2>
              <p className="text-slate-600">Unlock powerful salary planning features</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <TrendingUp size={24} className="text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm mb-1">Annual Projection</h3>
                <p className="text-xs text-slate-600">12-month tax planning</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <FileText size={24} className="text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm mb-1">PDF Export</h3>
                <p className="text-xs text-slate-600">Professional reports</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <GitCompare size={24} className="text-purple-600 mx-auto mb-2" />
                <h3 className="font-bold text-sm mb-1">Compare Offers</h3>
                <p className="text-xs text-slate-600">Side-by-side analysis</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-xl mb-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm opacity-90 mb-1">Limited Time Offer</p>
                  <p className="text-3xl font-black">₦2,500<span className="text-lg font-normal">/month</span></p>
                  <p className="text-sm opacity-75 mt-1">or ₦25,000/year (save 17%)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Regular price</p>
                  <p className="text-xl line-through opacity-50">₦5,000</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6 text-sm">
              {[
                'Unlimited salary calculations',
                'Annual tax projections & planning',
                'PDF export for all breakdowns',
                'Compare up to 4 job offers',
                'Tax optimization recommendations',
                'Priority support'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check size={20} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaywall(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setIsPremium(true);
                  setShowPaywall(false);
                }}
                className="flex-1 px-6 py-3 premium-badge text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Upgrade Now
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-500 mt-4">
              This is a demo. In production, this would integrate with payment processing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
