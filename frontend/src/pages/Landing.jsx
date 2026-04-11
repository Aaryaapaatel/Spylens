import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

function Landing() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('free');
  const [analysesLeft, setAnalysesLeft] = useState(2);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    setTimeout(() => setLoaded(true), 2500);
    setTimeout(() => setShowContent(true), 3200);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setUserName(session.user.user_metadata?.full_name || session.user.email.split('@')[0]);
        supabase.from('profiles').select('plan, full_name').eq('id', session.user.id).single().then(({ data }) => {
          if (data) {
            setPlan(data.plan || 'free');
            if (data.full_name) setUserName(data.full_name);
            if (data.plan === 'pro' || data.plan === 'business' || data.plan === 'agency') setAnalysesLeft(999);
            else setAnalysesLeft(2);
          }
        });
      }
    });

    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserName('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070707', color: '#f0ece4', overflowX: 'hidden', overflowY: 'auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; }

        .loader { position: fixed; inset: 0; background: #000; z-index: 1000; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 32px; transition: opacity 1s ease, transform 1s cubic-bezier(0.76, 0, 0.24, 1); overflow: hidden; }
        .loader.hide { opacity: 0; transform: translateY(-100%); pointer-events: none; }
        .loader-bg-glow { position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(232,160,32,0.12) 0%, transparent 65%); border-radius: 50%; animation: loaderPulse 2.5s ease infinite; }
        .loader-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(232,160,32,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.04) 1px, transparent 1px); background-size: 60px 60px; }
        .loader-corner { position: absolute; width: 60px; height: 60px; border-color: rgba(232,160,32,0.3); border-style: solid; border-width: 0; animation: cornerFade 0.8s ease 0.3s both; }
        .loader-corner.tl { top: 40px; left: 40px; border-top-width: 1px; border-left-width: 1px; }
        .loader-corner.tr { top: 40px; right: 40px; border-top-width: 1px; border-right-width: 1px; }
        .loader-corner.bl { bottom: 40px; left: 40px; border-bottom-width: 1px; border-left-width: 1px; }
        .loader-corner.br { bottom: 40px; right: 40px; border-bottom-width: 1px; border-right-width: 1px; }
        .loader-content { position: relative; z-index: 2; text-align: center; }
        .loader-word { font-family: 'Playfair Display', serif; font-size: clamp(72px, 14vw, 180px); font-weight: 800; letter-spacing: -0.04em; line-height: 1; overflow: hidden; display: block; }
        .loader-word span { display: inline-block; animation: revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform: translateY(110%); }
        .loader-line { width: 0; height: 1px; margin: 24px auto; background: linear-gradient(90deg, transparent, #e8a020, transparent); animation: expandLine 1.8s ease 0.4s forwards; max-width: 400px; }
        .loader-sub { font-family: 'Montserrat', sans-serif; font-size: 11px; color: #444; letter-spacing: 0.35em; text-transform: uppercase; font-weight: 600; animation: fadeIn 1s ease 0.8s both; }
        .loader-dots { display: flex; gap: 8px; justify-content: center; margin-top: 40px; animation: fadeIn 1s ease 1s both; }
        .loader-dot { width: 4px; height: 4px; border-radius: 50%; background: #e8a020; animation: dotPulse 1.2s ease infinite; }
        .loader-dot:nth-child(2) { animation-delay: 0.2s; }
        .loader-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes loaderPulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 1; } }
        @keyframes cornerFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes expandLine { to { width: 400px; } }
        @keyframes revealUp { to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dotPulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(70px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes orbitX { from { transform: rotateX(0deg) rotateY(0deg); } to { transform: rotateX(360deg) rotateY(360deg); } }
        @keyframes orbitY { from { transform: rotateY(0deg) rotateX(20deg); } to { transform: rotateY(360deg) rotateX(20deg); } }
        @keyframes orbitZ { from { transform: rotateZ(0deg) rotateX(40deg); } to { transform: rotateZ(-360deg) rotateX(40deg); } }
        @keyframes floatOrb { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes blinkDot { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes radarSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseRing { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }

        .slide-up { opacity: 0; transform: translateY(80px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .slide-up.show { opacity: 1; transform: translateY(0); }
        .slide-left { opacity: 0; transform: translateX(-80px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .slide-left.show { opacity: 1; transform: translateX(0); }
        .slide-right { opacity: 0; transform: translateX(80px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .slide-right.show { opacity: 1; transform: translateX(0); }
        .fade-in { opacity: 0; transition: opacity 1s ease; }
        .fade-in.show { opacity: 1; }

        .silk { position: fixed; inset: 0; background: radial-gradient(ellipse 80% 50% at 20% 40%, rgba(232,160,32,0.04), transparent), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(255,255,255,0.01), transparent); pointer-events: none; z-index: 0; }
        .grid-overlay { position: fixed; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px); background-size: 80px 80px; pointer-events: none; z-index: 0; }
        .cursor-light { position: fixed; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(232,160,32,0.04), transparent 70%); pointer-events: none; z-index: 1; transition: transform 0.15s ease; }

        .nav-item { font-family: 'Montserrat', sans-serif; font-size: 11px; color: #444; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .nav-item:hover { color: #f0ece4; }
        .btn-primary { background: #e8a020; color: #070707; border: none; padding: 16px 40px; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; border-radius: 2px; }
        .btn-primary:hover { background: #f0b030; transform: translateY(-3px); box-shadow: 0 20px 60px rgba(232,160,32,0.3); }
        .btn-outline { background: transparent; color: #444; border: 1px solid #1e1e1e; padding: 16px 40px; font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; border-radius: 2px; }
        .btn-outline:hover { border-color: #444; color: #f0ece4; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(52px, 8vw, 112px); font-weight: 800; line-height: 0.92; letter-spacing: -0.03em; }
        .hero-accent { font-family: 'DM Serif Display', serif; font-style: italic; color: #e8a020; }
        .stat-val { font-family: 'Playfair Display', serif; font-size: clamp(44px, 5vw, 72px); font-weight: 800; letter-spacing: -0.03em; color: #f0ece4; line-height: 1; }
        .stat-label { font-family: 'Montserrat', sans-serif; font-size: 10px; color: #333; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-top: 10px; }
        .feat-card { border-top: 1px solid #141414; padding: 44px 0; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .feat-card::before { content: ''; position: absolute; left: 0; top: 0; width: 0; height: 1px; background: #e8a020; transition: width 0.5s ease; }
        .feat-card:hover::before { width: 100%; }
        .feat-card:hover .feat-num { color: #e8a020; }
        .feat-num { font-family: 'Montserrat', sans-serif; font-size: 10px; color: #2a2a2a; letter-spacing: 0.2em; font-weight: 700; margin-bottom: 20px; transition: color 0.3s; text-transform: uppercase; }
        .feat-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; color: #f0ece4; }
        .feat-desc { font-family: 'Montserrat', sans-serif; font-size: 13px; color: #3a3a3a; line-height: 1.8; font-weight: 400; }
        .marquee-track { display: inline-flex; animation: marquee 30s linear infinite; white-space: nowrap; }
        .marquee-item { font-family: 'Montserrat', sans-serif; font-size: 10px; color: #222; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; padding: 0 48px; display: inline-flex; align-items: center; gap: 48px; }
        .marquee-dot { width: 3px; height: 3px; border-radius: 50%; background: #e8a020; display: inline-block; flex-shrink: 0; }
        .section-eyebrow { font-family: 'Montserrat', sans-serif; font-size: 10px; color: #e8a020; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; margin-bottom: 24px; }
        .section-title { font-family: 'Playfair Display', serif; font-weight: 800; letter-spacing: -0.03em; line-height: 0.95; }
        .body-text { font-family: 'Montserrat', sans-serif; font-size: 14px; color: #3a3a3a; line-height: 1.8; font-weight: 400; }
        .table-header { font-family: 'Montserrat', sans-serif; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; }
        .table-cell { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 500; }
        .plan-badge { background: rgba(232,160,32,0.1); border: 1px solid rgba(232,160,32,0.2); border-radius: 2px; padding: 6px 16px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease; }
        .plan-badge:hover { background: rgba(232,160,32,0.2); border-color: rgba(232,160,32,0.4); }
        .user-banner { background: rgba(232,160,32,0.06); border-bottom: 1px solid rgba(232,160,32,0.1); padding: 10px 60px; display: flex; align-items: center; justify-content: space-between; position: fixed; top: 73px; left: 0; right: 0; z-index: 99; backdrop-filter: blur(20px); }
        .data-tag { position: absolute; background: rgba(232,160,32,0.08); border: 1px solid rgba(232,160,32,0.2); border-radius: 2px; padding: 4px 10px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #e8a020; white-space: nowrap; animation: blinkDot 2s ease infinite; }
      `}</style>

      {/* Loader */}
      <div className={`loader ${loaded ? 'hide' : ''}`}>
        <div className="loader-bg-glow" />
        <div className="loader-grid" />
        <div className="loader-corner tl" />
        <div className="loader-corner tr" />
        <div className="loader-corner bl" />
        <div className="loader-corner br" />
        <div className="loader-content">
          <div className="loader-word">
            <span style={{ color: '#f0ece4', animationDelay: '0s' }}>SPY</span>
            <span style={{ color: '#e8a020', animationDelay: '0.2s' }}>LENS</span>
          </div>
          <div className="loader-line" />
          <div className="loader-sub">AI Competitor Intelligence Platform</div>
          <div className="loader-dots">
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>
        </div>
      </div>

      <div className="silk" />
      <div className="grid-overlay" />
      <div className="cursor-light" style={{ transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)` }} />

      {/* Navbar */}
      <nav className={`fade-in ${showContent ? 'show' : ''}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,7,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #0f0f0f' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.01em' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {user ? (
            <>
              <div className="plan-badge" onClick={() => navigate('/pricing')}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#e8a020', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700' }}>{plan.toUpperCase()} PLAN</span>
                {plan === 'free' && <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#666' }}>· {analysesLeft} left</span>}
              </div>
              <button className="btn-outline" style={{ padding: '8px 20px' }} onClick={() => navigate('/dashboard')}>History</button>
              <button className="btn-primary" style={{ padding: '8px 20px' }} onClick={() => navigate('/dashboard')}>Analyse Now →</button>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#444', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
                onMouseOver={e => e.target.style.color = '#ef4444'} onMouseOut={e => e.target.style.color = '#444'}>Logout</button>
            </>
          ) : (
            <>
              <span className="nav-item" onClick={() => navigate('/pricing')}>Pricing</span>
              <span className="nav-item" onClick={() => navigate('/about')}>About</span>
              <span className="nav-item" onClick={() => navigate('/login')}>Login</span>
              <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={() => navigate('/login')}>Start Free</button>
            </>
          )}
        </div>
      </nav>

      {/* User Banner */}
      {user && showContent && (
        <div className="user-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#555', letterSpacing: '0.08em' }}>
              Welcome back, <span style={{ color: '#f0ece4', fontWeight: '600' }}>{userName}</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {plan === 'free' ? (
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#555' }}>
                <span style={{ color: '#e8a020', fontWeight: '700' }}>{analysesLeft}</span> free analyses remaining
                <button onClick={() => navigate('/pricing')} style={{ background: 'none', border: 'none', color: '#e8a020', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '700', cursor: 'pointer', marginLeft: '12px', textDecoration: 'underline' }}>Upgrade →</button>
              </span>
            ) : (
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#555' }}>
                <span style={{ color: '#10b981', fontWeight: '700' }}>Unlimited</span> analyses available
              </span>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 60px', paddingTop: user ? '160px' : '100px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div className={`slide-left ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.1s', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
            <div style={{ width: '48px', height: '1px', background: '#e8a020' }} />
            <span className="section-eyebrow" style={{ marginBottom: 0 }}>AI Intelligence Platform — 2026</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'end', marginBottom: '80px' }}>
            <h1 className={`hero-title slide-up ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.2s' }}>
              {user ? (<>Ready to<br />outsmart your<br /><span className="hero-accent">rivals</span>?</>) : (<>Know<br />what your<br /><span className="hero-accent">rivals</span><br />are doing.</>)}
            </h1>

            <div className={`slide-right ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.35s', paddingBottom: '8px' }}>
              {user ? (
                <>
                  <div style={{ background: '#0c0c0c', border: '1px solid #161616', borderRadius: '4px', padding: '32px', marginBottom: '32px' }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#e8a020', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '20px' }}>Your Account</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ background: '#111', borderRadius: '2px', padding: '16px' }}>
                        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Current Plan</div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '700', color: '#e8a020' }}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
                      </div>
                      <div style={{ background: '#111', borderRadius: '2px', padding: '16px' }}>
                        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Analyses Left</div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: '700', color: plan === 'free' ? '#f0ece4' : '#10b981' }}>{plan === 'free' ? analysesLeft : '∞'}</div>
                      </div>
                    </div>
                    {plan === 'free' && (
                      <button onClick={() => navigate('/pricing')} style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid rgba(232,160,32,0.3)', borderRadius: '2px', color: '#e8a020', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Upgrade to Pro — ₹399/month →
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="btn-primary" onClick={() => navigate('/dashboard')}>Analyse Now →</button>
                    <button className="btn-outline" onClick={() => navigate('/dashboard')}>View History</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="body-text" style={{ fontSize: '16px', marginBottom: '48px', maxWidth: '420px', color: '#555', lineHeight: '1.9' }}>
                    SpyLens uses AI to automatically monitor your competitors — tracking pricing changes, feature launches, and strategic moves. Delivered to your inbox every Monday.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
                    <button className="btn-primary" onClick={() => navigate('/login')}>Analyze Free →</button>
                    <button className="btn-outline" onClick={() => navigate('/login')}>Sign In</button>
                  </div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#252525', letterSpacing: '0.18em', fontWeight: '600', textTransform: 'uppercase' }}>
                    No card required &nbsp;·&nbsp; 2 competitors free &nbsp;·&nbsp; 60 second setup
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={`slide-up ${showContent ? 'show' : ''}`} style={{ transitionDelay: '0.5s', borderTop: '1px solid #111', paddingTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
            {[
              { val: '$20K', sub: 'Saved vs enterprise' },
              { val: '60s', sub: 'Analysis time' },
              { val: '10x', sub: 'Faster research' },
              { val: '₹399', sub: 'Pro plan per month' },
            ].map((s, i) => (
              <div key={i}><div className="stat-val">{s.val}</div><div className="stat-label">{s.sub}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden', borderTop: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f', padding: '20px 0', background: '#050505' }}>
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />Competitor Pricing<span className="marquee-dot" />AI Web Search<span className="marquee-dot" />Weekly Digest<span className="marquee-dot" />Threat Scoring<span className="marquee-dot" />Real Time Intel
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '160px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '120px', alignItems: 'start' }}>

          {/* Left sticky — 3D orb */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: '32px' }}>
              Everything<br />you need<br />to <span className="hero-accent" style={{ fontSize: 'inherit' }}>win</span>.
            </h2>
            <p className="body-text" style={{ marginBottom: '52px' }}>Built for small businesses who need enterprise-grade intelligence at a price they can actually afford.</p>

            {/* 3D Intelligence Orb */}
            <div style={{ position: 'relative', width: '280px', height: '280px' }}>
              {/* Pulse rings */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ position: 'absolute', width: `${i * 80}px`, height: `${i * 80}px`, borderRadius: '50%', border: '1px solid rgba(232,160,32,0.12)', animation: `pulseRing ${2 + i * 0.6}s ease-out infinite`, animationDelay: `${i * 0.5}s` }} />
                ))}
              </div>

              {/* Floating orb */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'floatOrb 4s ease infinite' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>

                  {/* Core */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(232,160,32,0.2), rgba(232,160,32,0.04) 60%, transparent)', border: '1px solid rgba(232,160,32,0.25)', boxShadow: '0 0 50px rgba(232,160,32,0.1), inset 0 0 30px rgba(232,160,32,0.04)' }} />

                  {/* Ring 1 */}
                  <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '1px solid rgba(232,160,32,0.18)', animation: 'orbitX 6s linear infinite', transform: 'rotateX(70deg)' }}>
                    <div style={{ position: 'absolute', top: '-4px', left: '50%', width: '7px', height: '7px', borderRadius: '50%', background: '#e8a020', transform: 'translateX(-50%)', boxShadow: '0 0 10px #e8a020' }} />
                  </div>

                  {/* Ring 2 */}
                  <div style={{ position: 'absolute', inset: '-30px', borderRadius: '50%', border: '1px solid rgba(232,160,32,0.12)', animation: 'orbitY 9s linear infinite', transform: 'rotateY(70deg)' }}>
                    <div style={{ position: 'absolute', top: '-4px', left: '50%', width: '8px', height: '8px', borderRadius: '50%', background: '#f0b030', transform: 'translateX(-50%)', boxShadow: '0 0 12px #f0b030' }} />
                  </div>

                  {/* Ring 3 */}
                  <div style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', border: '1px solid rgba(232,160,32,0.08)', animation: 'orbitZ 12s linear infinite' }}>
                    <div style={{ position: 'absolute', bottom: '-3px', right: '20%', width: '5px', height: '5px', borderRadius: '50%', background: '#e8a020', boxShadow: '0 0 6px #e8a020' }} />
                  </div>

                  {/* Radar */}
                  <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', overflow: 'hidden', opacity: 0.35 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg, transparent 0deg, rgba(232,160,32,0.4) 30deg, transparent 60deg)', animation: 'radarSpin 3s linear infinite', borderRadius: '50%' }} />
                  </div>

                  {/* Center S */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '800', color: '#e8a020', textShadow: '0 0 24px rgba(232,160,32,0.6)' }}>S</div>
                  </div>
                </div>
              </div>

              {/* Floating tags */}
              <div className="data-tag" style={{ top: '8%', left: '68%', animationDelay: '0s' }}>Pricing ↓</div>
              <div className="data-tag" style={{ top: '78%', left: '62%', animationDelay: '0.6s' }}>Threat: High</div>
              <div className="data-tag" style={{ top: '88%', left: '2%', animationDelay: '1.2s' }}>New Feature</div>
            </div>
          </div>

          {/* Features list */}
          <div>
            {[
              { num: '01', title: 'Real-time Analysis', desc: 'AI browses competitor websites live. No cached data. No guessing. Fresh intelligence returned in under 60 seconds every single time.' },
              { num: '02', title: 'Weekly Intelligence Digest', desc: 'Every Monday at 8am — a clean email showing exactly what changed with each of your competitors over the past week.' },
              { num: '03', title: 'Pricing Intelligence', desc: 'The moment a competitor changes their pricing, you know. Never lose a deal because you were charging wrong again.' },
              { num: '04', title: 'Threat Scoring', desc: 'AI scores each competitor High, Medium, or Low threat based on their moves, growth signals, and positioning.' },
              { num: '05', title: 'Weakness Finder', desc: 'Every competitor has gaps. SpyLens finds them automatically and tells you exactly how to exploit them.' },
              { num: '06', title: '10x More Affordable', desc: 'Crayon costs $20K/year. Klue costs $15K/year. SpyLens starts at ₹399/month. Same intelligence. Fraction of the cost.' },
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
      <section id="comparison" style={{ position: 'relative', zIndex: 1, background: '#050505', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '160px 60px' }}>
          <div style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
              The honest<br /><span className="hero-accent" style={{ fontSize: 'inherit' }}>comparison</span>.
            </h2>
            <p className="body-text" style={{ maxWidth: '300px', textAlign: 'right' }}>We're not afraid to show you how we stack up.</p>
          </div>
          <div style={{ border: '1px solid #111', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#0a0a0a', borderBottom: '1px solid #111' }}>
              {['', 'SpyLens', 'Crayon', 'Manual'].map((h, i) => (
                <div key={i} style={{ padding: '24px 32px' }}><span className="table-header" style={{ color: i === 1 ? '#e8a020' : '#333' }}>{h}</span></div>
              ))}
            </div>
            {[
              ['Real-time monitoring', '✓', '✓', '✗'],
              ['AI insights', '✓', '✓', '✗'],
              ['Weekly digest', '✓', '✓', '✗'],
              ['Pricing tracking', '✓', '✓', '✗'],
              ['Setup time', '60 sec', '2 weeks', '0'],
              ['Monthly cost', '₹399', '₹1,25,000+', '₹0*'],
            ].map(([feat, a, b, c], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < 5 ? '1px solid #0d0d0d' : 'none', background: i % 2 === 0 ? 'transparent' : '#040404' }}>
                <div style={{ padding: '22px 32px' }}><span className="table-cell" style={{ color: '#444' }}>{feat}</span></div>
                <div style={{ padding: '22px 32px', textAlign: 'center' }}><span className="table-cell" style={{ color: '#e8a020' }}>{a}</span></div>
                <div style={{ padding: '22px 32px', textAlign: 'center' }}><span className="table-cell" style={{ color: '#333' }}>{b}</span></div>
                <div style={{ padding: '22px 32px', textAlign: 'center' }}><span className="table-cell" style={{ color: '#333' }}>{c}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '160px 60px 120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '60px' }}>
          <h2 className="section-title" style={{ fontSize: 'clamp(52px, 9vw, 120px)', flex: 1, minWidth: '300px' }}>
            {user ? (<>Keep<br /><span className="hero-accent" style={{ fontSize: 'inherit' }}>winning</span><br />today.</>) : (<>Start<br /><span className="hero-accent" style={{ fontSize: 'inherit' }}>knowing</span><br />today.</>)}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }}>
            {user ? (
              <button className="btn-primary" style={{ fontSize: '12px', padding: '20px 56px' }} onClick={() => navigate('/dashboard')}>Analyse Competitors Now →</button>
            ) : (
              <>
                <button className="btn-primary" style={{ fontSize: '12px', padding: '20px 56px' }} onClick={() => navigate('/login')}>Analyze Competitors Free →</button>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', letterSpacing: '0.15em', fontWeight: '600', textTransform: 'uppercase' }}>No credit card required</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #0f0f0f', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '800' }}>SPY<span style={{ color: '#e8a020' }}>LENS</span></div>
        <div style={{ display: 'flex', gap: '48px' }}>
          <span className="nav-item" onClick={() => navigate('/pricing')}>Pricing</span>
          <span className="nav-item" onClick={() => navigate('/about')}>About</span>
          {!user && <span className="nav-item" onClick={() => navigate('/login')}>Login</span>}
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>© 2026 SpyLens</div>
      </footer>

    </div>
  );
}

export default Landing;