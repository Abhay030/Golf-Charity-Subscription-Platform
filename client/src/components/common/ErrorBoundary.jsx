import { Component } from 'react';
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) this.props.onRetry();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: this.props.fullScreen ? '100vh' : '400px',
          padding: '40px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '440px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <HiExclamationCircle style={{ color: '#ef4444' }} size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>
              Something went wrong
            </h3>
            <p style={{ fontSize: '14px', color: '#5a8a6e', lineHeight: 1.6, marginBottom: '24px' }}>
              {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button onClick={this.handleRetry} className="btn-primary" style={{ padding: '12px 28px' }}>
              <HiRefresh size={16} /> Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
