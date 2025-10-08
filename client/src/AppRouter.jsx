import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SiteLayout from './layoutpages/SiteLayout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import Board from './pages/Board';
import BecomeMember from './pages/BecomeMember';
import Login from './pages/Login';
import Exercises from './pages/Exercises';
import Sessions from './pages/Sessions';
import Events from './pages/Events';
import Suggestions from './pages/Suggestions';
import Leaderboard from './pages/Leaderboard';
import Sponsors from './pages/Sponsors';
import CustomCursor from './components/CustomCursor/CustomCursor';

const AppRouter = () => (
  <Router>
    <CustomCursor />
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
    </Routes>
  </Router>
);

export default AppRouter;
