import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SiteLayout from './layoutpages/SiteLayout';
import CustomCursor from './components/CustomCursor/CustomCursor';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));
const Board = lazy(() => import('./pages/Board'));
const BecomeMember = lazy(() => import('./pages/BecomeMember'));
const Login = lazy(() => import('./pages/Login'));
const Exercises = lazy(() => import('./pages/Exercises'));
const Sessions = lazy(() => import('./pages/Sessions'));
const Events = lazy(() => import('./pages/Events'));
const Suggestions = lazy(() => import('./pages/Suggestions'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Sponsors = lazy(() => import('./pages/Sponsors'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const App = lazy(() => import('./App'));
const Dashboard = lazy(() => import('./components/Dashboard'));

// Enhanced loading component with better UX
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh',
    color: '#eaf2ff',
    gap: '16px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(234, 242, 255, 0.3)',
      borderTop: '3px solid #03A9F4',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ margin: 0, fontSize: '14px' }}>Loading...</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AppRouter = () => (
  <Router>
    <CustomCursor />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/about" element={<SiteLayout><AboutUs /></SiteLayout>} />
        <Route path="/board" element={<SiteLayout><Board /></SiteLayout>} />
        <Route path="/become-member" element={<SiteLayout><BecomeMember /></SiteLayout>} />
        <Route path="/login" element={<SiteLayout><Login /></SiteLayout>} />
        <Route path="/exercises" element={<SiteLayout><Exercises /></SiteLayout>} />
        <Route path="/sessions" element={<SiteLayout><Sessions /></SiteLayout>} />
        <Route path="/events" element={<SiteLayout><Events /></SiteLayout>} />
        <Route path="/suggestions" element={<SiteLayout><Suggestions /></SiteLayout>} />
        <Route path="/leaderboard" element={<SiteLayout><Leaderboard /></SiteLayout>} />
        <Route path="/sponsors" element={<SiteLayout><Sponsors /></SiteLayout>} />
        <Route path="/applications" element={<SiteLayout><ApplicationsPage /></SiteLayout>} />
        <Route path="/form" element={<App />} />
        <Route path="/registeration-admin" element={<SiteLayout><Dashboard /></SiteLayout>} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
