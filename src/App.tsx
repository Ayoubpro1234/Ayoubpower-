import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Tasks } from './components/Tasks';
import { ChallengesList } from './components/ChallengesList';
import { SocialFeed } from './components/SocialFeed';
import { Profile } from './components/Profile';
import { Chat } from './components/Chat';
import { Leaderboard } from './components/Leaderboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-8 border-black border-t-transparent"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <Login />
      </ErrorBoundary>
    );
  }

  if (profile && !profile.onboardingCompleted) {
    return (
      <ErrorBoundary>
        <Onboarding />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/challenges" element={<ChallengesList />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/videos" element={<SocialFeed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
