import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Pricing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }, []);

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'Perfect for trying SpyLens',
      features: ['2 competitors tracked', '1 analysis per month', 'Basic insights', 'Email support'],
      cta: 'Get Started Free',
      color: '#333',
      popular: false,
      razorpay: false,
    },
    {
      name: 'Pro',
      price: '₹399',
      period: 'per month',
      desc: 'For solo founders and SMBs',
      features: ['5 competitors tracked', 'Weekly auto analysis', 'Weekly email digest', 'Pricing intelligence', 'CSV export', 'Priority support'],
      cta: 'Start Pro',
      color: '#e8a020',
      popular: true,
      razorpay: true,
      amount: 39900,
    },
    {
      name: 'Business',
      price: '₹1,199',
      period: 'per month',
      desc: 'For growing businesses',
      features: ['15 competitors tracked', 'Daily auto analysis', 'Weekly email digest', 'Slack integration', 'Historical tracking', 'PDF reports', 'Priority support'],
      cta: 'Start Business',
      color: '#3b82f6',
      popular: false,
      razorpay: true,
      amount: 119900,
    },
    {
      name: 'Agency',
      price: '₹3,999',
      period: 'per month',
      desc: 'For agencies managing clients',
      features: ['Unlimited competitors', 'Multiple client workspaces', 'Daily auto analysis', 'White label reports', 'API access', 'Dedicated support', 'Custom integrations'],
      cta: 'Start Agency',
      color: '#10b981',
      popular: false,
      razorpay: true,
      amount: 399900,
    },
  ];

  const handlePayment = (plan) => {
    if (!plan.razorpay) { navigate('/login'); return; }
    setLoading(plan.name);
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: plan.amount,
      currency: 'INR',
      name: 'SpyLens',
      description: `${plan.name} Plan — Monthly Subscription`,
      handler: function (response) {
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
        navigate('/dashboard');
      },
      theme: { color: '#e8a020' },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070707', color: '#f0ece4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .plan-card { background: #0c0c0c; border: 1px solid #161616; border-radius: 4px; padding: 40px; transition: all 0.3s ease; animation: fadeUp 0.6s ease both; display: flex; flex-direction: column; gap: 24px; position: relative; }
        .plan-card:hover { border-color: #2a2a2a; transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .plan-card.popular { border-color: #e8a020; }
        .plan-btn { width: 100%; padding: 14px; border: none; border-radius: 2px; font-size: 11px; font-weight: 800; cursor: pointer; font-family: 'Montserrat', sans-serif; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.2s ease; }
        .plan-btn:hover { transform: translateY(-2px); opacity: 0.9; }
        .feature-item { display: flex; align-items: center; gap: 10px; font-family: 'Montserrat', sans-serif; font-size: 13px; color: #555; font-weight: 400; padding: 8px 0; border-bottom: 1px solid #0f0f0f; }
        .feature-item:last-child { border-bottom: none; }
        .nav-item { font-family: 'Montserrat', sans-serif; font-size: 11px; color: #444; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .nav-item:hover { color: #f0ece4; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '600px', height: '600px', background: 'rgba(232,160,32,0.04)', borderRadius: '50%', filter: 'blur(120px)', top: '-200px', right: '-100px', pointerEvents: 'none' }} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,7,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #0f0f0f' }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800', cursor: 'pointer' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <span className="nav-item" onClick={() => navigate('/')}>Home</span>
          <span className="nav-item" onClick={() => navigate('/about')}>About</span>
          <span className="nav-item" onClick={() => navigate('/login')}>Login</span>
          <button onClick={() => navigate('/login')} style={{ background: '#e8a020', border: 'none', color: '#070707', padding: '10px 24px', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Start Free
          </button>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '100px 24px 80px' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#e8a020', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '24px' }}>Simple Pricing</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '0.95', marginBottom: '24px' }}>
          Start free.<br /><span style={{ fontStyle: 'italic', color: '#e8a020' }}>Scale as you grow.</span>
        </h1>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', color: '#444', maxWidth: '480px', margin: '0 auto', lineHeight: '1.8', fontWeight: '400' }}>
          No hidden fees. No long-term contracts. Cancel anytime.
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 24px 120px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {plans.map((plan, i) => (
          <div key={i} className={`plan-card ${plan.popular ? 'popular' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#e8a020', color: '#070707', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 16px', borderRadius: '2px' }}>
                Most Popular
              </div>
            )}
            <div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: plan.color, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: '800', color: '#f0ece4', letterSpacing: '-0.03em', lineHeight: '1' }}>{plan.price}</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#333', letterSpacing: '0.1em', marginTop: '4px', fontWeight: '500' }}>{plan.period}</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#444', marginTop: '12px', fontWeight: '400', lineHeight: '1.5' }}>{plan.desc}</div>
            </div>
            <div style={{ height: '1px', background: '#111' }} />
            <div style={{ flex: 1 }}>
              {plan.features.map((f, j) => (
                <div key={j} className="feature-item">
                  <span style={{ color: plan.color, fontSize: '14px', flexShrink: 0 }}>✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button className="plan-btn" onClick={() => handlePayment(plan)} disabled={loading === plan.name}
              style={{ background: plan.popular ? '#e8a020' : 'transparent', color: plan.popular ? '#070707' : plan.color, border: plan.popular ? 'none' : `1px solid ${plan.color}30` }}>
              {loading === plan.name ? 'Loading...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto', padding: '0 24px 120px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '60px' }}>Common questions</h2>
        {[
          { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime with no questions asked. Your plan stays active until the end of the billing period.' },
          { q: 'Is there a free trial?', a: 'Yes — the Free plan lets you analyze 2 competitors once per month forever. No credit card needed.' },
          { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.' },
          { q: 'Can I upgrade or downgrade?', a: 'Yes. You can change your plan anytime from your account settings.' },
        ].map((faq, i) => (
          <div key={i} style={{ borderTop: '1px solid #111', padding: '28px 0' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#f0ece4' }}>{faq.q}</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', color: '#444', lineHeight: '1.8', fontWeight: '400' }}>{faq.a}</div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #111' }} />
      </div>

      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #0f0f0f', padding: '32px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: '800' }}>SPY<span style={{ color: '#e8a020' }}>LENS</span></div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>© 2026 SpyLens</div>
      </footer>
    </div>
  );
}

export default Pricing;