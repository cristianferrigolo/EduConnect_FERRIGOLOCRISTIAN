import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading, error: configError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);

    try {
      const supabase = getSupabase();
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        if (error) throw error;
        setError('Controlla la tua email per confermare la registrazione!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-electric-blue" size={40} />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#050505]">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border-red-500/20">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Configurazione Mancante</h2>
          <p className="text-white/60 text-sm mb-6">{configError}</p>
          <div className="p-4 bg-white/5 rounded-xl text-xs text-left font-mono text-white/40">
            1. Apri il pannello "Secrets"<br/>
            2. Aggiungi VITE_SUPABASE_URL<br/>
            3. Aggiungi VITE_SUPABASE_ANON_KEY
          </div>
        </div>
      </div>
    );
  }

  if (session) return <>{children}</>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
      {/* Background Orbs */}
      <div className="glow-orb w-[600px] h-[600px] -top-40 -left-40 bg-electric-blue/20" />
      <div className="glow-orb w-[500px] h-[500px] -bottom-40 -right-40 bg-vivid-purple/20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel rounded-[32px] p-8 relative z-10 border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue to-vivid-purple flex items-center justify-center mx-auto mb-4 shadow-lg shadow-electric-blue/20">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">EduConnect</h1>
          <p className="text-white/40 text-sm">
            {isLogin ? 'Bentornato! Accedi per continuare.' : 'Crea un account per iniziare il tuo viaggio.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all"
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-electric-blue/50 transition-all"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 group"
          >
            {authLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? 'Accedi' : 'Registrati'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-white/40 hover:text-electric-blue transition-colors"
          >
            {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
