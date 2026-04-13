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
  GanttChart,
  ArrowRight,
  X,
  Calendar as CalendarIcon,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { cn } from '../lib/utils';

export const ProjectBoard: React.FC = () => {
  const { projects, addTask, updateTaskStatus, accentColor } = useApp();
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const [view, setView] = useState<'kanban' | 'gantt'>('kanban');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  const columns = [
    { id: 'todo', title: 'Da Fare', icon: Circle, color: 'text-white/40' },
    { id: 'in-progress', title: 'In Corso', icon: Clock, color: 'text-electric-blue' },
    { id: 'done', title: 'Completato', icon: CheckCircle2, color: 'text-green-400' },
  ] as const;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(activeProject.id, {
      title: newTaskTitle,
      status: 'todo',
      priority: 'medium'
    });
    setNewTaskTitle('');
    setShowNewTask(false);
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    updateTaskStatus(activeProject.id, taskId, status);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div 
            className="cursor-pointer group"
            onClick={() => setShowProjectDetails(true)}
          >
            <h2 className="text-3xl font-bold mb-2 group-hover:text-electric-blue transition-colors flex items-center gap-2" style={{ color: showProjectDetails ? accentColor : '' }}>
              {activeProject.title}
              <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p className="text-white/60 line-clamp-1 max-w-md">{activeProject.description}</p>
          </div>
          <div className="h-12 w-px bg-white/10 mx-2" />
          <div className="flex gap-2">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeProject.id === p.id ? "bg-electric-blue text-white shadow-lg" : "glass-panel text-white/40 hover:text-white"
                )}
                style={activeProject.id === p.id ? { backgroundColor: accentColor } : {}}
              >
                {p.title.split(' ')[0]}
              </button>
            ))}
          </div>
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
          <button 
            onClick={() => setShowNewTask(true)}
            className="btn-primary flex items-center gap-2"
          >
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
                      {activeProject.tasks.filter(t => t.status === col.id).length}
                    </span>
                  </div>
                  <button className="text-white/20 hover:text-white">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {activeProject.tasks.filter(t => t.status === col.id).map((task) => (
                    <motion.div
                      layout
                      key={task.id}
                      className="glass-card p-4 hover:border-white/20 cursor-pointer group"
                      onClick={() => {
                        const nextStatus = col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'done' : 'todo';
                        handleStatusChange(task.id, nextStatus);
                      }}
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
                  
                  {col.id === 'todo' && (
                    <div className="space-y-4">
                      {showNewTask ? (
                        <form onSubmit={handleAddTask} className="glass-card p-4 border-electric-blue/30">
                          <input
                            autoFocus
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Cosa devi fare?"
                            className="w-full bg-transparent border-none text-sm focus:outline-none mb-4"
                          />
                          <div className="flex justify-end gap-2">
                            <button 
                              type="button"
                              onClick={() => setShowNewTask(false)}
                              className="px-3 py-1 text-xs text-white/40 hover:text-white"
                            >
                              Annulla
                            </button>
                            <button 
                              type="submit"
                              className="px-3 py-1 text-xs bg-electric-blue rounded-lg text-white"
                            >
                              Salva
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button 
                          onClick={() => setShowNewTask(true)}
                          className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/20 hover:text-white hover:border-white/20 transition-all text-sm"
                        >
                          + Aggiungi Task
                        </button>
                      )}
                    </div>
                  )}
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
              {activeProject.tasks.map((task, i) => (
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

      {/* Project Details Modal */}
      <AnimatePresence>
        {showProjectDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProjectDetails(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex justify-between items-start mb-8 relative">
                <div>
                  <h2 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>{activeProject.title}</h2>
                  <div className="flex gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1"><CalendarIcon size={14} /> {activeProject.startDate} - {activeProject.endDate}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {activeProject.members.length} Membri</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowProjectDetails(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 relative">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Descrizione Dettagliata</h3>
                  <p className="text-white/80 leading-relaxed">
                    {activeProject.description} Questo progetto mira a fornire una soluzione completa e innovativa nel campo accademico. 
                    Attraverso la collaborazione e l'uso di tecnologie all'avanguardia, puntiamo a raggiungere risultati eccellenti 
                    entro le scadenze prefissate.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-[10px] font-bold uppercase text-white/40 mb-1">Stato Avanzamento</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-electric-blue" 
                          style={{ 
                            width: `${(activeProject.tasks.filter(t => t.status === 'done').length / activeProject.tasks.length) * 100}%`,
                            backgroundColor: accentColor
                          }} 
                        />
                      </div>
                      <span className="text-xs font-bold">
                        {Math.round((activeProject.tasks.filter(t => t.status === 'done').length / activeProject.tasks.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-[10px] font-bold uppercase text-white/40 mb-1">Task Totali</h4>
                    <p className="text-xl font-bold">{activeProject.tasks.length}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setShowProjectDetails(false)}
                    className="btn-primary w-full py-3"
                    style={{ backgroundColor: accentColor }}
                  >
                    Chiudi Dettagli
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
