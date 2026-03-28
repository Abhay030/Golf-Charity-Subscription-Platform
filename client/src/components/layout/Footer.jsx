import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

const Footer = () => (
  <footer style={{ borderTop: '1px solid #1d4a32', background: '#0b1a14' }}>
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: '#0b1a14', fontWeight: 800, fontSize: '13px' }}>DH</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit' }}>
              <span style={{ color: '#f0f7f4' }}>Digital</span>
              <span className="gradient-text" style={{ marginLeft: '5px' }}>Heroes</span>
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#5a8a6e', lineHeight: 1.7 }}>
            Play. Win. Give Back. A modern golf platform where every score matters.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#f0f7f4', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/how-it-works" style={{ fontSize: '14px', color: '#5a8a6e', textDecoration: 'none' }}>How It Works</Link>
            <Link to="/charities" style={{ fontSize: '14px', color: '#5a8a6e', textDecoration: 'none' }}>Charities</Link>
            <Link to="/register" style={{ fontSize: '14px', color: '#5a8a6e', textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#f0f7f4', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#5a8a6e' }}>help@digitalheroes.com</span>
            <span style={{ fontSize: '14px', color: '#5a8a6e' }}>Privacy Policy</span>
            <span style={{ fontSize: '14px', color: '#5a8a6e' }}>Terms of Service</span>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#f0f7f4', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stay Updated</h4>
          <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '12px' }}>Get draw results and platform updates.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="email" placeholder="Your email" className="form-input" style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }} />
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Go</button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #1d4a32', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <p style={{ fontSize: '12px', color: '#5a8a6e' }}>© {new Date().getFullYear()} Digital Heroes. All rights reserved.</p>
        <p style={{ fontSize: '12px', color: '#5a8a6e', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made with <HiHeart style={{ color: '#c9a84c' }} /> for charity
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
