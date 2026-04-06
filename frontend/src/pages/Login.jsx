import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (isSignup && !name) {
      setError('Please enter your name');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        setMessage('Account created! Please check your email to verify.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070707', color: '#f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-card {
          background: #0c0c0c;
          border: 1px solid #161616;
          border-radius: 4px;
          padding: 52px;
          width: 100%;
          max-width: 460px;
          animation: fadeUp 0.6s ease both;
        }

        .input-field {
          width: 100%;
          background: #080808;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 14px 18px;
          font-size: 14px;
          color: #f0ece4;
          outline: none;
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          border-color: #e8a020;
          background: #0a0a0a;
        }

        .input-field::placeholder {
          color: #2a2a2a;
          font-weight: 400;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #e8a020;
          border: none;
          border-radius: 2px;
          color: #070707;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: #f0b030;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(232,160,32,0.25);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #e8a020;
          cursor: pointer;
          font-size: 13px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          text-decoration: underline;
        }

        .input-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #444;
          display: block;
          margin-bottom: 8px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
        }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(232,160,32,0.04)', borderRadius: '50%', filter: 'blur(100px)', top: '-100px', right: '-100px', animation: 'pulse 4s ease infinite' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', padding: '24px' }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ textAlign: 'center', marginBottom: '40px', cursor: 'pointer' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '800' }}>
            SPY<span style={{ color: '#e8a020' }}>LENS</span>
          </div>
        </div>

        <div className="login-card" style={{ margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#444', fontWeight: '400' }}>
              {isSignup ? 'Start analyzing competitors for free' : 'Sign in to your SpyLens account'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            {isSignup && (
              <div>
                <label className="input-label">Full Name</label>
                <input className="input-field" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="input-label">Email Address</label>
              <input className="input-field" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '2px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#f87171', fontFamily: 'Montserrat, sans-serif' }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '2px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#34d399', fontFamily: 'Montserrat, sans-serif' }}>
              {message}
            </div>
          )}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Create Account →' : 'Sign In →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#444', fontFamily: 'Montserrat, sans-serif' }}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button className="toggle-btn" onClick={() => { setIsSignup(!isSignup); setError(''); setMessage(''); }}>
              {isSignup ? 'Sign In' : 'Sign Up Free'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>
            No credit card required
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;