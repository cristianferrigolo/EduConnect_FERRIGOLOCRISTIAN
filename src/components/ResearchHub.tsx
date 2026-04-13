import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Highlighter, 
  Download, 
  Share2,
  ChevronRight,
  Book
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

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
  const [selectedDoc, setSelectedDoc] = useState('Report_Finale.md');
  const [highlightMode, setHighlightMode] = useState(false);

  const docs = [
    { name: 'Report_Finale.md', type: 'markdown', size: '12 KB' },
    { name: 'Algoritmi_Quantum.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'Note_Meeting.txt', type: 'text', size: '4 KB' },
  ];

  return (
    <div className="p-8 h-full flex gap-8 overflow-hidden">
      {/* Document Browser */}
      <div className="w-64 flex flex-col gap-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Book className="text-electric-blue" size={20} />
          Documenti
        </h3>
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
      </div>

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
