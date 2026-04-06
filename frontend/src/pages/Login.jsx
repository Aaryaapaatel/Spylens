import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignup
        ? { email, password, full_name: name }
        : { email, password };

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        navigate('/dashboard');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to backend. Make sure it is running.');
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050810', color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.3); }
          50% { box-shadow: 0 0 60px rgba(245,158,11,0.6); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .login-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          max-width: 440px;
          backdrop-filter: blur(20px);
          animation: fadeUp 0.6s ease both;
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

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          transition: all 0.2s ease;
          animation: glow 2s ease infinite;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          animation: none;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #f59e0b;
          cursor: pointer;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          text-decoration: underline;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(245,158,11,0.08)', borderRadius: '50%', filter: 'blur(100px)', top: '-100px', right: '-100px', animation: 'pulse 4s ease infinite' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', background: 'rgba(59,130,246,0.06)', borderRadius: '50%', filter: 'blur(100px)', bottom: '-100px', left: '-100px', animation: 'pulse 4s ease infinite', animationDelay: '2s' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(245,158,11,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', padding: '24px' }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ textAlign: 'center', marginBottom: '32px', cursor: 'pointer' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: '800', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SpyLens
          </div>
        </div>

        <div className="login-card" style={{ margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{ color: '#8b949e', fontSize: '14px', fontFamily: 'IBM Plex Sans' }}>
              {isSignup ? 'Start analyzing competitors for free' : 'Sign in to your SpyLens account'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {isSignup && (
              <div>
                <label style={{ fontSize: '13px', color: '#8b949e', display: 'block', marginBottom: '8px', fontFamily: 'IBM Plex Sans' }}>Full Name</label>
                <input className="input-field" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label style={{ fontSize: '13px', color: '#8b949e', display: 'block', marginBottom: '8px', fontFamily: 'IBM Plex Sans' }}>Email</label>
              <input className="input-field" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#8b949e', display: 'block', marginBottom: '8px', fontFamily: 'IBM Plex Sans' }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: '#f87171', fontFamily: 'IBM Plex Sans' }}>
              {error}
            </div>
          )}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Create Account →' : 'Sign In →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#8b949e', fontFamily: 'IBM Plex Sans' }}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button className="toggle-btn" onClick={() => { setIsSignup(!isSignup); setError(''); }}>
              {isSignup ? 'Sign In' : 'Sign Up Free'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#4b5563', fontFamily: 'IBM Plex Mono' }}>
            ✓ No credit card required
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;