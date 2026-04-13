import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';
import { User as UserProfile } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      return;
    }

    // Safety timeout: if Supabase doesn't respond in 6 seconds, stop loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Il server Supabase non risponde. Verifica la connessione o se il progetto è attivo.");
      }
    }, 6000);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    }).catch(err => {
      clearTimeout(timeout);
      console.error("Auth error:", err);
      setError("Errore di connessione al servizio di autenticazione.");
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          xp: data.xp,
          level: data.level,
          badges: [], // Badges could be a separate table
          skills: data.skill_stats
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      error,
      signOut, 
      refreshProfile: () => fetchProfile(user?.id || '') 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
