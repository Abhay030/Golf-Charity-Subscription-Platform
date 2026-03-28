import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Layout components — always loaded
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

// ── Lazy-loaded public pages ──
const Home = lazy(() => import('./pages/public/Home'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const Charities = lazy(() => import('./pages/public/Charities'));
const HowItWorks = lazy(() => import('./pages/public/HowItWorks'));

// ── Lazy-loaded dashboard pages ──
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Scores = lazy(() => import('./pages/dashboard/Scores'));
const MyDraws = lazy(() => import('./pages/dashboard/MyDraws'));
const MyCharity = lazy(() => import('./pages/dashboard/MyCharity'));
const Winnings = lazy(() => import('./pages/dashboard/Winnings'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

// ── Lazy-loaded admin pages ──
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminDraws = lazy(() => import('./pages/admin/AdminDraws'));
const AdminCharities = lazy(() => import('./pages/admin/AdminCharities'));
const AdminWinners = lazy(() => import('./pages/admin/AdminWinners'));

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole === 'subscriber' && user?.subscriptionStatus !== 'active' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// Public layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: '100vh' }}>{children}</main>
    <Footer />
  </>
);

// Suspense fallback for lazy-loaded pages (lightweight, inline)
const PageFallback = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '60vh',
  }}>
    <div style={{
      width: '28px', height: '28px',
      border: '2px solid rgba(29,74,50,0.5)',
      borderTopColor: '#c9a84c',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

// Animated Routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Suspense fallback={<PageFallback />}><Home /></Suspense></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Suspense fallback={<PageFallback />}><Login /></Suspense></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Suspense fallback={<PageFallback />}><Register /></Suspense></PublicLayout>} />
        <Route path="/charities" element={<PublicLayout><Suspense fallback={<PageFallback />}><Charities /></Suspense></PublicLayout>} />
        <Route path="/how-it-works" element={<PublicLayout><Suspense fallback={<PageFallback />}><HowItWorks /></Suspense></PublicLayout>} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <DashboardLayout />
            </Suspense>
          </ProtectedRoute>
        }>
          <Route index element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
          <Route path="scores" element={<Suspense fallback={<PageFallback />}><Scores /></Suspense>} />
          <Route path="draws" element={<Suspense fallback={<PageFallback />}><MyDraws /></Suspense>} />
          <Route path="charity" element={<Suspense fallback={<PageFallback />}><MyCharity /></Suspense>} />
          <Route path="winnings" element={<Suspense fallback={<PageFallback />}><Winnings /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<PageFallback />}><Settings /></Suspense>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Suspense fallback={<Loader />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }>
          <Route index element={<Suspense fallback={<PageFallback />}><AdminDashboard /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageFallback />}><AdminUsers /></Suspense>} />
          <Route path="draws" element={<Suspense fallback={<PageFallback />}><AdminDraws /></Suspense>} />
          <Route path="charities" element={<Suspense fallback={<PageFallback />}><AdminCharities /></Suspense>} />
          <Route path="winners" element={<Suspense fallback={<PageFallback />}><AdminWinners /></Suspense>} />
        </Route>

        {/* 404 redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary fullScreen onRetry={() => window.location.reload()}>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0f2a1e',
                color: '#f0f7f4',
                border: '1px solid #1d4a32',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#0f2a1e' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0f2a1e' } },
            }}
          />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
