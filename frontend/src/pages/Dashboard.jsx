import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ScoreBar({ label, value, color = '#e8a020' }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#8b949e', fontWeight: '500' }}>{label}</span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color, fontWeight: '700' }}>{value}/100</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: '3px', transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

function ScoreCircle({ value, label, color = '#e8a020', size = 80 }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 40 40)" style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="40" y="44" textAnchor="middle" fill={color} fontSize="14" fontFamily="IBM Plex Mono" fontWeight="700">{value}</text>
      </svg>
      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#555', letterSpacing: '0.08em', textAlign: 'center', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [competitors, setCompetitors] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState({});
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const reportRef = useRef(null);

  const steps = [
    'Initializing AI strategist...',
    'Searching competitor websites...',
    'Analyzing SEO & traffic data...',
    'Mapping paid ad strategies...',
    'Scoring all metrics...',
    'Building action plans...',
    'Generating intelligence report...',
  ];

  const addCompetitor = () => { if (competitors.length < 5) setCompetitors([...competitors, '']); };
  const removeCompetitor = (i) => setCompetitors(competitors.filter((_, idx) => idx !== i));
  const updateCompetitor = (i, v) => { const u = [...competitors]; u[i] = v; setCompetitors(u); };
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const analyze = async () => {
    const validUrls = competitors.filter(u => u.trim() !== '');
    if (!companyName.trim()) { setError('Please enter your company name'); return; }
    if (validUrls.length === 0) { setError('Please enter at least one competitor URL'); return; }
    setError(''); setLoading(true); setResults(null);
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 2000));
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/analysis/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, competitor_urls: validUrls })
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
        const tabs = {};
        data.data.forEach((_, i) => tabs[i] = 'overview');
        setActiveTab(tabs);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to backend. Please try again.');
    }
    setLoading(false);
  };

  const getThreatColor = (level) => level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';
  const getScoreColor = (score) => score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';
  const getImpactColor = (impact) => impact === 'High' ? '#ef4444' : impact === 'Medium' ? '#f59e0b' : '#10b981';

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const pageH = 297;
      const margin = 15;
      let y = margin;

      const addPage = () => { pdf.addPage(); y = margin; };
      const checkPage = (needed = 20) => { if (y + needed > pageH - margin) addPage(); };

      // ── COVER PAGE ──
      pdf.setFillColor(7, 7, 7);
      pdf.rect(0, 0, pageW, pageH, 'F');

      // Gold accent line
      pdf.setDrawColor(232, 160, 32);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 40, pageW - margin, 40);
      pdf.line(margin, pageH - 40, pageW - margin, pageH - 40);

      // Logo
      pdf.setTextColor(240, 236, 228);
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SPY', pageW / 2 - 18, 80, { align: 'center' });
      pdf.setTextColor(232, 160, 32);
      pdf.text('LENS', pageW / 2 + 18, 80, { align: 'center' });

      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('AI COMPETITOR INTELLIGENCE PLATFORM', pageW / 2, 92, { align: 'center' });

      // Report title
      pdf.setTextColor(240, 236, 228);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('COMPETITOR INTELLIGENCE', pageW / 2, 130, { align: 'center' });
      pdf.text('REPORT', pageW / 2, 145, { align: 'center' });

      pdf.setTextColor(232, 160, 32);
      pdf.setFontSize(14);
      pdf.text(`${companyName.toUpperCase()}`, pageW / 2, 165, { align: 'center' });

      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(9);
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageW / 2, 180, { align: 'center' });
      pdf.text(`${results.length} Competitor${results.length > 1 ? 's' : ''} Analyzed`, pageW / 2, 188, { align: 'center' });

      // Competitor list on cover
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      results.forEach((comp, i) => {
        pdf.setFillColor(232, 160, 32);
        pdf.circle(pageW / 2 - 30, 205 + i * 12, 1.5, 'F');
        pdf.setTextColor(180, 180, 180);
        pdf.text(comp.name, pageW / 2 - 24, 206.5 + i * 12);
        const tc = comp.threat_level === 'High' ? [239, 68, 68] : comp.threat_level === 'Medium' ? [245, 158, 11] : [16, 185, 129];
        pdf.setTextColor(...tc);
        pdf.text(`${comp.threat_level} Threat`, pageW / 2 + 10, 206.5 + i * 12);
      });

      pdf.setTextColor(40, 40, 40);
      pdf.setFontSize(8);
      pdf.text('Powered by Claude AI + Live Web Search', pageW / 2, pageH - 25, { align: 'center' });
      pdf.text('Confidential — For Internal Use Only', pageW / 2, pageH - 18, { align: 'center' });

      // ── EXECUTIVE SUMMARY ──
      addPage();
      pdf.setFillColor(7, 7, 7);
      pdf.rect(0, 0, pageW, pageH, 'F');

      pdf.setTextColor(232, 160, 32);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EXECUTIVE SUMMARY', margin, y);
      y += 8;

      pdf.setDrawColor(232, 160, 32);
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageW - margin, y);
      y += 10;

      pdf.setTextColor(240, 236, 228);
      pdf.setFontSize(18);
      pdf.text(`${companyName} vs`, margin, y);
      y += 8;
      pdf.setTextColor(232, 160, 32);
      pdf.text('The Competition', margin, y);
      y += 12;

      // Summary boxes
      const boxW = (pageW - margin * 2 - 10) / results.length;
      results.forEach((comp, i) => {
        const bx = margin + i * (boxW + 5);
        pdf.setFillColor(15, 15, 15);
        pdf.setDrawColor(30, 30, 30);
        pdf.setLineWidth(0.3);
        pdf.roundedRect(bx, y, boxW, 40, 2, 2, 'FD');

        const tc = comp.threat_level === 'High' ? [239, 68, 68] : comp.threat_level === 'Medium' ? [245, 158, 11] : [16, 185, 129];
        pdf.setFillColor(...tc);
        pdf.roundedRect(bx, y, boxW, 6, 2, 2, 'F');

        pdf.setTextColor(240, 236, 228);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(comp.name, bx + boxW / 2, y + 14, { align: 'center' });

        pdf.setTextColor(...tc);
        pdf.setFontSize(18);
        pdf.text(`${comp.scores?.overall_threat || 0}`, bx + boxW / 2, y + 27, { align: 'center' });

        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text('THREAT SCORE', bx + boxW / 2, y + 35, { align: 'center' });
      });
      y += 50;

      // Key findings
      pdf.setTextColor(232, 160, 32);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('KEY FINDINGS', margin, y);
      y += 8;

      results.forEach((comp, i) => {
        checkPage(30);
        pdf.setFillColor(15, 15, 15);
        pdf.setDrawColor(20, 20, 20);
        pdf.roundedRect(margin, y, pageW - margin * 2, 25, 2, 2, 'FD');

        pdf.setTextColor(240, 236, 228);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${i + 1}. ${comp.name}`, margin + 5, y + 8);

        pdf.setTextColor(140, 140, 140);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        const opp = comp.opportunity || 'No opportunity data';
        const lines = pdf.splitTextToSize(opp, pageW - margin * 2 - 10);
        pdf.text(lines[0], margin + 5, y + 16);
        if (lines[1]) pdf.text(lines[1], margin + 5, y + 22);
        y += 30;
      });

      // ── PER COMPETITOR PAGES ──
      results.forEach((comp, compIdx) => {
        // Page header
        addPage();
        pdf.setFillColor(7, 7, 7);
        pdf.rect(0, 0, pageW, pageH, 'F');

        const tc = comp.threat_level === 'High' ? [239, 68, 68] : comp.threat_level === 'Medium' ? [245, 158, 11] : [16, 185, 129];

        // Colored top bar
        pdf.setFillColor(...tc);
        pdf.rect(0, 0, pageW, 8, 'F');

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`COMPETITOR ${compIdx + 1} OF ${results.length}`, margin, 18);

        pdf.setTextColor(240, 236, 228);
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.text(comp.name, margin, y + 10);
        y += 14;

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(comp.url, margin, y);
        y += 6;

        if (comp.tagline) {
          pdf.setTextColor(180, 180, 180);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.text(`"${comp.tagline}"`, margin, y);
          y += 8;
        }

        pdf.setDrawColor(20, 20, 20);
        pdf.setLineWidth(0.3);
        pdf.line(margin, y, pageW - margin, y);
        y += 8;

        // Company info grid
        const infoItems = [
          { label: 'PRICING', val: comp.pricing || 'N/A' },
          { label: 'MODEL', val: comp.pricing_model || 'N/A' },
          { label: 'FOUNDED', val: comp.founded || 'N/A' },
          { label: 'EMPLOYEES', val: comp.employees || 'N/A' },
          { label: 'FUNDING', val: comp.funding || 'N/A' },
          { label: 'THREAT', val: comp.threat_level || 'N/A' },
        ];
        const iW = (pageW - margin * 2 - 10) / 3;
        infoItems.forEach((item, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const ix = margin + col * (iW + 5);
          const iy = y + row * 20;
          pdf.setFillColor(12, 12, 12);
          pdf.setDrawColor(20, 20, 20);
          pdf.roundedRect(ix, iy, iW, 16, 1, 1, 'FD');
          pdf.setTextColor(80, 80, 80);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'bold');
          pdf.text(item.label, ix + 4, iy + 6);
          pdf.setTextColor(232, 160, 32);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          const val = pdf.splitTextToSize(item.val, iW - 8);
          pdf.text(val[0], ix + 4, iy + 12);
        });
        y += 46;

        // Scores section
        pdf.setTextColor(232, 160, 32);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('INTELLIGENCE SCORES', margin, y);
        y += 8;

        if (comp.scores) {
          const scoreItems = [
            { key: 'overall_threat', label: 'Overall Threat' },
            { key: 'seo_strength', label: 'SEO Strength' },
            { key: 'content_quality', label: 'Content Quality' },
            { key: 'paid_ads_spend', label: 'Paid Ads Spend' },
            { key: 'product_strength', label: 'Product Strength' },
            { key: 'pricing_competitiveness', label: 'Pricing Competitiveness' },
            { key: 'brand_strength', label: 'Brand Strength' },
            { key: 'growth_rate', label: 'Growth Rate' },
            { key: 'customer_satisfaction', label: 'Customer Satisfaction' },
            { key: 'market_share', label: 'Market Share' },
          ];

          scoreItems.forEach(item => {
            const val = comp.scores[item.key] || 0;
            const sc = val >= 70 ? [239, 68, 68] : val >= 40 ? [245, 158, 11] : [16, 185, 129];

            pdf.setTextColor(140, 140, 140);
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'normal');
            pdf.text(item.label, margin, y + 3);

            pdf.setTextColor(...sc);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${val}`, pageW - margin - 10, y + 3, { align: 'right' });

            // Bar background
            pdf.setFillColor(20, 20, 20);
            pdf.roundedRect(margin + 50, y - 1, pageW - margin * 2 - 65, 5, 1, 1, 'F');
            // Bar fill
            pdf.setFillColor(...sc);
            pdf.roundedRect(margin + 50, y - 1, (pageW - margin * 2 - 65) * val / 100, 5, 1, 1, 'F');

            y += 9;
          });
        }
        y += 6;

        // SEO Section
        checkPage(40);
        pdf.setTextColor(232, 160, 32);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SEO & TRAFFIC INTELLIGENCE', margin, y);
        y += 6;

        pdf.setFillColor(12, 12, 12);
        pdf.setDrawColor(20, 20, 20);
        pdf.roundedRect(margin, y, pageW - margin * 2, 28, 2, 2, 'FD');

        if (comp.seo) {
          const seoItems = [
            `Monthly Traffic: ${comp.seo.monthly_traffic || 'N/A'}`,
            `Domain Authority: ${comp.seo.domain_authority || 'N/A'}/100`,
            `Backlinks: ${comp.seo.backlinks || 'N/A'}`,
            `Top Keywords: ${(comp.seo.top_keywords || []).join(', ')}`,
          ];
          seoItems.forEach((item, i) => {
            pdf.setTextColor(180, 180, 180);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`• ${item}`, margin + 5, y + 8 + i * 6);
          });
        }
        y += 34;

        // Paid Ads Section
        checkPage(30);
        pdf.setTextColor(232, 160, 32);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PAID ADS INTELLIGENCE', margin, y);
        y += 6;

        pdf.setFillColor(12, 12, 12);
        pdf.setDrawColor(20, 20, 20);
        pdf.roundedRect(margin, y, pageW - margin * 2, 22, 2, 2, 'FD');

        if (comp.paid_ads) {
          pdf.setTextColor(180, 180, 180);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`• Est. Monthly Spend: ${comp.paid_ads.monthly_spend || 'N/A'}`, margin + 5, y + 8);
          pdf.text(`• Platforms: ${(comp.paid_ads.platforms || []).join(', ')}`, margin + 5, y + 16);
        }
        y += 28;

        // Action Plan — new page
        addPage();
        pdf.setFillColor(7, 7, 7);
        pdf.rect(0, 0, pageW, pageH, 'F');

        pdf.setFillColor(...tc);
        pdf.rect(0, 0, pageW, 4, 'F');

        pdf.setTextColor(232, 160, 32);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Action Plan: Beat ${comp.name}`, margin, y + 6);
        y += 16;

        pdf.setTextColor(140, 140, 140);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Specific steps for ${companyName} to outperform ${comp.name}`, margin, y);
        y += 12;

        // vs You section
        if (comp.vs_you) {
          pdf.setFillColor(12, 12, 12);
          pdf.setDrawColor(20, 20, 20);
          pdf.roundedRect(margin, y, pageW - margin * 2, 36, 2, 2, 'FD');

          pdf.setTextColor(232, 160, 32);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.text('HEAD TO HEAD COMPARISON', margin + 5, y + 8);

          pdf.setTextColor(239, 68, 68);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'bold');
          pdf.text('THEIR ADVANTAGE:', margin + 5, y + 16);
          pdf.setTextColor(180, 180, 180);
          pdf.setFont('helvetica', 'normal');
          const ta = pdf.splitTextToSize(comp.vs_you.their_advantage || 'N/A', pageW - margin * 2 - 10);
          pdf.text(ta[0], margin + 5, y + 22);

          pdf.setTextColor(16, 185, 129);
          pdf.setFont('helvetica', 'bold');
          pdf.text('YOUR ADVANTAGE:', margin + 5, y + 30);
          pdf.setTextColor(180, 180, 180);
          pdf.setFont('helvetica', 'normal');
          const ya = pdf.splitTextToSize(comp.vs_you.your_advantage || 'N/A', pageW - margin * 2 - 10);
          pdf.text(ya[0], margin + 55, y + 30);
          y += 44;
        }

        // Action steps
        if (comp.action_plan && comp.action_plan.length > 0) {
          comp.action_plan.forEach((step, si) => {
            checkPage(32);
            const ic = step.impact === 'High' ? [239, 68, 68] : step.impact === 'Medium' ? [245, 158, 11] : [16, 185, 129];

            pdf.setFillColor(10, 10, 10);
            pdf.setDrawColor(...ic);
            pdf.setLineWidth(0.5);
            pdf.roundedRect(margin, y, pageW - margin * 2, 28, 2, 2, 'FD');

            // Step number circle
            pdf.setFillColor(...ic);
            pdf.circle(margin + 10, y + 10, 6, 'F');
            pdf.setTextColor(7, 7, 7);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${si + 1}`, margin + 10, y + 12.5, { align: 'center' });

            // Timeline badge
            pdf.setFillColor(20, 20, 20);
            pdf.roundedRect(pageW - margin - 35, y + 4, 33, 8, 1, 1, 'F');
            pdf.setTextColor(...ic);
            pdf.setFontSize(6);
            pdf.text(step.timeline || 'Soon', pageW - margin - 18.5, y + 9.5, { align: 'center' });

            // Action text
            pdf.setTextColor(240, 236, 228);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            const actionLines = pdf.splitTextToSize(step.action || '', pageW - margin * 2 - 30);
            pdf.text(actionLines[0], margin + 20, y + 10);
            if (actionLines[1]) {
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(140, 140, 140);
              pdf.text(actionLines[1], margin + 20, y + 17);
            }

            pdf.setTextColor(...ic);
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${step.impact || 'Medium'} Impact`, margin + 20, y + 24);

            y += 33;
          });
        }

        // Opportunity box
        checkPage(30);
        pdf.setFillColor(16, 185, 129, 0.1);
        pdf.setFillColor(5, 20, 12);
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, y, pageW - margin * 2, 24, 2, 2, 'FD');

        pdf.setTextColor(16, 185, 129);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('⚡ KEY OPPORTUNITY', margin + 5, y + 8);
        pdf.setTextColor(180, 180, 180);
        pdf.setFont('helvetica', 'normal');
        const oppLines = pdf.splitTextToSize(comp.opportunity || 'N/A', pageW - margin * 2 - 10);
        pdf.text(oppLines[0], margin + 5, y + 16);
        if (oppLines[1]) pdf.text(oppLines[1], margin + 5, y + 22);
        y += 30;
      });

      // ── FINAL PAGE ──
      addPage();
      pdf.setFillColor(7, 7, 7);
      pdf.rect(0, 0, pageW, pageH, 'F');

      pdf.setDrawColor(232, 160, 32);
      pdf.setLineWidth(0.3);
      pdf.line(margin, 40, pageW - margin, 40);

      pdf.setTextColor(232, 160, 32);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Ready to dominate?', pageW / 2, 80, { align: 'center' });

      pdf.setTextColor(180, 180, 180);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Start executing your action plan today.', pageW / 2, 95, { align: 'center' });

      pdf.setTextColor(240, 236, 228);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('spylens-seven.vercel.app', pageW / 2, 130, { align: 'center' });

      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`© ${new Date().getFullYear()} SpyLens AI • Confidential Report for ${companyName}`, pageW / 2, pageH - 20, { align: 'center' });

      pdf.save(`SpyLens_${companyName}_Competitor_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF generation failed. Please try again.');
    }
    setGeneratingPDF(false);
  };

  const tabs = ['overview', 'seo', 'ads', 'content', 'action'];
  const tabLabels = { overview: '📊 Overview', seo: '🔍 SEO', ads: '💰 Paid Ads', content: '📝 Content', action: '🎯 Action Plan' };

  return (
    <div style={{ minHeight: '100vh', background: '#050810', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=IBM+Plex+Mono&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(232,160,32,0.3); } 50% { box-shadow: 0 0 60px rgba(232,160,32,0.7); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 14px 18px; font-size: 14px; color: #e2e8f0; outline: none; font-family: 'Montserrat', sans-serif; transition: all 0.2s ease; }
        .input-field:focus { border-color: rgba(232,160,32,0.5); background: rgba(232,160,32,0.04); }
        .input-field::placeholder { color: #4b5563; }
        .analyze-btn { width: 100%; padding: 16px; background: #e8a020; border: none; border-radius: 2px; color: #070707; font-size: 11px; font-weight: 800; cursor: pointer; font-family: 'Montserrat', sans-serif; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.2s ease; animation: glow 2s ease infinite; }
        .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.9; }
        .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; animation: none; }
        .pdf-btn { width: 100%; padding: 14px; background: transparent; border: 1px solid rgba(232,160,32,0.4); border-radius: 2px; color: #e8a020; font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'Montserrat', sans-serif; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.2s ease; margin-top: 12px; }
        .pdf-btn:hover:not(:disabled) { background: rgba(232,160,32,0.08); }
        .pdf-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .glass-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; }
        .comp-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; animation: fadeUp 0.5s ease both; }
        .tab-btn { padding: 8px 16px; background: none; border: 1px solid transparent; border-radius: 2px; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; color: #444; }
        .tab-btn.active { border-color: rgba(232,160,32,0.3); color: #e8a020; background: rgba(232,160,32,0.06); }
        .tab-btn:hover:not(.active) { color: #888; }
        .remove-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; width: 36px; height: 36px; border-radius: 4px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .add-btn { width: 100%; padding: 12px; background: none; border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; color: #8b949e; font-size: 14px; cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.2s ease; margin-top: 8px; }
        .add-btn:hover { border-color: rgba(232,160,32,0.4); color: #e8a020; }
        .logout-btn { background: none; border: 1px solid #1e1e1e; color: #444; padding: 8px 20px; border-radius: 2px; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; }
        .logout-btn:hover { border-color: #ef4444; color: #ef4444; }
        .info-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; padding: 16px; }
        .action-step { display: flex; gap: 16px; align-items: flex-start; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 10px; transition: all 0.2s; }
        .action-step:hover { border-color: rgba(232,160,32,0.2); }
        .step-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 700; flex-shrink: 0; }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(232,160,32,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800', cursor: 'pointer' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s ease infinite' }} />
          <span style={{ fontSize: '11px', color: '#8b949e', fontFamily: 'IBM Plex Mono, monospace' }}>AI READY</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1300px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#e8a020', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>◆ Intelligence Dashboard</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '38px', fontWeight: '800', marginBottom: '8px' }}>
            Analyze Your <span style={{ fontStyle: 'italic', color: '#e8a020' }}>Competitors</span>
          </h1>
          <p style={{ color: '#8b949e', fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>
            Full intelligence report with scores, SEO, ads, content analysis + PDF export
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Setup Panel */}
          <div className="glass-card" style={{ padding: '28px', position: 'sticky', top: '80px' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#e8a020', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Setup Analysis</div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '10px', color: '#8b949e', display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>Your Company Name</label>
              <input className="input-field" placeholder="e.g. MyStartup" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '10px', color: '#8b949e', display: 'block', marginBottom: '10px', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>Competitor URLs ({competitors.length}/5)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {competitors.map((url, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input className="input-field" placeholder={`https://competitor${i + 1}.com`} value={url} onChange={e => updateCompetitor(i, e.target.value)} />
                    {competitors.length > 1 && <button className="remove-btn" onClick={() => removeCompetitor(i)}>×</button>}
                  </div>
                ))}
              </div>
              {competitors.length < 5 && <button className="add-btn" onClick={addCompetitor}>+ Add Competitor</button>}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', padding: '12px', marginBottom: '12px', fontSize: '12px', color: '#f87171', fontFamily: 'Montserrat, sans-serif' }}>
                {error}
              </div>
            )}

            <button className="analyze-btn" onClick={analyze} disabled={loading}>
              {loading ? '⚡ Analyzing...' : '⚡ Analyze Competitors'}
            </button>

            {results && (
              <button className="pdf-btn" onClick={generatePDF} disabled={generatingPDF}>
                {generatingPDF ? '⏳ Generating PDF...' : '📄 Download PDF Report'}
              </button>
            )}

            <div style={{ marginTop: '16px', fontSize: '10px', color: '#333', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em' }}>
              POWERED BY CLAUDE AI + LIVE WEB SEARCH
            </div>
          </div>

          {/* Results */}
          <div ref={reportRef}>
            {loading && (
              <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', border: '3px solid rgba(232,160,32,0.2)', borderTopColor: '#e8a020', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 32px' }} />
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>AI Strategist is working...</div>
                <div style={{ color: '#8b949e', fontSize: '13px', marginBottom: '32px', fontFamily: 'Montserrat, sans-serif' }}>Analyzing SEO, ads, content — building your full report</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', maxWidth: '280px', margin: '0 auto' }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i <= step ? '#e8a020' : '#1a1a2e', flexShrink: 0, boxShadow: i === step ? '0 0 10px #e8a020' : 'none', transition: 'all 0.3s' }} />
                      <span style={{ fontSize: '12px', color: i <= step ? '#e2e8f0' : '#4b5563', fontFamily: 'IBM Plex Mono, monospace' }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '28px', height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #e8a020, #ef4444)', borderRadius: '2px', width: `${((step + 1) / steps.length) * 100}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )}

            {!loading && !results && (
              <div className="glass-card" style={{ padding: '80px 48px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Ready to spy</div>
                <div style={{ color: '#8b949e', fontSize: '14px', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.7' }}>
                  Enter competitors and get a full intelligence report<br />with scores, SEO, ads, content & downloadable PDF.
                </div>
              </div>
            )}

            {results && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#10b981', letterSpacing: '0.1em' }}>
                  ✓ ANALYSIS COMPLETE — {results.length} COMPETITOR{results.length > 1 ? 'S' : ''} ANALYZED
                </div>

                {results.map((comp, i) => (
                  <div key={i} className="comp-card" style={{ animationDelay: `${i * 0.15}s` }}>

                    {/* Colored top bar */}
                    <div style={{ height: '4px', background: getThreatColor(comp.threat_level) }} />

                    {/* Header */}
                    <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>{comp.name}</div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#555', marginBottom: '6px' }}>{comp.url}</div>
                          {comp.tagline && <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>"{comp.tagline}"</div>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <div style={{ background: `${getThreatColor(comp.threat_level)}15`, border: `1px solid ${getThreatColor(comp.threat_level)}40`, borderRadius: '2px', padding: '6px 16px', fontSize: '11px', color: getThreatColor(comp.threat_level), fontFamily: 'IBM Plex Mono, monospace', fontWeight: '700' }}>
                            {comp.threat_level} Threat
                          </div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#e8a020', fontWeight: '600' }}>{comp.pricing}</div>
                        </div>
                      </div>

                      {/* Company meta */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                          { label: 'Founded', val: comp.founded || 'N/A' },
                          { label: 'Employees', val: comp.employees || 'N/A' },
                          { label: 'Funding', val: comp.funding || 'N/A' },
                          { label: 'Model', val: comp.pricing_model || 'N/A' },
                        ].map((item, j) => (
                          <div key={j} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', padding: '12px' }}>
                            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</div>
                            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#e8a020', fontWeight: '600' }}>{item.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score circles */}
                    {comp.scores && (
                      <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: '#e8a020', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>Intelligence Scores</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
                          {[
                            { key: 'overall_threat', label: 'Overall Threat' },
                            { key: 'seo_strength', label: 'SEO' },
                            { key: 'product_strength', label: 'Product' },
                            { key: 'brand_strength', label: 'Brand' },
                            { key: 'growth_rate', label: 'Growth' },
                          ].map(item => (
                            <ScoreCircle key={item.key} value={comp.scores[item.key] || 0} label={item.label} color={getScoreColor(comp.scores[item.key] || 0)} />
                          ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div>
                            {[
                              { key: 'content_quality', label: 'Content Quality' },
                              { key: 'paid_ads_spend', label: 'Paid Ads Spend' },
                              { key: 'pricing_competitiveness', label: 'Pricing Competitiveness' },
                            ].map(item => (
                              <ScoreBar key={item.key} label={item.label} value={comp.scores[item.key] || 0} color={getScoreColor(comp.scores[item.key] || 0)} />
                            ))}
                          </div>
                          <div>
                            {[
                              { key: 'customer_satisfaction', label: 'Customer Satisfaction' },
                              { key: 'market_share', label: 'Market Share' },
                              { key: 'seo_strength', label: 'SEO Strength' },
                            ].map(item => (
                              <ScoreBar key={item.key} label={item.label} value={comp.scores[item.key] || 0} color={getScoreColor(comp.scores[item.key] || 0)} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tabs */}
                    <div style={{ padding: '16px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {tabs.map(tab => (
                        <button key={tab} className={`tab-btn ${activeTab[i] === tab ? 'active' : ''}`} onClick={() => setActiveTab({ ...activeTab, [i]: tab })}>
                          {tabLabels[tab]}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ padding: '24px 28px' }}>

                      {activeTab[i] === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="info-box">
                              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Their USP</div>
                              <div style={{ fontSize: '14px', color: '#e8a020', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>{comp.usp}</div>
                            </div>
                            <div className="info-box">
                              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Target Market</div>
                              <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif' }}>{comp.target_market}</div>
                            </div>
                          </div>
                          <div className="info-box">
                            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Key Features</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {comp.key_features?.map((f, j) => (
                                <span key={j} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', padding: '4px 12px', fontSize: '12px', color: '#8b949e', fontFamily: 'IBM Plex Mono, monospace' }}>{f}</span>
                              ))}
                            </div>
                          </div>
                          <div className="info-box">
                            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Recent Moves</div>
                            <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.6' }}>{comp.recent_moves}</div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '4px', padding: '16px' }}>
                              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>⚠ Their Weakness</div>
                              <div style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.6' }}>{comp.main_weakness}</div>
                            </div>
                            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '4px', padding: '16px' }}>
                              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>⚡ Your Opportunity</div>
                              <div style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.6' }}>{comp.opportunity}</div>
                            </div>
                          </div>
                          {comp.vs_you && (
                            <div className="info-box">
                              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#e8a020', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Head to Head vs {companyName}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                  { label: 'Their Advantage', val: comp.vs_you.their_advantage, color: '#ef4444' },
                                  { label: 'Your Advantage', val: comp.vs_you.your_advantage, color: '#10b981' },
                                  { label: 'Price Comparison', val: comp.vs_you.price_comparison, color: '#e8a020' },
                                  { label: 'Feature Gap', val: comp.vs_you.feature_gap, color: '#8b5cf6' },
                                ].map((item, j) => (
                                  <div key={j}>
                                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: item.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                                    <div style={{ fontSize: '12px', color: '#8b949e', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.5' }}>{item.val}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab[i] === 'seo' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {comp.seo && (
                            <>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {[
                                  { label: 'Monthly Traffic', val: comp.seo.monthly_traffic || 'N/A' },
                                  { label: 'Domain Authority', val: `${comp.seo.domain_authority || 0}/100` },
                                  { label: 'Backlinks', val: comp.seo.backlinks || 'N/A' },
                                ].map((item, j) => (
                                  <div key={j} className="info-box" style={{ textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</div>
                                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: '700', color: '#e8a020' }}>{item.val}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="info-box">
                                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Top Keywords</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {(comp.seo.top_keywords || []).map((kw, j) => (
                                    <span key={j} style={{ background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: '2px', padding: '4px 12px', fontSize: '12px', color: '#e8a020', fontFamily: 'IBM Plex Mono, monospace' }}>{kw}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="info-box">
                                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>SEO Strategy</div>
                                <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.7' }}>{comp.seo.strategy}</div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {activeTab[i] === 'ads' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {comp.paid_ads && (
                            <>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="info-box" style={{ textAlign: 'center' }}>
                                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Est. Monthly Spend</div>
                                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '700', color: '#e8a020' }}>{comp.paid_ads.monthly_spend || 'N/A'}</div>
                                </div>
                                <div className="info-box">
                                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Platforms</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {(comp.paid_ads.platforms || []).map((p, j) => (
                                      <span key={j} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '2px', padding: '4px 12px', fontSize: '12px', color: '#60a5fa', fontFamily: 'IBM Plex Mono, monospace' }}>{p}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="info-box">
                                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Ad Strategy</div>
                                <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.7' }}>{comp.paid_ads.ad_strategy}</div>
                              </div>
                              {comp.paid_ads.top_performing_ad && (
                                <div style={{ background: 'rgba(232,160,32,0.05)', border: '1px solid rgba(232,160,32,0.15)', borderRadius: '4px', padding: '16px' }}>
                                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#e8a020', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Top Performing Ad</div>
                                  <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.7' }}>{comp.paid_ads.top_performing_ad}</div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {activeTab[i] === 'content' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {comp.content && (
                            <>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {[
                                  { label: 'Blog Frequency', val: comp.content.blog_frequency || 'N/A' },
                                  { label: 'Engagement Rate', val: comp.content.engagement_rate || 'N/A' },
                                  { label: 'Platforms', val: (comp.content.social_platforms || []).join(', ') || 'N/A' },
                                ].map((item, j) => (
                                  <div key={j} className="info-box" style={{ textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</div>
                                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#e8a020' }}>{item.val}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="info-box">
                                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Content Strategy</div>
                                <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.7' }}>{comp.content.content_strategy}</div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {activeTab[i] === 'action' && (
                        <div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: '#e8a020', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>
                            🎯 5-Step Action Plan to Beat {comp.name}
                          </div>
                          {(comp.action_plan || []).map((step, j) => (
                            <div key={j} className="action-step">
                              <div className="step-num" style={{ background: `${getImpactColor(step.impact)}15`, border: `1px solid ${getImpactColor(step.impact)}40`, color: getImpactColor(step.impact) }}>
                                {j + 1}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{step.timeline}</span>
                                  <span style={{ background: `${getImpactColor(step.impact)}15`, border: `1px solid ${getImpactColor(step.impact)}30`, borderRadius: '2px', padding: '2px 8px', fontSize: '10px', color: getImpactColor(step.impact), fontFamily: 'IBM Plex Mono, monospace', fontWeight: '600' }}>
                                    {step.impact} Impact
                                  </span>
                                </div>
                                <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.6' }}>{step.action}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Download button at bottom */}
                <button className="pdf-btn" onClick={generatePDF} disabled={generatingPDF} style={{ padding: '18px', fontSize: '12px' }}>
                  {generatingPDF ? '⏳ Generating PDF...' : '📄 Download Full Intelligence Report (PDF)'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;