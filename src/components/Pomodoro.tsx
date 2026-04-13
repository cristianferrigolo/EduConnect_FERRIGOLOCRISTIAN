import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Pomodoro: React.FC = () => {
  const { isDeepWorkMode, setDeepWorkMode, addActivity } = useApp();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
      addActivity(`ha completato una sessione di ${mode === 'work' ? 'lavoro' : 'pausa'}`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Timer Produttività</h2>
        <p className="text-white/60">Massimizza la tua concentrazione con la tecnica Pomodoro.</p>
      </div>

      <div className="relative">
        {/* Progress Ring */}
        <svg className="w-80 h-80 -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="150"
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="150"
            className={cn(
              "fill-none transition-colors duration-500",
              mode === 'work' ? "stroke-electric-blue" : "stroke-green-400"
            )}
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 150}
            animate={{ 
              strokeDashoffset: (2 * Math.PI * 150) * (1 - timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) 
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold font-mono tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm uppercase font-bold tracking-widest text-white/40 mt-2">
            {mode === 'work' ? 'Sessione Lavoro' : 'Pausa Breve'}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <button 
          onClick={resetTimer}
          className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggleTimer}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-electric-blue to-vivid-purple flex items-center justify-center text-white shadow-2xl shadow-electric-blue/20 hover:scale-105 active:scale-95 transition-all"
        >
          {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
        </button>
        <button 
          onClick={() => {
            setMode(mode === 'work' ? 'break' : 'work');
            setTimeLeft(mode === 'work' ? 5 * 60 : 25 * 60);
          }}
          className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          {mode === 'work' ? <Coffee size={24} /> : <Brain size={24} />}
        </button>
      </div>

      <div className="glass-card p-6 flex items-center gap-6 max-w-md w-full">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
          isDeepWorkMode ? "bg-vivid-purple text-white" : "bg-white/5 text-white/40"
        )}>
          <Zap size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold">Modalità Deep Work</h4>
          <p className="text-xs text-white/40">Oscura l'interfaccia per eliminare le distrazioni.</p>
        </div>
        <button 
          onClick={() => setDeepWorkMode(!isDeepWorkMode)}
          className={cn(
            "w-12 h-6 rounded-full relative transition-colors",
            isDeepWorkMode ? "bg-electric-blue" : "bg-white/10"
          )}
        >
          <motion.div 
            animate={{ x: isDeepWorkMode ? 24 : 4 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white"
          />
        </button>
      </div>
    </div>
  );
};
