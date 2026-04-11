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
  const [liveStats, setLiveStats] = useState({ visitors: 0, analyses: 0, paid: 0 });

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

    // Fetch live stats from Supabase
    const fetchStats = async () => {
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: paidUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('plan', 'free');
      const { count: analyses } = await supabase.from('analyses').select('*', { count: 'exact', head: true });

      // Animate counters
      const target = {
        visitors: (totalUsers || 0) + 142, // add base number
        analyses: analyses || 0,
        paid: paidUsers || 0
      };

      let current = { visitors: 0, analyses: 0, paid: 0 };
      const interval = setInterval(() => {
        let done = true;
        Object.keys(target).forEach(key => {
          if (current[key] < target[key]) {
            current[key] = Math.min(current[key] + Math.ceil(target[key] / 40), target[key]);
            done = false;
          }
        });
        setLiveStats({ ...current });
        if (done) clearInterval(interval);
      }, 40);
    };

    setTimeout(fetchStats, 3500);

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
        @keyframes floatUp { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes blinkDot { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes radarSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseRing { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes barGrow { from { width: 0; } to { width: var(--w); } }
        @keyframes nodeFloat1 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(4px, -6px); } 66% { transform: translate(-3px, 4px); } }
        @keyframes nodeFloat2 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(-5px, 3px); } 66% { transform: translate(4px, -5px); } }
        @keyframes nodeFloat3 { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(3px, 5px); } 66% { transform: translate(-4px, -3px); } }
        @keyframes scanLine { 0% { top: 0%; opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes liveFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

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
        .feat-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #f0ece4; }
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
        .intel-bar { height: 3px; background: rgba(232,160,32,0.1); border-radius: 2px; overflow: hidden; margin-top: 6px; }
        .intel-bar-fill { height: 100%; background: linear-gradient(90deg, #e8a020, #f0b030); border-radius: 2px; animation: barGrow 1.5s ease forwards; }
        .live-stat-card { background: #0c0c0c; border: 1px solid #161616; border-radius: 4px; padding: 20px; display: flex; align-items: center; gap: 16px; transition: border-color 0.3s; }
        .live-stat-card:hover { border-color: rgba(232,160,32,0.2); }
        .live-num { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; color: #e8a020; letter-spacing: -0.02em; animation: countUp 0.5s ease both; }
      `}</style>

      {/* Loader */}
      <div className={`loader ${loaded ? 'hide' : ''}`}>
        <div className="loader-bg-glow" />
        <div className="loader-grid" />
        <div className="loader-corner tl" /><div className="loader-corner tr" />
        <div className="loader-corner bl" /><div className="loader-corner br" />
        <div className="loader-content">
          <div className="loader-word">
            <span style={{ color: '#f0ece4', animationDelay: '0s' }}>SPY</span>
            <span style={{ color: '#e8a020', animationDelay: '0.2s' }}>LENS</span>
          </div>
          <div className="loader-line" />
          <div className="loader-sub">AI Competitor Intelligence Platform</div>
          <div className="loader-dots">
            <div className="loader-dot" /><div className="loader-dot" /><div className="loader-dot" />
          </div>
        </div>
      </div>

      <div className="silk" />
      <div className="grid-overlay" />
      <div className="cursor-light" style={{ transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)` }} />

      {/* Navbar */}
      <nav className={`fade-in ${showContent ? 'show' : ''}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,7,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #0f0f0f' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800' }}>SPY<span style={{ color: '#e8a020' }}>LENS</span></div>
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
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#555' }}>
              Welcome back, <span style={{ color: '#f0ece4', fontWeight: '600' }}>{userName}</span>
            </span>
          </div>
          <div>
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

          {/* Left sticky */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: '32px' }}>
              Everything<br />you need<br />to <span className="hero-accent" style={{ fontSize: 'inherit' }}>win</span>.
            </h2>
            <p className="body-text" style={{ marginBottom: '52px' }}>Built for small businesses who need enterprise-grade intelligence at a price they can actually afford.</p>

            {/* AI Network Visualization */}
            <div style={{ position: 'relative', width: '280px', height: '260px', marginBottom: '32px' }}>
              {/* Grid background */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(232,160,32,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,160,32,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', borderRadius: '4px', border: '1px solid rgba(232,160,32,0.08)' }} />

              {/* Scan line */}
              <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.6), transparent)', animation: 'scanLine 3s ease-in-out infinite', zIndex: 2 }} />

              {/* Network nodes */}
              {[
                { x: '50%', y: '50%', size: 12, color: '#e8a020', glow: true, anim: 'nodeFloat1' },
                { x: '20%', y: '25%', size: 7, color: '#f0b030', anim: 'nodeFloat2' },
                { x: '80%', y: '20%', size: 8, color: '#e8a020', anim: 'nodeFloat3' },
                { x: '15%', y: '70%', size: 6, color: '#e8a020', anim: 'nodeFloat1' },
                { x: '75%', y: '72%', size: 9, color: '#f0b030', anim: 'nodeFloat2' },
                { x: '45%', y: '18%', size: 5, color: '#e8a020', anim: 'nodeFloat3' },
                { x: '85%', y: '50%', size: 6, color: '#e8a020', anim: 'nodeFloat1' },
                { x: '30%', y: '78%', size: 7, color: '#f0b030', anim: 'nodeFloat2' },
              ].map((node, i) => (
                <div key={i} style={{ position: 'absolute', left: node.x, top: node.y, transform: 'translate(-50%, -50%)', animation: `${node.anim} ${3 + i * 0.4}s ease infinite`, animationDelay: `${i * 0.3}s`, zIndex: 3 }}>
                  <div style={{ width: `${node.size}px`, height: `${node.size}px`, borderRadius: '50%', background: node.color, boxShadow: node.glow ? `0 0 20px ${node.color}, 0 0 40px ${node.color}40` : `0 0 8px ${node.color}80` }} />
                </div>
              ))}

              {/* SVG connection lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 280 260">
                {[
                  [140, 130, 56, 65],
                  [140, 130, 224, 52],
                  [140, 130, 42, 182],
                  [140, 130, 210, 187],
                  [140, 130, 126, 47],
                  [140, 130, 238, 130],
                  [56, 65, 126, 47],
                  [224, 52, 238, 130],
                  [42, 182, 84, 203],
                  [210, 187, 238, 130],
                ].map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(232,160,32,0.12)" strokeWidth="1" />
                ))}
              </svg>

              {/* Corner labels */}
              <div style={{ position: 'absolute', top: '6px', left: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: 'rgba(232,160,32,0.4)', letterSpacing: '0.1em' }}>NETWORK</div>
              <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: 'rgba(232,160,32,0.4)', letterSpacing: '0.1em' }}>LIVE</div>

              {/* Floating labels */}
              <div style={{ position: 'absolute', top: '12%', left: '62%', background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: '2px', padding: '3px 8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#e8a020', animation: 'blinkDot 2s ease infinite', zIndex: 4 }}>Notion</div>
              <div style={{ position: 'absolute', top: '55%', left: '55%', background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: '2px', padding: '3px 8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#e8a020', animation: 'blinkDot 2s ease infinite', animationDelay: '0.8s', zIndex: 4 }}>SpyLens</div>
              <div style={{ position: 'absolute', top: '68%', left: '48%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '2px', padding: '3px 8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', color: '#f87171', animation: 'blinkDot 2s ease infinite', animationDelay: '1.2s', zIndex: 4 }}>High ⚠</div>
            </div>



            {/* Live Stats Card */}
            <div style={{ background: '#0c0c0c', border: '1px solid #161616', borderRadius: '4px', padding: '24px', width: '280px' }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#e8a020', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'liveFlash 1s ease infinite' }} />
                Live Platform Stats
              </div>
              {[
                { icon: '👁', label: 'Users on Platform', val: liveStats.visitors, color: '#e8a020' },
                { icon: '⚡', label: 'Analyses Run', val: liveStats.analyses, color: '#3b82f6' },
                { icon: '💎', label: 'Paid Subscribers', val: liveStats.paid, color: '#10b981' },
              ].map((stat, i) => (
                <div key={i} className="live-stat-card" style={{ marginBottom: i < 2 ? '10px' : '0' }}>
                  <div style={{ fontSize: '20px', flexShrink: 0 }}>{stat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#333', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                    <div className="live-num" style={{ color: stat.color }}>{stat.val.toLocaleString()}</div>
                  </div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: stat.color, animation: 'blinkDot 1.5s ease infinite', animationDelay: `${i * 0.3}s`, flexShrink: 0 }} />
                </div>
              ))}
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