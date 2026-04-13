import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MoreVertical, 
  MessageSquare, 
  Paperclip,
  CheckCircle2,
  Circle,
  Clock,
  Layout,
  GanttChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { cn } from '../lib/utils';

export const ProjectBoard: React.FC = () => {
  const { projects } = useApp();
  const activeProject = projects[0];
  const [tasks, setTasks] = useState<Task[]>(activeProject.tasks);
  const [view, setView] = useState<'kanban' | 'gantt'>('kanban');

  const columns = [
    { id: 'todo', title: 'Da Fare', icon: Circle, color: 'text-white/40' },
    { id: 'in-progress', title: 'In Corso', icon: Clock, color: 'text-electric-blue' },
    { id: 'done', title: 'Completato', icon: CheckCircle2, color: 'text-green-400' },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">{activeProject.title}</h2>
          <p className="text-white/60">{activeProject.description}</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel p-1 rounded-xl flex">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-2 rounded-lg transition-all", view === 'kanban' ? "bg-white/10 text-electric-blue" : "text-white/40")}
            >
              <Layout size={20} />
            </button>
            <button 
              onClick={() => setView('gantt')}
              className={cn("p-2 rounded-lg transition-all", view === 'gantt' ? "bg-white/10 text-vivid-purple" : "text-white/40")}
            >
              <GanttChart size={20} />
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Nuovo Task
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === 'kanban' ? (
          <motion.div 
            key="kanban"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden"
          >
            {columns.map((col) => (
              <div key={col.id} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <col.icon className={col.color} size={18} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">{col.title}</h3>
                    <span className="bg-white/5 px-2 py-0.5 rounded text-xs text-white/40">
                      {tasks.filter(t => t.status === col.id).length}
                    </span>
                  </div>
                  <button className="text-white/20 hover:text-white">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {tasks.filter(t => t.status === col.id).map((task) => (
                    <motion.div
                      layout
                      key={task.id}
                      className="glass-card p-4 hover:border-white/20 cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded uppercase font-bold",
                          task.priority === 'high' ? "bg-red-500/20 text-red-400" :
                          task.priority === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        )}>
                          {task.priority}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                      <h4 className="font-medium mb-4">{task.title}</h4>
                      <div className="flex justify-between items-center text-white/40">
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1 text-xs">
                            <MessageSquare size={12} /> 2
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Paperclip size={12} /> 1
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-electric-blue to-vivid-purple border border-white/10" />
                      </div>
                    </motion.div>
                  ))}
                  
                  <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/20 hover:text-white hover:border-white/20 transition-all text-sm">
                    + Aggiungi Task
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="gantt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 glass-card overflow-hidden flex flex-col"
          >
            <div className="flex border-b border-white/10">
              <div className="w-64 p-4 border-r border-white/10 font-bold text-xs uppercase tracking-widest text-white/40">Task</div>
              <div className="flex-1 grid grid-cols-7">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
                  <div key={d} className="p-4 text-center text-xs font-bold text-white/40">{d}</div>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {tasks.map((task, i) => (
                <div key={task.id} className="flex border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="w-64 p-4 border-r border-white/10 text-sm font-medium truncate">{task.title}</div>
                  <div className="flex-1 relative p-4">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(i + 2) * 15}%` }}
                      className={cn(
                        "h-6 rounded-full absolute top-1/2 -translate-y-1/2",
                        task.status === 'done' ? "bg-green-400/20 border border-green-400/30" :
                        task.status === 'in-progress' ? "bg-electric-blue/20 border border-electric-blue/30" :
                        "bg-white/5 border border-white/10"
                      )}
                      style={{ left: `${i * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
