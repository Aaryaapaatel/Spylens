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
    setTimeout(() => setLoaded(true), 2000);
    setTimeout(() => setShowContent(true), 2800);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#070707', color: '#f0ece4', overflowX: 'hidden', overflowY: 'auto' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; }

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

        .loader-word {
          font-family: 'Playfair Display', serif;
          font-size: clamp(56px, 12vw, 140px);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f0ece4;
          overflow: hidden;
        }

        .loader-word span {
          display: inline-block;
          animation: revealUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform: translateY(110%);
        }

        .loader-line {
          width: 0;
          height: 1px;
          background: #e8a020;
          animation: expandLine 1.5s ease forwards;
          max-width: 180px;
        }

        .loader-sub {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: #333;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 500;
          animation: fadeIn 1s ease 0.6s both;
        }

        @keyframes expandLine { to { width: 180px; } }
        @keyframes revealUp { to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(70px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .slide-up {
          opacity: 0;
          transform: translateY(80px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .slide-up.show { opacity: 1; transform: translateY(0); }

        .slide-left {
          opacity: 0;
          transform: translateX(-80px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .slide-left.show { opacity: 1; transform: translateX(0); }

        .slide-right {
          opacity: 0;
          transform: translateX(80px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .slide-right.show { opacity: 1; transform: translateX(0); }

        .fade-in {
          opacity: 0;
          transition: opacity 1s ease;
        }
        .fade-in.show { opacity: 1; }

        .silk {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(232,160,32,0.04), transparent),
            radial-gradient(ellipse 60% 80% at 80% 60%, rgba(255,255,255,0.01), transparent);
          pointer-events: none;
          z-index: 0;
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        .cursor-light {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,160,32,0.04), transparent 70%);
          pointer-events: none;
          z-index: 1;
          transition: transform 0.15s ease;
        }

        .nav-item {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: #444;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-item:hover { color: #f0ece4; }

        .btn-primary {
          background: #e8a020;
          color: #070707;
          border: none;
          padding: 16px 40px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        .btn-primary:hover {
          background: #f0b030;
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(232,160,32,0.3);
        }

        .btn-outline {
          background: transparent;
          color: #444;
          border: 1px solid #1e1e1e;
          padding: 16px 40px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        .btn-outline:hover { border-color: #444; color: #f0ece4; }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 8vw, 112px);
          font-weight: 800;
          line-height: 0.92;
          letter-spacing: -0.03em;
        }

        .hero-accent {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          color: #e8a020;
        }

        .stat-val {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 5vw, 72px);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f0ece4;
          line-height: 1;
        }

        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #333;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 10px;
        }

        .feat-card {
          border-top: 1px solid #141414;
          padding: 44px 0;
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
          transition: width 0.5s ease;
        }

        .feat-card:hover::before { width: 100%; }
        .feat-card:hover .feat-num { color: #e8a020; }

        .feat-num {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #2a2a2a;
          letter-spacing: 0.2em;
          font-weight: 700;
          margin-bottom: 20px;
          transition: color 0.3s;
          text-transform: uppercase;
        }

        .feat-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #f0ece4;
        }

        .feat-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #3a3a3a;
          line-height: 1.8;
          font-weight: 400;
        }

        .marquee-track {
          display: inline-flex;
          animation: marquee 30s linear infinite;
          white-space: nowrap;
        }

        .marquee-item {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #222;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
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
          flex-shrink: 0;
        }

        .section-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #e8a020;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 0.95;
        }

        .body-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          color: #3a3a3a;
          line-height: 1.8;
          font-weight: 400;
        }

        .table-header {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .table-cell {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>

      {/* Loader */}
      <div className={`loader ${loaded ? 'hide' : ''}`}>
        <div className="loader-word">
          <span style={{ animationDelay: '0s' }}>SPY</span>
          <span style={{ color: '#e8a020', animationDelay: '0.15s' }}>LENS</span>
        </div>
        <div className="loader-line" />
        <div className="loader-sub">AI Competitor Intelligence</div>
      </div>

      {/* BG Effects */}
      <div className="silk" />
      <div className="grid-overlay" />
      <div className="cursor-light" style={{ transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)` }} />

      {/* Navbar */}
      <nav className={`fade-in ${showContent ? 'show' : ''}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '26px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,7,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #0f0f0f' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.01em' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
        <span className="nav-item" onClick={() => navigate('/pricing')}>Pricing</span>
        <span className="nav-item" onClick={() => navigate('/about')}>About</span>
          <span className="nav-item" onClick={() => navigate('/login')}>Login</span>
          <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={() => navigate('/dashboard')}>
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 60px', paddingTop: '100px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          <div className={`slide-left ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.1s', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
            <div style={{ width: '48px', height: '1px', background: '#e8a020' }} />
            <span className="section-eyebrow" style={{ marginBottom: 0 }}>AI Intelligence Platform — 2026</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'end', marginBottom: '80px' }}>
            <h1 className={`hero-title slide-up ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.2s' }}>
              Know<br />
              what your<br />
              <span className="hero-accent">rivals</span><br />
              are doing.
            </h1>

            <div className={`slide-right ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.35s', paddingBottom: '8px' }}>
              <p className="body-text" style={{ fontSize: '16px', marginBottom: '48px', maxWidth: '420px', color: '#555', lineHeight: '1.9' }}>
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
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#252525', letterSpacing: '0.18em', fontWeight: '600', textTransform: 'uppercase' }}>
                No card required &nbsp;·&nbsp; 2 competitors free &nbsp;·&nbsp; 60 second setup
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`slide-up ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.5s', borderTop: '1px solid #111', paddingTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
            {[
              { val: '$20K', sub: 'Saved vs enterprise' },
              { val: '60s', sub: 'Analysis time' },
              { val: '10x', sub: 'Faster research' },
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
              Competitor Pricing
              <span className="marquee-dot" />
              AI Web Search
              <span className="marquee-dot" />
              Weekly Digest
              <span className="marquee-dot" />
              Threat Scoring
              <span className="marquee-dot" />
              Real Time Intel
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '160px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '120px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '120px' }}>
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: '32px' }}>
              Everything<br />
              you need<br />
              to <span className="hero-accent" style={{ fontSize: 'inherit' }}>win</span>.
            </h2>
            <p className="body-text">
              Built for small businesses who need enterprise-grade intelligence at a price they can actually afford.
            </p>
          </div>

          <div>
            {[
              { num: '01', title: 'Real-time Analysis', desc: 'AI browses competitor websites live. No cached data. No guessing. Fresh intelligence returned in under 60 seconds every single time.' },
              { num: '02', title: 'Weekly Intelligence Digest', desc: 'Every Monday at 8am — a clean email showing exactly what changed with each of your competitors over the past week.' },
              { num: '03', title: 'Pricing Intelligence', desc: 'The moment a competitor changes their pricing, you know. Never lose a deal because you were charging wrong again.' },
              { num: '04', title: 'Threat Scoring', desc: 'AI scores each competitor High, Medium, or Low threat based on their moves, growth signals, and positioning.' },
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

      {/* Comparison */}
      <section style={{ position: 'relative', zIndex: 1, background: '#050505', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '160px 60px' }}>
          <div style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              The honest<br />
              <span className="hero-accent" style={{ fontSize: 'inherit' }}>comparison</span>.
            </h2>
            <p className="body-text" style={{ maxWidth: '300px', textAlign: 'right' }}>
              We're not afraid to show you how we stack up. The numbers speak for themselves.
            </p>
          </div>

          <div style={{ border: '1px solid #111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#0a0a0a', borderBottom: '1px solid #111' }}>
              {['', 'SpyLens', 'Crayon', 'Manual'].map((h, i) => (
                <div key={i} style={{ padding: '24px 32px' }}>
                  <span className="table-header" style={{ color: i === 1 ? '#e8a020' : '#333' }}>{h}</span>
                </div>
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
                <div style={{ padding: '22px 32px' }}><span className="table-cell" style={{ color: '#444' }}>{feat}</span></div>
                <div style={{ padding: '22px 32px', textAlign: 'center' }}><span className="table-cell" style={{ color: '#e8a020' }}>{a}</span></div>
                <div style={{ padding: '22px 32px', textAlign: 'center' }}><span className="table-cell" style={{ color: '#333' }}>{b}</span></div>
                <div style={{ padding: '22px 32px', textAlign: 'center' }}><span className="table-cell" style={{ color: '#333' }}>{c}</span></div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', marginTop: '16px', letterSpacing: '0.1em', fontWeight: '500' }}>
            *Manual research costs 5+ hours per week of your time
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '160px 60px 120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '60px' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(52px, 9vw, 120px)', flex: 1, minWidth: '300px' }}>
            Start<br />
            <span className="hero-accent" style={{ fontSize: 'inherit' }}>knowing</span><br />
            today.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }}>
            <button className="btn-primary" style={{ fontSize: '12px', padding: '20px 56px' }} onClick={() => navigate('/dashboard')}>
              Analyze Competitors Free →
            </button>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase' }}>
              No credit card required
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #0f0f0f', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '800' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', gap: '48px' }}>
          <span className="nav-item">Privacy</span>
          <span className="nav-item">Terms</span>
          <span className="nav-item">Contact</span>
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>
          © 2026 SpyLens
        </div>
      </footer>

    </div>
  );
}

export default Landing;