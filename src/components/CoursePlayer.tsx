import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Maximize, 
  Plus, 
  Clock,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, Note } from '../types';

export const CoursePlayer: React.FC = () => {
  const { courses, addActivity, addNote: addNoteToContext, deleteNote: deleteNoteFromContext } = useApp();
  const [activeCourseId, setActiveCourseId] = useState<string>(courses[0].id);
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [noteText, setNoteText] = useState('');

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNoteToContext(activeCourse.id, {
      timestamp: currentTime,
      content: noteText,
    });
    setNoteText('');
    addActivity(`ha aggiunto una nota al corso "${activeCourse.title}"`);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNoteFromContext(activeCourse.id, noteId);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8 h-full overflow-y-auto">
      <div className="xl:col-span-2 space-y-6">
        <div className="relative group rounded-3xl overflow-hidden glass-panel border-white/10 shadow-2xl">
          <video
            ref={videoRef}
            src={activeCourse.videoUrl}
            className="w-full aspect-video object-cover"
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
          />
          
          {/* Custom Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <div className="flex items-center gap-4 text-white">
              <button onClick={togglePlay} className="hover:text-electric-blue transition-colors">
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </button>
              <button className="hover:text-electric-blue transition-colors">
                <RotateCcw size={20} />
              </button>
              <div className="flex-1 h-1 bg-white/20 rounded-full relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-electric-blue" 
                  style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono">{formatTime(currentTime)}</span>
              <Volume2 size={20} />
              <Maximize size={20} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{activeCourse.title}</h2>
            <p className="text-white/60">Istruttore: {activeCourse.instructor}</p>
          </div>
          <div className="flex gap-2">
            {courses.map(c => (
              <button 
                key={c.id}
                onClick={() => setActiveCourseId(c.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCourse.id === c.id ? 'bg-electric-blue text-white' : 'glass-panel text-white/60 hover:text-white'}`}
              >
                {c.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="glass-card flex flex-col h-[calc(100vh-10rem)]">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Clock className="text-electric-blue" size={20} />
          Note Intelligenti
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {activeCourse.notes.sort((a, b) => a.timestamp - b.timestamp).map((note) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={note.id} 
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex justify-between items-center mb-2">
                <button 
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = note.timestamp;
                  }}
                  className="text-xs font-mono text-electric-blue hover:underline"
                >
                  {formatTime(note.timestamp)}
                </button>
                <button 
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-sm text-white/80">{note.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="relative">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Aggiungi una nota a questo timestamp..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-electric-blue/50 resize-none h-24"
            />
            <button 
              onClick={handleAddNote}
              className="absolute bottom-4 right-4 w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center text-white hover:scale-110 transition-transform"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
