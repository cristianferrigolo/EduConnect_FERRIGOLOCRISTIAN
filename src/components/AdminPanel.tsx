import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  ShieldAlert, 
  Activity,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPanel: React.FC = () => {
  const { user } = useApp();

  const stats = [
    { label: 'Utenti Totali', value: '1,284', change: '+12%', up: true, icon: Users, color: 'text-blue-400' },
    { label: 'Corsi Attivi', value: '42', change: '+5%', up: true, icon: BarChart3, color: 'text-purple-400' },
    { label: 'Report Sicurezza', value: '0', change: '-100%', up: false, icon: ShieldAlert, color: 'text-green-400' },
    { label: 'Attività Piattaforma', value: '85%', change: '+2%', up: true, icon: Activity, color: 'text-orange-400' },
  ];

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pannello <span className="gradient-text">Amministratore</span></h1>
          <p className="text-white/60">Gestione globale e analisi della piattaforma.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Cerca utenti, corsi..."
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 w-64"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="glass-card"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Utenti Recenti</h3>
            <button className="text-xs text-electric-blue hover:underline">Vedi tutti</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-vivid-purple border border-white/10" />
                  <div>
                    <p className="text-sm font-bold">Utente #{i}284</p>
                    <p className="text-xs text-white/40">studente@esempio.it</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase font-bold">Studente</span>
                  <button className="text-white/20 hover:text-white group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Log di Sistema</h3>
            <button className="text-xs text-electric-blue hover:underline">Scarica Report</button>
          </div>
          <div className="space-y-4 font-mono text-[10px]">
            {[
              { time: '12:45:22', msg: 'Backup database completato con successo.', type: 'info' },
              { time: '11:30:05', msg: 'Nuovo corso "Quantum Computing" pubblicato.', type: 'success' },
              { time: '09:15:44', msg: 'Tentativo di accesso fallito da IP 192.168.1.1', type: 'warning' },
              { time: '08:00:00', msg: 'Aggiornamento certificati SSL eseguito.', type: 'info' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-2 border-b border-white/5 last:border-0">
                <span className="text-white/20">{log.time}</span>
                <span className={cn(
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'
                )}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className="text-white/60">{log.msg}</span>
              </div>
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
