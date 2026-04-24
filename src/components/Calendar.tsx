import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [showNewEvent, setShowNewEvent] = React.useState(false);
  const [newEventTitle, setNewEventTitle] = React.useState('');
  const [newEventDate, setNewEventDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const [newEventType, setNewEventType] = React.useState<'exam' | 'deadline'>('exam');
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const [events, setEvents] = React.useState([
    { id: '1', title: 'Esame di Analisi', time: '09:00', type: 'exam', date: new Date() },
    { id: '2', title: 'Consegna Progetto AI', time: '23:59', type: 'deadline', date: new Date() },
  ]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEventTitle,
      time: format(new Date(), 'HH:mm'),
      type: newEventType,
      date: new Date(newEventDate)
    };
    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setNewEventDate(format(new Date(), 'yyyy-MM-dd'));
    setShowNewEvent(false);
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold capitalize">{format(currentDate, 'MMMM yyyy', { locale: it })}</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 rounded-lg glass-panel hover:bg-white/10 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 rounded-lg glass-panel hover:bg-white/10 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowNewEvent(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Nuovo Evento
        </button>
      </header>

      <AnimatePresence>
        {showNewEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-panel p-8 rounded-3xl max-w-md w-full border-white/10 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6">Aggiungi Nuovo Evento</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-2 block">Titolo Evento</label>
                  <input
                    autoFocus
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Es: Esame di Fisica"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-electric-blue/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-2 block">Data Evento</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-electric-blue/50 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-2 block">Tipo Evento</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as 'exam' | 'deadline')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-electric-blue/50 text-white"
                  >
                    <option value="exam" className="bg-slate-900">Esame</option>
                    <option value="deadline" className="bg-slate-900">Scadenza</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-2 block">Data Evento</label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-electric-blue/50 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-2 block">Tipo Evento</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as 'exam' | 'deadline')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-electric-blue/50 text-white"
                  >
                    <option value="exam" className="bg-slate-900">Esame</option>
                    <option value="deadline" className="bg-slate-900">Scadenza</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowNewEvent(false)}
                    className="flex-1 py-3 rounded-xl glass-panel text-sm font-bold hover:bg-white/5"
                  >
                    Annulla
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-electric-blue text-white text-sm font-bold hover:scale-105 transition-transform"
                  >
                    Salva Evento
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 glass-card p-0 overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 border-b border-white/10">
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
              <div key={day} className="p-4 text-center text-xs font-bold uppercase text-white/40 tracking-widest">
                {day}
              </div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 overflow-y-auto custom-scrollbar">
            {days.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "min-h-[120px] p-4 border-r border-b border-white/5 transition-colors hover:bg-white/5",
                  !isSameMonth(day, monthStart) && "opacity-20",
                  isToday(day) && "bg-electric-blue/5"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-sm font-bold",
                    isToday(day) ? "text-electric-blue" : "text-white/60"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {events
                    .filter(e => format(e.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                    .map(event => (
                      <div 
                        key={event.id}
                        className={cn(
                          "text-[10px] p-1 rounded border truncate",
                          event.type === 'exam' 
                            ? "bg-red-500/20 text-red-400 border-red-500/20" 
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                        )}
                      >
                        {event.title}
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="text-electric-blue" size={20} />
            Prossimi Eventi
          </h3>
          <div className="space-y-4">
            {events.map(event => (
              <motion.div 
                whileHover={{ x: 5 }}
                key={event.id} 
                className="glass-card p-4 border-white/5 hover:border-white/20 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded uppercase font-bold",
                    event.type === 'exam' ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {event.type}
                  </span>
                  <span className="text-xs text-white/40 font-mono">{event.time}</span>
                </div>
                <h4 className="font-bold text-sm mb-3">{event.title}</h4>
                <div className="flex items-center gap-4 text-[10px] text-white/40">
                  <div className="flex items-center gap-1">
                    <Clock size={12} /> Oggi
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} /> Aula Magna
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
