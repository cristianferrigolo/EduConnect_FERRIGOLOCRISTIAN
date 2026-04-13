import React from 'react';
import { motion } from 'framer-motion';
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
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const events = [
    { id: '1', title: 'Esame di Analisi', time: '09:00', type: 'exam', date: new Date() },
    { id: '2', title: 'Consegna Progetto AI', time: '23:59', type: 'deadline', date: new Date() },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
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
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Nuovo Evento
        </button>
      </header>

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
                {/* Event indicators would go here */}
                {isToday(day) && (
                  <div className="space-y-1">
                    <div className="text-[10px] p-1 rounded bg-vivid-purple/20 text-vivid-purple border border-vivid-purple/20 truncate">
                      Esame Analisi
                    </div>
                  </div>
                )}
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
