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
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { user: appUser, language, setLanguage, accentColor, setAccentColor } = useApp();
  const [activeSection, setActiveSection] = React.useState('profile');
  const [passwordStatus, setPasswordStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  const sections = [
    { id: 'profile', label: language === 'it' ? 'Profilo' : 'Profile', icon: User },
    { id: 'notifications', label: language === 'it' ? 'Notifiche' : 'Notifications', icon: Bell },
    { id: 'security', label: language === 'it' ? 'Sicurezza' : 'Security', icon: Shield },
    { id: 'appearance', label: language === 'it' ? 'Aspetto' : 'Appearance', icon: Palette },
    { id: 'language', label: language === 'it' ? 'Lingua' : 'Language', icon: Globe },
  ];

  const handlePasswordUpdate = () => {
    setPasswordStatus('loading');
    setTimeout(() => setPasswordStatus('success'), 1500);
    setTimeout(() => setPasswordStatus('idle'), 4000);
  };

  const accentColors = [
    { name: 'Electric Blue', value: '#00D1FF' },
    { name: 'Vivid Purple', value: '#BF00FF' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Rose', value: '#F43F5E' },
    { name: 'Amber', value: '#F59E0B' },
  ];

  const t = (it: string, en: string) => language === 'it' ? it : en;

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('Impostazioni', 'Settings')}</h1>
        <p className="text-white/60">{t('Gestisci il tuo account e le preferenze della piattaforma.', 'Manage your account and platform preferences.')}</p>
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
              style={activeSection === section.id ? { color: accentColor, borderColor: `${accentColor}33`, backgroundColor: `${accentColor}11` } : {}}
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
              <span className="font-medium">{t('Disconnetti', 'Sign Out')}</span>
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
                  <div 
                    className="w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, #BF00FF)` }}
                  >
                    {profile?.name?.charAt(0)}
                  </div>
                  <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-white">
                    <Camera size={24} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{profile?.name}</h3>
                  <p className="text-white/40 mb-4">{profile?.email}</p>
                  <button className="btn-primary text-xs py-2" style={{ backgroundColor: accentColor }}>{t('Modifica Avatar', 'Edit Avatar')}</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase font-bold px-1">{t('Nome Completo', 'Full Name')}</label>
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
                <h4 className="font-bold mb-4">{t('Statistiche Account', 'Account Statistics')}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">{t('Livello', 'Level')}</p>
                    <p className="text-xl font-bold" style={{ color: accentColor }}>{appUser.level}</p>
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
              <h3 className="text-xl font-bold">{t('Sicurezza Account', 'Account Security')}</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-bold">{t('Autenticazione a due fattori', 'Two-Factor Authentication')}</p>
                      <p className="text-xs text-white/40">{t('Aggiungi un ulteriore livello di sicurezza.', 'Add an extra layer of security.')}</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-electric-blue hover:underline" style={{ color: accentColor }}>{t('Attiva', 'Enable')}</button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white/60">{t('Cambia Password', 'Change Password')}</h4>
                  <div className="space-y-4 max-w-md">
                    <input 
                      type="password" 
                      placeholder={t('Password attuale', 'Current password')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <input 
                      type="password" 
                      placeholder={t('Nuova password', 'New password')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <button 
                      onClick={handlePasswordUpdate}
                      disabled={passwordStatus === 'loading'}
                      className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                      style={{ backgroundColor: accentColor }}
                    >
                      {passwordStatus === 'loading' ? t('Aggiornamento...', 'Updating...') : 
                       passwordStatus === 'success' ? t('Password Aggiornata!', 'Password Updated!') : 
                       t('Aggiorna Password', 'Update Password')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'appearance' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold">{t('Aspetto', 'Appearance')}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white/60 mb-4">{t('Colore Accento', 'Accent Color')}</h4>
                  <div className="flex gap-4">
                    {accentColors.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setAccentColor(color.value)}
                        className={cn(
                          "w-12 h-12 rounded-2xl border-2 transition-all flex items-center justify-center",
                          accentColor === color.value ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: color.value, boxShadow: accentColor === color.value ? `0 0 20px ${color.value}44` : 'none' }}
                        title={color.name}
                      >
                        {accentColor === color.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h4 className="font-bold mb-2">{t('Tema Dark', 'Dark Theme')}</h4>
                  <p className="text-sm text-white/40 mb-4">{t('L\'app è ottimizzata per ambienti a bassa luminosità.', 'The app is optimized for low-light environments.')}</p>
                  <div className="flex items-center gap-2 text-electric-blue" style={{ color: accentColor }}>
                    <Shield size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">{t('Attivo di default', 'Active by default')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'language' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h3 className="text-xl font-bold">{t('Lingua', 'Language')}</h3>
              <div className="space-y-4">
                <p className="text-white/60">{t('Seleziona la lingua dell\'interfaccia.', 'Select the interface language.')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setLanguage('it')}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all",
                      language === 'it' ? "border-electric-blue bg-electric-blue/10" : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                    style={language === 'it' ? { borderColor: accentColor, backgroundColor: `${accentColor}11` } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇮🇹</span>
                      <span className="font-bold">Italiano</span>
                    </div>
                    {language === 'it' && <CheckCircle2 size={20} style={{ color: accentColor }} />}
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all",
                      language === 'en' ? "border-electric-blue bg-electric-blue/10" : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                    style={language === 'en' ? { borderColor: accentColor, backgroundColor: `${accentColor}11` } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <span className="font-bold">English</span>
                    </div>
                    {language === 'en' && <CheckCircle2 size={20} style={{ color: accentColor }} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection !== 'profile' && activeSection !== 'security' && activeSection !== 'appearance' && activeSection !== 'language' && (
            <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-4">
              <Bell size={64} />
              <p>{t('Questa sezione sarà disponibile a breve.', 'This section will be available soon.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
