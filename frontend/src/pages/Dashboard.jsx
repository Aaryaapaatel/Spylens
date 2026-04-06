import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [competitors, setCompetitors] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  const steps = [
    'Initializing AI analyst...',
    'Browsing competitor websites...',
    'Analyzing pricing models...',
    'Identifying weaknesses...',
    'Generating intelligence report...',
  ];

  const addCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, '']);
    }
  };

  const removeCompetitor = (index) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index, value) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const analyze = async () => {
    const validUrls = competitors.filter(url => url.trim() !== '');
    if (!companyName.trim()) {
      setError('Please enter your company name');
      return;
    }
    if (validUrls.length === 0) {
      setError('Please enter at least one competitor URL');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);

    // Simulate steps
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 2000));
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          competitor_urls: validUrls
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to backend. Make sure it is running.');
    }

    setLoading(false);
  };

  const getThreatColor = (level) => {
    if (level === 'High') return '#ef4444';
    if (level === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050810', color: '#e2e8f0', fontFamily: 'system-ui' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Sans:wght@300;400;500&family=IBM+Plex+Mono&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.3); }
          50% { box-shadow: 0 0 60px rgba(245,158,11,0.7); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 15px;
          color: #e2e8f0;
          outline: none;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          border-color: rgba(245,158,11,0.5);
          background: rgba(245,158,11,0.04);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
        }

        .input-field::placeholder { color: #4b5563; }

        .analyze-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
          animation: glow 2s ease infinite;
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          animation: none;
        }

        .glass-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .comp-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          animation: fadeUp 0.5s ease both;
          transition: all 0.3s ease;
        }

        .comp-card:hover {
          border-color: rgba(245,158,11,0.2);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        .tag {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 12px;
          color: #8b949e;
          font-family: 'IBM Plex Mono', monospace;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .remove-btn {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #ef4444;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .remove-btn:hover {
          background: rgba(239,68,68,0.2);
        }

        .add-btn {
          width: 100%;
          padding: 12px;
          background: none;
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #8b949e;
          font-size: 14px;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .add-btn:hover {
          border-color: rgba(245,158,11,0.4);
          color: #f59e0b;
          background: rgba(245,158,11,0.04);
        }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(245,158,11,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(245,158,11,0.06)', borderRadius: '50%', filter: 'blur(100px)', top: '-100px', right: '-100px', zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
          SpyLens
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s ease infinite' }} />
          <span style={{ fontSize: '13px', color: '#8b949e', fontFamily: 'IBM Plex Mono' }}>AI Ready</span>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            ◆ Intelligence Dashboard
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '38px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Analyze Your <span className="shimmer-text">Competitors</span>
          </h1>
          <p style={{ color: '#8b949e', fontSize: '16px', fontFamily: 'IBM Plex Sans' }}>
            Enter competitor URLs and get AI-powered intelligence in 60 seconds
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Setup Panel */}
          <div className="glass-card" style={{ padding: '32px', animation: 'fadeUp 0.6s ease 0.1s both' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
              Setup Analysis
            </div>

            {/* Company name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#8b949e', display: 'block', marginBottom: '8px', fontFamily: 'IBM Plex Sans' }}>
                Your Company Name
              </label>
              <input
                className="input-field"
                placeholder="e.g. MyStartup"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '24px 0' }} />

            {/* Competitors */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: '#8b949e', display: 'block', marginBottom: '12px', fontFamily: 'IBM Plex Sans' }}>
                Competitor URLs ({competitors.length}/5)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {competitors.map((url, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      className="input-field"
                      placeholder={`https://competitor${i + 1}.com`}
                      value={url}
                      onChange={e => updateCompetitor(i, e.target.value)}
                    />
                    {competitors.length > 1 && (
                      <button className="remove-btn" onClick={() => removeCompetitor(i)}>×</button>
                    )}
                  </div>
                ))}
              </div>
              {competitors.length < 5 && (
                <button className="add-btn" onClick={addCompetitor}>
                  + Add Competitor
                </button>
              )}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: '#f87171', fontFamily: 'IBM Plex Sans' }}>
                {error}
              </div>
            )}

            <button
              className="analyze-btn"
              onClick={analyze}
              disabled={loading}
            >
              {loading ? '⚡ Analyzing...' : '⚡ Analyze Competitors'}
            </button>

            <div style={{ marginTop: '16px', fontSize: '12px', color: '#4b5563', textAlign: 'center', fontFamily: 'IBM Plex Mono' }}>
              Powered by Claude AI + Live Web Search
            </div>
          </div>

          {/* Results Panel */}
          <div>
            {/* Loading State */}
            {loading && (
              <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', border: '3px solid rgba(245,158,11,0.2)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 32px' }} />
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
                  AI is researching...
                </div>
                <div style={{ color: '#8b949e', fontSize: '14px', marginBottom: '32px', fontFamily: 'IBM Plex Sans' }}>
                  Browsing competitor websites in real time
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i <= step ? '#f59e0b' : '#21262d', flexShrink: 0, transition: 'background 0.3s', boxShadow: i === step ? '0 0 10px #f59e0b' : 'none' }} />
                      <span style={{ fontSize: '13px', color: i <= step ? '#e2e8f0' : '#4b5563', fontFamily: 'IBM Plex Mono' }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '32px', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '2px', width: `${((step + 1) / steps.length) * 100}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !results && (
              <div className="glass-card" style={{ padding: '80px 48px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                  Ready to spy
                </div>
                <div style={{ color: '#8b949e', fontSize: '15px', fontFamily: 'IBM Plex Sans', lineHeight: '1.7' }}>
                  Enter your competitors on the left and hit Analyze.<br />
                  AI will browse their websites and return full intel in 60 seconds.
                </div>
              </div>
            )}

            {/* Results */}
            {results && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#10b981', letterSpacing: '0.1em' }}>
                  ✓ ANALYSIS COMPLETE — {results.length} COMPETITORS FOUND
                </div>
                {results.map((comp, i) => (
                  <div key={i} className="comp-card" style={{ animationDelay: `${i * 0.1}s` }}>
                    {/* Card Header */}
                    <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{comp.name}</div>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#8b949e' }}>{comp.url}</div>
                      </div>
                      <div style={{ background: `${getThreatColor(comp.threat_level)}15`, border: `1px solid ${getThreatColor(comp.threat_level)}40`, borderRadius: '100px', padding: '6px 14px', fontSize: '12px', color: getThreatColor(comp.threat_level), fontFamily: 'IBM Plex Mono', fontWeight: '500' }}>
                        {comp.threat_level} Threat
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '24px 28px' }}>
                      <p style={{ fontSize: '14px', color: '#8b949e', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.6', fontFamily: 'IBM Plex Sans' }}>"{comp.positioning}"</p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#8b949e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Pricing</div>
                          <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '500', fontFamily: 'IBM Plex Mono' }}>{comp.pricing}</div>
                        </div>
                        <div>
                          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#8b949e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Target Market</div>
                          <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'IBM Plex Sans' }}>{comp.target_market}</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#8b949e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Key Features</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {comp.key_features?.map((f, j) => (
                            <span key={j} className="tag">{f}</span>
                          ))}
                        </div>
                      </div>

                      {/* Recent Moves */}
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#8b949e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Recent Moves</div>
                        <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6', fontFamily: 'IBM Plex Sans' }}>{comp.recent_moves}</div>
                      </div>

                      {/* Weakness */}
                      <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>⚡ Your Opportunity</div>
                        <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6', fontFamily: 'IBM Plex Sans' }}>{comp.opportunity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;