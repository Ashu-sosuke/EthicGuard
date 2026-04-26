import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Layers, 
  RotateCcw, 
  ChevronRight, 
  Info,
  Zap,
  Sparkles,
  ShieldCheck,
  Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MitigationPage = () => {
  const [columns, setColumns] = useState([]);
  const [sensitiveCol, setSensitiveCol] = useState('');
  const [method, setMethod] = useState('oversampling');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await axios.get('http://localhost:8000/columns');
        setColumns(res.data.columns);
      } catch (err) {
        setError('No dataset active.');
      }
    };
    fetchColumns();
  }, []);

  const handleMitigate = async () => {
    if (!sensitiveCol) return;
    setLoading(true);
    setSuccess(false);
    try {
      await axios.post(`http://localhost:8000/mitigate?sensitive_column=${sensitiveCol}&method=${method}`);
      setSuccess(true);
      setTimeout(() => navigate('/bias-check'), 2000);
    } catch (err) {
      setError('Mitigation failed.');
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    { 
      id: 'oversampling', 
      name: 'Resampling', 
      desc: 'Balance distributions by synthetically mirroring minority groups.',
      icon: Layers,
      color: 'text-cyan-400',
      tag: 'Preprocessing'
    },
    { 
      id: 'reweighting', 
      name: 'Reweighting', 
      desc: 'Assign higher weights to under-represented samples during training.',
      icon: RotateCcw,
      color: 'text-violet-400',
      tag: 'In-processing'
    },
    { 
      id: 'threshold_optimization', 
      name: 'Threshold Optimizer', 
      desc: 'Adjust decision boundaries per group to satisfy equalized odds.',
      icon: Layout,
      color: 'text-pink-400',
      tag: 'Post-processing'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-extrabold neon-text">Mitigation Suite</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Deploy advanced algorithmic strategies to neutralize detected bias and restore mathematical fairness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`glass-card p-6 text-left transition-all relative overflow-hidden group ${
              method === m.id ? 'border-cyan-500/50 bg-cyan-500/10' : 'hover:border-white/20'
            }`}
          >
            {method === m.id && (
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-cyan-500/20 blur-xl rounded-full" />
            )}
            <div className={`p-3 rounded-xl bg-slate-800 w-fit mb-6 ${m.color}`}>
              <m.icon size={24} />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{m.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase border border-white/5">
                {m.tag}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="glass-card p-8 space-y-8">
        <div className="flex items-center gap-4 text-cyan-400">
          <Wand2 />
          <h2 className="text-xl font-bold">Execution Parameters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <label className="block">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Primary Sensitive Feature</span>
            <select 
              value={sensitiveCol} 
              onChange={(e) => setSensitiveCol(e.target.value)}
              className="w-full"
            >
              <option value="">Select Column</option>
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </label>

          <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
            <Info className="text-slate-500 shrink-0 mt-1" size={18} />
            <p className="text-xs text-slate-500 leading-relaxed">
              Applying mitigation will create a new virtual dataset in memory. 
              The original data remains untouched, but subsequent audits and training will use the balanced version.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <button
            onClick={handleMitigate}
            disabled={!sensitiveCol || loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <Zap className="animate-spin" />
            ) : (
              <>
                <Sparkles size={20} /> Deploy {method.replace('_', ' ')} Strategy
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6"
          >
            <div className="glass-card p-10 text-center max-w-sm space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Strategy Deployed</h3>
                <p className="text-slate-400">Dataset has been successfully balanced using {method}. Redirecting to audit...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MitigationPage;
