import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Highlighter, 
  Download, 
  Share2,
  ChevronRight,
  Book,
  Plus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

const SAMPLE_MARKDOWN = `
# Analisi del Quantum Computing
## Introduzione
Il calcolo quantistico è un paradigma di calcolo che utilizza i fenomeni della meccanica quantistica...

### Algoritmo di Shor
L'algoritmo di Shor è un algoritmo quantistico per la fattorizzazione di interi...

### Conclusioni
Le potenzialità sono enormi, ma le sfide tecniche rimangono significative.
`;

export const ResearchHub: React.FC = () => {
  const { projects, addProject } = useApp();
  const [selectedDoc, setSelectedDoc] = useState('Report_Finale.md');
  const [highlightMode, setHighlightMode] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const docs = [
    { name: 'Report_Finale.md', type: 'markdown', size: '12 KB' },
    { name: 'Algoritmi_Quantum.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'Note_Meeting.txt', type: 'text', size: '4 KB' },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    addProject({
      title: newProjectTitle,
      description: 'Nuovo progetto di ricerca creato dal Research Hub.',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      members: ['1'],
      tasks: []
    });
    setNewProjectTitle('');
    setShowNewProject(false);
  };

  return (
    <div className="p-8 h-full flex gap-8 overflow-hidden relative">
      {/* Document Browser */}
      <div className="w-64 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Book className="text-electric-blue" size={20} />
            Documenti
          </h3>
          <button 
            onClick={() => setShowNewProject(true)}
            className="p-1.5 rounded-lg glass-panel hover:text-electric-blue transition-colors"
            title="Crea Progetto da Ricerca"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {docs.map(doc => (
            <button
              key={doc.name}
              onClick={() => setSelectedDoc(doc.name)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                selectedDoc === doc.name ? "bg-white/10 border-white/10" : "hover:bg-white/5 text-white/40"
              )}
            >
              <FileText size={18} className={selectedDoc === doc.name ? "text-electric-blue" : ""} />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <p className="text-[10px] opacity-50">{doc.size}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-electric-blue/10 to-vivid-purple/10 border border-white/5">
          <p className="text-[10px] uppercase font-bold text-white/40 mb-2">Progetti Attivi</p>
          <div className="space-y-2">
            {projects.slice(0, 3).map(p => (
              <div key={p.id} className="text-xs font-medium text-white/60 truncate flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-electric-blue" />
                {p.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showNewProject && (
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
              <h3 className="text-xl font-bold mb-6">Crea Progetto di Ricerca</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-2 block">Titolo Progetto</label>
                  <input
                    autoFocus
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="Es: Studio Meccanica Quantistica"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-electric-blue/50"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowNewProject(false)}
                    className="flex-1 py-3 rounded-xl glass-panel text-sm font-bold"
                  >
                    Annulla
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-electric-blue text-white text-sm font-bold"
                  >
                    Crea
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reader Area */}
      <div className="flex-1 glass-card flex flex-col p-0 overflow-hidden">
        <header className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <h4 className="font-bold text-sm">{selectedDoc}</h4>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[10px] text-white/40 uppercase font-bold">Sola Lettura</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setHighlightMode(!highlightMode)}
              className={cn(
                "p-2 rounded-lg transition-all",
                highlightMode ? "bg-electric-blue text-white" : "glass-panel text-white/40 hover:text-white"
              )}
            >
              <Highlighter size={18} />
            </button>
            <button className="p-2 rounded-lg glass-panel text-white/40 hover:text-white">
              <Download size={18} />
            </button>
            <button className="p-2 rounded-lg glass-panel text-white/40 hover:text-white">
              <Share2 size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className={cn(
            "max-w-3xl mx-auto prose prose-invert",
            highlightMode && "selection:bg-yellow-400/30"
          )}>
            {selectedDoc.endsWith('.md') ? (
              <ReactMarkdown>{SAMPLE_MARKDOWN}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-4 py-20">
                <FileText size={64} />
                <p>Anteprima PDF non disponibile in questa demo.</p>
                <button className="btn-primary text-xs">Scarica per visualizzare</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
