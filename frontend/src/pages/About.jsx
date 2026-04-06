import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#070707', color: '#f0ece4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
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

        .value-card {
          background: #0c0c0c;
          border: 1px solid #161616;
          border-radius: 4px;
          padding: 36px;
          transition: all 0.3s ease;
          animation: fadeUp 0.6s ease both;
        }
        .value-card:hover {
          border-color: #2a2a2a;
          transform: translateY(-4px);
        }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(232,160,32,0.04)', borderRadius: '50%', filter: 'blur(100px)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,7,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #0f0f0f' }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '800', cursor: 'pointer' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <span className="nav-item" onClick={() => navigate('/')}>Home</span>
          <span className="nav-item" onClick={() => navigate('/pricing')}>Pricing</span>
          <span className="nav-item" onClick={() => navigate('/login')}>Login</span>
          <button onClick={() => navigate('/login')} style={{ background: '#e8a020', border: 'none', color: '#070707', padding: '10px 24px', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '120px 60px 80px' }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#e8a020', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '1px', background: '#e8a020' }} />
          Our Story
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '0.92', marginBottom: '40px' }}>
          Built for the<br />
          <span style={{ fontStyle: 'italic', color: '#e8a020' }}>underdog</span>.
        </h1>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', color: '#555', lineHeight: '1.9', fontWeight: '400', maxWidth: '620px' }}>
          SpyLens was born from a simple frustration — small businesses were losing to competitors they didn't even understand. Enterprise tools existed but cost $20,000 a year. Free tools were useless. There was nothing in between.
        </p>
      </div>

      {/* Mission */}
      <div style={{ position: 'relative', zIndex: 1, background: '#050505', borderTop: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#e8a020', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '20px' }}>Our Mission</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '0.95', marginBottom: '24px' }}>
              Level the<br />
              <span style={{ fontStyle: 'italic', color: '#e8a020' }}>playing field</span>.
            </h2>
          </div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', color: '#444', lineHeight: '1.9', fontWeight: '400' }}>
            We believe every small business deserves to know what their competitors are doing. Not just the ones with big budgets. SpyLens makes enterprise-grade competitive intelligence affordable, automated, and accessible to everyone.
          </p>
        </div>
      </div>

      {/* Values */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '100px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: '800', letterSpacing: '-0.03em' }}>
            What we <span style={{ fontStyle: 'italic', color: '#e8a020' }}>believe</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { num: '01', title: 'Radical Simplicity', desc: 'Intelligence should be easy to understand. We turn complex data into clear, actionable insights anyone can use.' },
            { num: '02', title: 'Speed Over Perfection', desc: 'Ship fast, learn from users, improve continuously. Done is better than perfect.' },
            { num: '03', title: 'Honest Pricing', desc: 'No hidden fees, no tricks. We charge what the product is worth and nothing more.' },
            { num: '04', title: 'User First', desc: 'Every feature we build starts with a real user problem. We talk to customers every week.' },
            { num: '05', title: 'Transparency', desc: 'We are honest about what our AI can and cannot do. No overpromising. No magic.' },
            { num: '06', title: 'Accessibility', desc: 'We never price out the small business that needs us most. Affordability is a core value.' },
          ].map((v, i) => (
            <div key={i} className="value-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#e8a020', letterSpacing: '0.2em', fontWeight: '700', marginBottom: '16px' }}>{v.num}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#f0ece4' }}>{v.title}</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#444', lineHeight: '1.8', fontWeight: '400' }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ position: 'relative', zIndex: 1, background: '#050505', borderTop: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
          {[
            { val: '$20K+', label: 'Saved vs enterprise tools' },
            { val: '60s', label: 'Average analysis time' },
            { val: '10x', label: 'Faster than manual research' },
            { val: '₹49', label: 'Starting per month' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '52px', fontWeight: '800', color: '#e8a020', letterSpacing: '-0.03em', lineHeight: '1' }}>{s.val}</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600', marginTop: '12px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '120px 60px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '0.95', marginBottom: '48px' }}>
          Ready to<br />
          <span style={{ fontStyle: 'italic', color: '#e8a020' }}>get started?</span>
        </h2>
        <button onClick={() => navigate('/dashboard')} style={{ background: '#e8a020', border: 'none', color: '#070707', padding: '18px 56px', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>
          Analyze Competitors Free →
        </button>
      </div>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #0f0f0f', padding: '32px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: '800' }}>
          SPY<span style={{ color: '#e8a020' }}>LENS</span>
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#222', letterSpacing: '0.12em', fontWeight: '600', textTransform: 'uppercase' }}>
          © 2026 SpyLens
        </div>
      </footer>

    </div>
  );
}

export default About;