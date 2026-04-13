import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthGate } from './components/AuthGate';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CoursePlayer } from './components/CoursePlayer';
import { ProjectBoard } from './components/ProjectBoard';
import { ResearchHub } from './components/ResearchHub';
import { Calendar } from './components/Calendar';
import { Pomodoro } from './components/Pomodoro';
import { AdminPanel } from './components/AdminPanel';
import { EduAssist } from './components/EduAssist';
import { Settings } from './components/Settings';
import { SearchMenu } from './components/SearchMenu';
import { cn } from './lib/utils';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isDeepWorkMode } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'search': return <SearchMenu />;
      case 'courses': return <CoursePlayer />;
      case 'research': return <ResearchHub />;
      case 'projects': return <ProjectBoard />;
      case 'calendar': return <Calendar />;
      case 'pomodoro': return <Pomodoro />;
      case 'admin': return <AdminPanel />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden transition-all duration-1000",
      isDeepWorkMode ? "brightness-[0.3] grayscale-[0.5]" : "brightness-100"
    )}>
      {/* Background Glow Orbs */}
      <div className="glow-orb w-[600px] h-[600px] -top-40 -left-40 bg-electric-blue/30" />
      <div className="glow-orb w-[500px] h-[500px] -bottom-40 -right-40 bg-vivid-purple/30" />
      <div className="glow-orb w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-electric-blue/10" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <EduAssist />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthGate>
    </AuthProvider>
  );
}
