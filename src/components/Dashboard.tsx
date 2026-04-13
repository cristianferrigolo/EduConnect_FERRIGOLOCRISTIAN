import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Star, Zap, Clock, ArrowUpRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { courses, projects, activities, user } = useApp();
  const { profile } = useAuth();

  if (!profile) return null;

  // Calculate dynamic skills based on course progress
  const calculateSkill = (category: string, base: number) => {
    const relevantCourses = courses.filter(c => c.title.toLowerCase().includes(category.toLowerCase()));
    if (relevantCourses.length === 0) return base;
    const avgProgress = relevantCourses.reduce((acc, curr) => acc + curr.progress, 0) / relevantCourses.length;
    return Math.min(100, Math.round(base + (avgProgress / 5)));
  };

  const radarData = [
    { subject: 'Programmazione', A: calculateSkill('Web', user.skills.programming), fullMark: 100 },
    { subject: 'Design', A: calculateSkill('Design', user.skills.design), fullMark: 100 },
    { subject: 'Ricerca', A: calculateSkill('Science', user.skills.research), fullMark: 100 },
    { subject: 'Comunicazione', A: calculateSkill('Comm', user.skills.communication), fullMark: 100 },
    { subject: 'Management', A: calculateSkill('Management', user.skills.management), fullMark: 100 },
  ];

  const totalProgress = courses.reduce((acc, curr) => acc + curr.progress, 0);
  const completedTasks = projects.reduce((acc, curr) => acc + curr.tasks.filter(t => t.status === 'done').length, 0);

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Bentornato, <span className="gradient-text">{profile.name}</span></h1>
          <p className="text-white/60">Hai completato {completedTasks} task questa settimana. Ottimo lavoro!</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card flex items-center gap-3 py-2 px-4 border-electric-blue/20">
            <div className="w-8 h-8 rounded-lg bg-electric-blue/20 flex items-center justify-center text-electric-blue">
              <Zap size={18} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold">Livello</p>
              <p className="font-bold">{user.level}</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 py-2 px-4 border-vivid-purple/20">
            <div className="w-8 h-8 rounded-lg bg-vivid-purple/20 flex items-center justify-center text-vivid-purple">
              <Star size={18} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold">XP Totali</p>
              <p className="font-bold">{user.xp}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card lg:col-span-1"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Trophy className="text-electric-blue" size={20} />
            Skill Radar
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#00D1FF"
                  fill="#00D1FF"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock className="text-vivid-purple" size={20} />
            Corsi in Corso
          </h3>
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="group cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium group-hover:text-electric-blue transition-colors">{course.title}</span>
                  <span className="text-sm text-white/40">{course.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    className="h-full bg-gradient-to-r from-electric-blue to-vivid-purple"
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium">
            Vedi tutti i corsi <ArrowUpRight size={16} />
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold mb-6">Badge Sbloccati</h3>
          <div className="flex gap-4 flex-wrap">
            {profile.badges.map((badge) => (
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 15, 
                  rotateX: -15,
                  z: 50
                }}
                key={badge.id}
                className="w-20 h-20 rounded-2xl glass-panel flex flex-col items-center justify-center gap-1 border-white/5 hover:border-vivid-purple/50 transition-all group perspective-1000 shadow-xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span className="text-3xl group-hover:scale-125 transition-transform" style={{ transform: 'translateZ(20px)' }}>{badge.icon}</span>
                <span className="text-[10px] text-white/40 uppercase font-bold" style={{ transform: 'translateZ(10px)' }}>{badge.name}</span>
              </motion.div>
            ))}
            <div className="w-20 h-20 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-white/20">
              <span className="text-xs">Prossimo...</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold mb-6">Attività Recente</h3>
          <div className="space-y-4">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-electric-blue mt-2" />
                <div>
                  <p className="text-sm"><span className="font-bold">{activity.user}</span> {activity.action}</p>
                  <p className="text-xs text-white/40">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : (
              <p className="text-white/40 text-sm italic">Nessuna attività recente.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
