import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  Book, 
  Folder, 
  User, 
  ArrowRight,
  Filter,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

interface SearchResult {
  id: string;
  type: 'course' | 'project' | 'user';
  title: string;
  subtitle: string;
  image?: string;
}

export const SearchMenu: React.FC = () => {
  const { courses, projects, searchQuery, setSearchQuery } = useApp();
  const [filter, setFilter] = useState<'all' | 'courses' | 'projects'>('all');

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const list: SearchResult[] = [];

    // Search Courses
    if (filter === 'all' || filter === 'courses') {
      courses.forEach(c => {
        if (c.title.toLowerCase().includes(query) || c.instructor.toLowerCase().includes(query)) {
          list.push({
            id: c.id,
            type: 'course',
            title: c.title,
            subtitle: `Corso • ${c.instructor}`,
            image: c.thumbnail
          });
        }
      });
    }

    // Search Projects
    if (filter === 'all' || filter === 'projects') {
      projects.forEach(p => {
        if (p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
          list.push({
            id: p.id,
            type: 'project',
            title: p.title,
            subtitle: `Progetto • ${p.tasks.length} task`,
          });
        }
      });
    }

    return list;
  }, [searchQuery, courses, projects, filter]);

  return (
    <div className="p-8 h-full flex flex-col max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Cerca in <span className="gradient-text">EduConnect</span></h1>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-electric-blue/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl focus-within:border-electric-blue/50 transition-all">
            <SearchIcon className="ml-4 text-white/20" size={24} />
            <input 
              autoFocus
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca corsi, progetti, dispense..."
              className="flex-1 bg-transparent border-none py-4 text-xl focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2 hover:bg-white/10 rounded-xl text-white/40"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {(['all', 'courses', 'projects'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-all border capitalize",
                filter === f 
                  ? "bg-electric-blue text-white border-electric-blue shadow-lg shadow-electric-blue/20" 
                  : "glass-panel text-white/40 border-white/5 hover:border-white/10"
              )}
            >
              {f === 'all' ? 'Tutto' : f === 'courses' ? 'Corsi' : 'Progetti'}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <AnimatePresence mode="popLayout">
          {searchQuery ? (
            results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    key={`${result.type}-${result.id}`}
                    className="glass-card group hover:border-electric-blue/30 cursor-pointer flex items-center gap-4 p-4"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0">
                      {result.image ? (
                        <img src={result.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className={cn(
                          "w-full h-full flex items-center justify-center",
                          result.type === 'project' ? "bg-vivid-purple/20 text-vivid-purple" : "bg-electric-blue/20 text-electric-blue"
                        )}>
                          {result.type === 'project' ? <Folder size={24} /> : <Book size={24} />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold truncate group-hover:text-electric-blue transition-colors">{result.title}</h4>
                      <p className="text-xs text-white/40">{result.subtitle}</p>
                    </div>
                    <ArrowRight className="text-white/10 group-hover:text-electric-blue transition-colors" size={20} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-white/20"
              >
                <SearchIcon size={64} className="mb-4" />
                <p className="text-xl font-bold">Nessun risultato trovato</p>
                <p className="text-sm">Prova con parole chiave diverse.</p>
              </motion.div>
            )
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-white/20 uppercase tracking-widest mb-4">Ricerche Suggerite</h3>
                <div className="flex flex-wrap gap-2">
                  {['Quantum Computing', 'React Hooks', 'UI Design', 'Machine Learning', 'Sviluppo Mobile'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 rounded-full glass-panel text-sm hover:border-electric-blue/30 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-electric-blue/10">
                  <Book className="text-electric-blue mb-4" size={32} />
                  <h4 className="font-bold mb-2">Esplora Corsi</h4>
                  <p className="text-xs text-white/40">Sfoglia il catalogo completo dei corsi disponibili.</p>
                </div>
                <div className="glass-card p-6 border-vivid-purple/10">
                  <Folder className="text-vivid-purple mb-4" size={32} />
                  <h4 className="font-bold mb-2">Archivio Progetti</h4>
                  <p className="text-xs text-white/40">Trova ispirazione tra i progetti della community.</p>
                </div>
                <div className="glass-card p-6 border-green-400/10">
                  <User className="text-green-400 mb-4" size={32} />
                  <h4 className="font-bold mb-2">Studenti</h4>
                  <p className="text-xs text-white/40">Connettiti con altri ricercatori e studenti.</p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
