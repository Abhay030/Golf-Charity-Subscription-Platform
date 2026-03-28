/* Reusable skeleton screen primitives with hardware-accelerated shimmer */

const baseStyle = {
  background: 'linear-gradient(90deg, rgba(29,74,50,0.3) 0%, rgba(29,74,50,0.6) 40%, rgba(29,74,50,0.3) 80%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
  willChange: 'background-position',
};

export const SkeletonText = ({ width = '100%', height = '14px', style = {} }) => (
  <div style={{ ...baseStyle, width, height, borderRadius: '6px', ...style }} />
);

export const SkeletonTitle = ({ width = '60%', style = {} }) => (
  <div style={{ ...baseStyle, width, height: '24px', borderRadius: '8px', ...style }} />
);

export const SkeletonAvatar = ({ size = '40px', style = {} }) => (
  <div style={{ ...baseStyle, width: size, height: size, borderRadius: '50%', flexShrink: 0, ...style }} />
);

export const SkeletonCard = ({ height = '120px', style = {} }) => (
  <div style={{
    ...baseStyle,
    width: '100%', height,
    borderRadius: '16px',
    border: '1px solid rgba(29,74,50,0.3)',
    ...style,
  }} />
);

export const SkeletonStat = () => (
  <div style={{
    background: 'linear-gradient(145deg, rgba(15,42,30,0.95), rgba(10,59,32,0.7))',
    border: '1px solid rgba(29,74,50,0.5)',
    borderRadius: '16px',
    padding: '20px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <SkeletonText width="80px" height="10px" />
      <SkeletonAvatar size="20px" />
    </div>
    <SkeletonTitle width="50%" />
    <SkeletonText width="60px" height="10px" style={{ marginTop: '8px' }} />
  </div>
);

export const SkeletonRow = () => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 20px', borderRadius: '16px',
    background: 'linear-gradient(145deg, rgba(15,42,30,0.95), rgba(10,59,32,0.7))',
    border: '1px solid rgba(29,74,50,0.5)',
  }}>
    <SkeletonAvatar size="40px" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SkeletonText width="140px" />
      <SkeletonText width="200px" height="10px" />
    </div>
    <SkeletonText width="60px" height="20px" />
  </div>
);

/* Skeleton grid wrapper for loading pages */
export const SkeletonGrid = ({ count = 4, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
    {Array.from({ length: count }, (_, i) => children ? children : <SkeletonStat key={i} />)}
  </div>
);
