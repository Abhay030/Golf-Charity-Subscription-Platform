import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiCurrencyDollar, HiHeart, HiLightningBolt, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { getFeaturedCharities } from '../../services/api';

const Home = () => {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getFeaturedCharities();
        setCharities(data.charities || []);
      } catch { /* silently fail */ }
    };
    load();
  }, []);

  return (
    <div>
      {/* ===================== HERO SECTION ===================== */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', paddingTop: '80px', overflow: 'hidden'
      }}>
        {/* Background blurs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="float-animate" style={{ position: 'absolute', top: '80px', left: '40px', width: '300px', height: '300px', background: 'rgba(26,122,69,0.08)', borderRadius: '50%', filter: 'blur(120px)' }}></div>
          <div className="float-animate" style={{ position: 'absolute', bottom: '80px', right: '40px', width: '400px', height: '400px', background: 'rgba(201,168,76,0.05)', borderRadius: '50%', filter: 'blur(150px)', animationDelay: '2s' }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '960px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
              borderRadius: '999px', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.05)', marginBottom: '32px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c9a84c', animation: 'pulse-glow 2s ease-in-out infinite' }}></div>
              <span style={{ fontSize: '14px', color: '#c9a84c', fontWeight: 500 }}>Now accepting subscriptions</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
              <span style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#f0f7f4', display: 'block' }}>Play. Win.</span>
              <span className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', display: 'block' }}>Give Back.</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: '18px', color: '#8cc5a2', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Track your golf scores, enter monthly prize draws, and support charities you love — all in one platform that rewards your passion.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <Link to="/register" className="btn-primary pulse-glow btn-glow" style={{ padding: '16px 32px', fontSize: '17px' }}>
                Start Winning Today <HiArrowRight />
              </Link>
              <Link to="/how-it-works" className="btn-outline" style={{ padding: '16px 32px', fontSize: '17px' }}>
                How It Works
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '640px', margin: '80px auto 0' }}
          >
            {[
              { value: '£10K+', label: 'Prize Pool' },
              { value: '500+', label: 'Active Players' },
              { value: '£25K+', label: 'To Charities' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '16px' }}>
                <p className="gradient-text" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, fontFamily: 'Outfit' }}>{stat.value}</p>
                <p style={{ fontSize: '13px', color: '#5a8a6e', marginTop: '4px' }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-header">
            <h2>Simple. Rewarding. <span className="gradient-text">Impactful.</span></h2>
            <p>Three steps to start winning prizes and making a difference</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: HiStar, title: 'Enter Your Scores', desc: 'Submit your latest 5 Stableford golf scores. They become your unique draw numbers.', step: '01' },
              { icon: HiCurrencyDollar, title: 'Win Monthly Prizes', desc: 'Matching numbers in the monthly draw wins you a share of the prize pool.', step: '02' },
              { icon: HiHeart, title: 'Support Charities', desc: 'A portion of every subscription goes directly to your chosen charity.', step: '03' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="premium-card"
                style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '3.5rem', fontWeight: 800, fontFamily: 'Outfit', color: 'rgba(26,122,69,0.08)', lineHeight: 1 }}>
                  {item.step}
                </div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                  <item.icon style={{ color: '#c9a84c' }} size={24} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#8cc5a2', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES + PRIZE POOL ===================== */}
      <section style={{ padding: '96px 24px', borderTop: '1px solid #1d4a32' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '64px', alignItems: 'center' }}>
          {/* Left — Features */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '20px' }}>
              More than a <span className="gradient-text">golf platform</span>
            </h2>
            <p style={{ color: '#8cc5a2', marginBottom: '32px', lineHeight: 1.7 }}>
              We combine competitive entertainment with meaningful giving. Every subscription fuels the prize pool and supports charitable causes across the globe.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: HiLightningBolt, title: 'Monthly Draws', text: 'Algorithm-powered or random draws every month' },
                { icon: HiShieldCheck, title: 'Verified Winners', text: 'Transparent verification and payout process' },
                { icon: HiHeart, title: 'Charity Integration', text: 'Choose your charity and see your impact grow' },
              ].map((f) => (
                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', borderRadius: '12px', transition: 'background 0.2s' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <f.icon style={{ color: '#c9a84c' }} size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f0f7f4', marginBottom: '4px' }}>{f.title}</h4>
                    <p style={{ fontSize: '13px', color: '#5a8a6e' }}>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Prize pool */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="premium-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '160px', background: 'rgba(201,168,76,0.04)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '24px' }}>Prize Pool Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: '5-Number Match', share: '40%', color: 'linear-gradient(135deg, #eab308, #d97706)', tag: 'Jackpot' },
                  { label: '4-Number Match', share: '35%', color: 'linear-gradient(135deg, #c9a84c, #a88a3a)' },
                  { label: '3-Number Match', share: '25%', color: 'linear-gradient(135deg, #1a7a45, #0d4f2b)' },
                ].map((tier) => (
                  <div key={tier.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: '10px', background: '#0b1a14', border: '1px solid #1d4a32'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: tier.color }}></div>
                      <span style={{ fontSize: '14px', color: '#f0f7f4', fontWeight: 500 }}>{tier.label}</span>
                      {tier.tag && <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '999px', background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>{tier.tag}</span>}
                    </div>
                    <span className="gradient-text" style={{ fontSize: '14px', fontWeight: 700 }}>{tier.share}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#5a8a6e', marginTop: '16px' }}>Jackpot rolls over if no 5-match winner</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CHARITIES ===================== */}
      {charities.length > 0 && (
        <section style={{ padding: '96px 24px', borderTop: '1px solid #1d4a32' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="section-header">
              <h2>Charities We <span className="gradient-text">Support</span></h2>
              <p>Your subscription drives real change</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {charities.slice(0, 3).map((charity, i) => (
                <motion.div
                  key={charity._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card"
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={charity.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400'}
                      alt={charity.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#c9a84c', letterSpacing: '0.05em' }}>{charity.category}</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginTop: '8px', marginBottom: '8px' }}>{charity.name}</h3>
                    <p style={{ fontSize: '14px', color: '#5a8a6e', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{charity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/charities" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#c9a84c', fontWeight: 600, textDecoration: 'none', fontSize: '15px' }}>
                View All Charities <HiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===================== CTA ===================== */}
      <section style={{ padding: '96px 24px', borderTop: '1px solid #1d4a32' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '20px' }}>
              Ready to make your scores <span className="gradient-text">count</span>?
            </h2>
            <p style={{ color: '#8cc5a2', marginBottom: '40px', fontSize: '18px', maxWidth: '560px', margin: '0 auto 40px' }}>
              Join hundreds of golfers who play, win, and give back every month.
            </p>
            <Link to="/register" className="btn-primary pulse-glow" style={{ padding: '16px 40px', fontSize: '17px' }}>
              Subscribe Now <HiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
