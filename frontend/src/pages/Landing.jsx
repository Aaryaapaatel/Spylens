import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);

    // Loading sequence
    setTimeout(() => setLoaded(true), 2000);
    setTimeout(() => setShowContent(true), 2800);

    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#070707', color: '#f0ece4', fontFamily: 'system-ui', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Loading screen */
        .loader {
          position: fixed;
          inset: 0;
          background: #070707;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 24px;
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .loader.hide {
          opacity: 0;
          transform: translateY(-100%);
          pointer-events: none;
        }

        .loader-text {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 10vw, 120px);
          font-weight: 800;
          letter-spacing: -0.05em;
          color: #f0ece4;
          overflow: hidden;
          position: relative;
        }

        .loader-text span {
          display: inline-block;
          animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform: translateY(100%);
        }

        .loader-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #333;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: fadeIn 1s ease 0.5s both;
        }

        .loader-line {
          width: 0;
          height: 1px;
          background: #e8a020;
          animation: expandLine 1.5s ease forwards;
          max-width: 200px;
        }

        @keyframes expandLine {
          to { width: 200px; }
        }

        @keyframes revealUp {
          to { transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Main content animations */
        .slide-up {
          opacity: 0;
          transform: translateY(80px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-up.show {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-left {
          opacity: 0;
          transform: translateX(-80px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-left.show {
          opacity: 1;
          transform: translateX(0);
        }

        .slide-right {
          opacity: 0;
          transform: translateX(80px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-right.show {
          opacity: 1;
          transform: translateX(0);
        }

        .fade-in {
          opacity: 0;
          transition: opacity 1s ease;
        }

        .fade-in.show {
          opacity: 1;
        }

        /* Silk texture overlay */
        .silk {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(232,160,32,0.03), transparent),
            radial-gradient(ellipse 60% 80% at 80% 60%, rgba(255,255,255,0.01), transparent);
          pointer-events: none;
          z-index: 0;
        }

        /* Nav */
        .nav-item {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #444;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-item:hover { color: #f0ece4; }

        /* Buttons */
        .btn-primary {
          background: #f0ece4;
          color: #070707;
          border: none;
          padding: 16px 40px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .btn-primary:hover {
          background: #e8a020;
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(232,160,32,0.25);
        }

        .btn-outline {
          background: transparent;
          color: #444;
          border: 1px solid #1e1e1e;
          padding: 16px 40px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .btn-outline:hover {
          border-color: #444;
          color: #f0ece4;
        }

        /* Feature cards */
        .feat-card {
          border-top: 1px solid #141414;
          padding: 40px 0;
          cursor: default;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feat-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 1px;
          background: #e8a020;
          transition: width 0.4s ease;
        }

        .feat-card:hover::before { width: 100%; }

        .feat-card:hover .feat-num { color: #e8a020; }

        .feat-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #2a2a2a;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          transition: color 0.3s;
        }

        .feat-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
          color: #f0ece4;
        }

        .feat-desc {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          color: #3a3a3a;
          line-height: 1.7;
          font-weight: 300;
        }

        /* Marquee */
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .marquee-track {
          display: inline-flex;
          animation: marquee 25s linear infinite;
          white-space: nowrap;
        }

        .marquee-item {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #222;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0 48px;
          display: inline-flex;
          align-items: center;
          gap: 48px;
        }

        .marquee-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #e8a020;
          display: inline-block;
        }

        /* Cursor light */
        .cursor-light {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,160,32,0.03), transparent 70%);
          pointer-events: none;
          z-index: 1;
          transition: transform 0.15s ease;
        }

        /* Stats */
        .stat-val {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 6vw, 80px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #f0ece4;
          line-height: 1;
        }

        .stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #333;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 12px;
        }

        /* Horizontal scroll hint */
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        .scroll-arrow {
          animation: arrowBounce 2s ease infinite;
          font-size: 18px;
          color: #333;
        }

        /* Grid overlay */
        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes numberCount {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Loading screen */}
      <div className={`loader ${loaded ? 'hide' : ''}`}>
        <div style={{ position: 'relative' }}>
          <div className="loader-text">
            <span style={{ animationDelay: '0s' }}>SPY</span>
            <span style={{ color: '#e8a020', animationDelay: '0.1s' }}>LENS</span>
          </div>
        </div>
        <div className="loader-line" />
        <div className="loader-sub">AI Competitor Intelligence</div>
      </div>

      {/* Background effects */}
      <div className="silk" />
      <div className="grid-overlay" />
      <div className="cursor-light" style={{ transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)` }} />

      {/* Navbar */}
      <nav className={`fade-in ${showContent ? 'show' : ''}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '28px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,7,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #0f0f0f', transitionDelay: '0s' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
          <span className="nav-item">Product</span>
          <span className="nav-item">Pricing</span>
          <span className="nav-item">About</span>
          <span className="nav-item" onClick={() => navigate('/login')}>Login</span>
          <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '11px' }} onClick={() => navigate('/dashboard')}>
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 60px', paddingTop: '100px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          {/* Top label */}
          <div className={`slide-left ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.1s', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px' }}>
            <div style={{ width: '40px', height: '1px', background: '#e8a020' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#e8a020', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              AI Intelligence Platform — 2026
            </span>
          </div>

          {/* Main headline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'end', marginBottom: '80px' }}>
            <div>
              <h1 className={`slide-up ${showContent ? 'show' : ''}`} style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(56px, 8vw, 120px)', fontWeight: '800', lineHeight: '0.9', letterSpacing: '-0.05em', transitionDelay: '0.2s' }}>
                Know<br />
                what your<br />
                <span style={{ color: '#e8a020', fontStyle: 'italic' }}>rivals</span><br />
                are doing.
              </h1>
            </div>

            <div className={`slide-right ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.3s', paddingBottom: '8px' }}>
              <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '17px', color: '#3a3a3a', lineHeight: '1.8', fontWeight: '300', marginBottom: '48px', maxWidth: '420px' }}>
                SpyLens uses AI to automatically monitor your competitors — tracking pricing changes, feature launches, and strategic moves. Delivered to your inbox every Monday.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  Analyze Free →
                </button>
                <button className="btn-outline" onClick={() => navigate('/login')}>
                  Sign In
                </button>
              </div>

              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#222', letterSpacing: '0.1em' }}>
                NO CARD REQUIRED &nbsp;·&nbsp; 2 COMPETITORS FREE &nbsp;·&nbsp; 60 SECOND SETUP
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className={`slide-up ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.5s', borderTop: '1px solid #111', paddingTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
            {[
              { val: '$20K', sub: 'Saved vs enterprise tools' },
              { val: '60s', sub: 'Analysis time' },
              { val: '10x', sub: 'Faster than manual' },
              { val: '$49', sub: 'Starting per month' },
            ].map((s, i) => (
              <div key={i}>
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">{s.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Marquee */}
      <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden', borderTop: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f', padding: '20px 0', background: '#050505' }}>
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              COMPETITOR PRICING
              <span className="marquee-dot" />
              AI WEB SEARCH
              <span className="marquee-dot" />
              WEEKLY DIGEST
              <span className="marquee-dot" />
              THREAT SCORING
              <span className="marquee-dot" />
              REAL TIME INTEL
            </span>
          ))}
        </div>
      </div>

      {/* Features section */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '160px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '120px', alignItems: 'start' }}>

          {/* Left sticky label */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#e8a020', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px' }}>
              What we do
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '0.95', marginBottom: '32px' }}>
              Everything<br />
              you need to<br />
              <span style={{ color: '#e8a020', fontStyle: 'italic' }}>win</span>.
            </h2>
            <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '14px', color: '#3a3a3a', lineHeight: '1.8', fontWeight: '300' }}>
              Built for small businesses who need enterprise-grade intelligence at a price they can actually afford.
            </p>
          </div>

          {/* Right features list */}
          <div>
            {[
              { num: '01', title: 'Real-time Analysis', desc: 'AI browses competitor websites live. No cached data. No guessing. Fresh intelligence returned in under 60 seconds every single time.' },
              { num: '02', title: 'Weekly Intelligence Digest', desc: 'Every Monday at 8am — a clean email showing exactly what changed with each of your competitors over the past week.' },
              { num: '03', title: 'Pricing Intelligence', desc: 'The moment a competitor changes their pricing, you know. Never lose a deal because you were charging wrong again.' },
              { num: '04', title: 'Threat Scoring', desc: 'AI scores each competitor High, Medium, or Low threat based on their moves, growth signals, and positioning. Know where to focus.' },
              { num: '05', title: 'Weakness Finder', desc: 'Every competitor has gaps. SpyLens finds them automatically and tells you exactly how to exploit them.' },
              { num: '06', title: '10x More Affordable', desc: 'Crayon costs $20K/year. Klue costs $15K/year. SpyLens starts at $49/month. Same intelligence. Fraction of the cost.' },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-num">{f.num}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #141414' }} />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ position: 'relative', zIndex: 1, background: '#050505', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '160px 60px' }}>
          <div style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '0.95' }}>
              The honest<br />
              <span style={{ color: '#e8a020', fontStyle: 'italic' }}>comparison</span>.
            </h2>
            <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '14px', color: '#3a3a3a', maxWidth: '300px', lineHeight: '1.8', textAlign: 'right', fontWeight: '300' }}>
              We're not afraid to show you how we stack up. The numbers speak for themselves.
            </p>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid #111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#0a0a0a', borderBottom: '1px solid #111' }}>
              {['', 'SpyLens', 'Crayon', 'Manual'].map((h, i) => (
                <div key={i} style={{ padding: '24px 32px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: i === 1 ? '#e8a020' : '#333', textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>
            {[
              ['Real-time monitoring', '✓', '✓', '✗'],
              ['AI insights', '✓', '✓', '✗'],
              ['Weekly digest', '✓', '✓', '✗'],
              ['Pricing tracking', '✓', '✓', '✗'],
              ['Setup time', '60 sec', '2 weeks', '0'],
              ['Monthly cost', '$49', '$1,500+', '$0*'],
            ].map(([feat, a, b, c], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < 5 ? '1px solid #0d0d0d' : 'none', background: i % 2 === 0 ? 'transparent' : '#040404' }}>
                <div style={{ padding: '22px 32px', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '14px', color: '#444', fontWeight: '300' }}>{feat}</div>
                <div style={{ padding: '22px 32px', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: '#e8a020' }}>{a}</div>
                <div style={{ padding: '22px 32px', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: '#333' }}>{b}</div>
                <div style={{ padding: '22px 32px', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: '#333' }}>{c}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#222', marginTop: '16px', letterSpacing: '0.08em' }}>
            *Manual research costs 5+ hours per week of your time
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '160px 60px 120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '60px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(52px, 9vw, 130px)', fontWeight: '800', letterSpacing: '-0.05em', lineHeight: '0.85', flex: 1, minWidth: '300px' }}>
            Start<br />
            <span style={{ color: '#e8a020', fontStyle: 'italic' }}>knowing</span><br />
            today.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }}>
            <button className="btn-primary" style={{ fontSize: '14px', padding: '20px 56px' }} onClick={() => navigate('/dashboard')}>
              Analyze Competitors Free →
            </button>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#222', letterSpacing: '0.1em' }}>
              NO CREDIT CARD REQUIRED
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #0f0f0f', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', gap: '48px' }}>
          <span className="nav-item">Privacy</span>
          <span className="nav-item">Terms</span>
          <span className="nav-item">Contact</span>
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#222', letterSpacing: '0.08em' }}>
          © 2026 SPYLENS
        </div>
      </footer>

    </div>
  );
}

export default Landing;