import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiStar, HiCurrencyDollar, HiHeart, HiTicket, HiShieldCheck, HiArrowRight, HiQuestionMarkCircle } from 'react-icons/hi';

const steps = [
  {
    icon: HiStar, step: '01', title: 'Subscribe & Set Up',
    desc: 'Choose a monthly or yearly plan. Select a charity you want to support and set your contribution percentage (minimum 10%).',
    details: ['Monthly or yearly subscription plans available', 'Choose from our curated list of charities', 'Set contribution percentage (10% minimum)'],
  },
  {
    icon: HiTicket, step: '02', title: 'Enter Your Scores',
    desc: 'Submit your latest 5 Stableford golf scores (1–45). These scores become your unique draw numbers.',
    details: ['Only your latest 5 scores are kept', 'Scores must be in Stableford format (1–45)', 'Each score must include the date played', 'New scores replace the oldest automatically'],
  },
  {
    icon: HiCurrencyDollar, step: '03', title: 'Monthly Draw',
    desc: 'Every month, 5 winning numbers are drawn. Match your scores to win!',
    details: ['5-Number Match: 40% of prize pool (Jackpot)', '4-Number Match: 35% of prize pool', '3-Number Match: 25% of prize pool', 'Jackpot rolls over if no 5-match winner', 'Prizes split equally among same-tier winners'],
  },
  {
    icon: HiShieldCheck, step: '04', title: 'Verify & Collect',
    desc: 'Winners upload proof of their scores. Admin verifies and processes payouts.',
    details: ['Upload a screenshot from your golf platform', 'Admin reviews and approves or rejects', 'Payouts are tracked from pending to paid'],
  },
  {
    icon: HiHeart, step: '05', title: 'Impact & Giving',
    desc: 'A portion of every subscription goes to your selected charity. Watch your impact grow.',
    details: ['Minimum 10% charitable contribution', 'You can increase your percentage anytime', 'Independent donations also supported', 'Track total contributions on your dashboard'],
  },
];

const faqs = [
  { q: 'What is the Stableford format?', a: 'Stableford is a scoring system in golf where points are awarded based on your performance on each hole. Scores range from 1 to 45 in our system.' },
  { q: 'How are the winning numbers drawn?', a: 'The admin can choose between random generation (like a lottery) or an algorithmic method that weights numbers based on score frequency across all players.' },
  { q: 'What happens if no one gets a 5-match?', a: 'The 5-match prize (Jackpot) rolls over to the next month, growing the prize pool until someone wins it.' },
  { q: 'Can I change my charity selection?', a: 'Yes! You can change your selected charity and contribution percentage anytime from your dashboard.' },
  { q: 'How do I verify my winnings?', a: 'Upload a screenshot of your scores from your golf platform. Our admin team reviews and approves submissions before processing payouts.' },
];

const HowItWorks = () => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-header">
          <h2>How <span className="gradient-text">It Works</span></h2>
          <p>Everything you need to know about playing, winning, and giving back.</p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '80px' }}>
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="premium-card"
              style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '16px', right: '24px', fontSize: '4rem', fontWeight: 800, fontFamily: 'Outfit', color: 'rgba(26,122,69,0.06)', lineHeight: 1 }}>{item.step}</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <item.icon style={{ color: '#c9a84c' }} size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#8cc5a2', marginBottom: '16px', lineHeight: 1.7 }}>{item.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.details.map((d, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#5a8a6e' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c9a84c', marginTop: '7px', flexShrink: 0 }}></div>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '24px', textAlign: 'center' }}>
            <HiQuestionMarkCircle style={{ display: 'inline', marginRight: '8px', color: '#c9a84c', verticalAlign: 'middle' }} />
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="premium-card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f0f7f4', marginBottom: '8px' }}>{faq.q}</h4>
                <p style={{ fontSize: '14px', color: '#5a8a6e', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '16px 32px', fontSize: '17px' }}>
            Get Started <HiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
