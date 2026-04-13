import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  LogOut,
  Camera,
  Mail,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { user: appUser } = useApp();

  const sections = [
    { id: 'profile', label: 'Profilo', icon: User },
    { id: 'notifications', label: 'Notifiche', icon: Bell },
    { id: 'security', label: 'Sicurezza', icon: Shield },
    { id: 'appearance', label: 'Aspetto', icon: Palette },
    { id: 'language', label: 'Lingua', icon: Globe },
  ];

  const [activeSection, setActiveSection] = React.useState('profile');

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Impostazioni</h1>
        <p className="text-white/60">Gestisci il tuo account e le preferenze della piattaforma.</p>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Sidebar Settings */}
        <div className="w-64 space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left",
                activeSection === section.id 
                  ? "bg-electric-blue/10 text-electric-blue border border-electric-blue/20" 
                  : "hover:bg-white/5 text-white/40"
              )}
            >
              <section.icon size={20} />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
          
          <div className="pt-8 mt-8 border-t border-white/10">
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Disconnetti</span>
            </button>
          </div>
        </div>

        {/* Content Settings */}
        <div className="flex-1 glass-card overflow-y-auto custom-scrollbar p-8">
          {activeSection === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-electric-blue to-vivid-purple flex items-center justify-center text-4xl font-bold shadow-2xl">
                    {profile?.name?.charAt(0)}
                  </div>
                  <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-white">
                    <Camera size={24} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{profile?.name}</h3>
                  <p className="text-white/40 mb-4">{profile?.email}</p>
                  <button className="btn-primary text-xs py-2">Modifica Avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase font-bold px-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      defaultValue={profile?.name}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase font-bold px-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="email" 
                      defaultValue={profile?.email}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h4 className="font-bold mb-4">Statistiche Account</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Livello</p>
                    <p className="text-xl font-bold text-electric-blue">{appUser.level}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">XP Totali</p>
                    <p className="text-xl font-bold text-vivid-purple">{appUser.xp}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Badge</p>
                    <p className="text-xl font-bold text-green-400">{appUser.badges.length}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold">Sicurezza Account</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-bold">Autenticazione a due fattori</p>
                      <p className="text-xs text-white/40">Aggiungi un ulteriore livello di sicurezza.</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-electric-blue hover:underline">Attiva</button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white/60">Cambia Password</h4>
                  <div className="space-y-4 max-w-md">
                    <input 
                      type="password" 
                      placeholder="Password attuale"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <input 
                      type="password" 
                      placeholder="Nuova password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <button className="btn-primary w-full py-3">Aggiorna Password</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection !== 'profile' && activeSection !== 'security' && (
            <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-4">
              <Palette size={64} />
              <p>Questa sezione sarà disponibile a breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
