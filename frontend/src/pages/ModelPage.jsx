import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Target, 
  Activity, 
  BarChart, 
  Info,
  ChevronRight,
  Zap,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ModelPage = () => {
  const [columns, setColumns] = useState([]);
  const [target, setTarget] = useState('');
  const [sensitiveCol, setSensitiveCol] = useState('');
  const [modelType, setModelType] = useState('logistic_regression');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [geminiReport, setGeminiReport] = useState(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await axios.get('http://localhost:8000/columns');
        setColumns(res.data.columns);
      } catch (err) {
        setError('No data found. Upload a dataset first.');
      }
    };
    fetchColumns();
  }, []);

  const handleTrain = async () => {
    if (!target || !sensitiveCol) return;
    if (target === sensitiveCol) {
      setError("Target Variable and Sensitive Feature cannot be the same column.");
      return;
    }
    
    setLoading(true);
    setResults(null);
    setGeminiReport(null);
    setError(null);
    try {
      const res = await axios.post(`http://localhost:8000/train?target=${target}&sensitive_column=${sensitiveCol}&model_type=${modelType}`);
      setResults(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Training failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeminiLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/generate-gemini-report', {
        accuracy: results.accuracy,
        demographic_parity: results.fairness_metrics.demographic_parity_difference,
        equalized_odds: results.fairness_metrics.equalized_odds_difference,
        target: target,
        sensitive_column: sensitiveCol,
        model_type: modelType
      });
      setGeminiReport(res.data.report);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate report.');
    } finally {
      setGeminiLoading(false);
    }
  };

  const importanceData = results?.feature_importance 
    ? Object.entries(results.feature_importance).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold neon-text">Model Lab</h1>
        <p className="text-slate-400">Train models and evaluate their ethical performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Config Sidebar */}
        <div className="glass-card p-6 h-fit space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Target Variable</span>
              <select 
                value={target} 
                onChange={(e) => setTarget(e.target.value)}
                className="w-full"
              >
                <option value="">Select Target</option>
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Sensitive Feature</span>
              <select 
                value={sensitiveCol} 
                onChange={(e) => setSensitiveCol(e.target.value)}
                className="w-full"
              >
                <option value="">Select Sensitive</option>
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Algorithm</span>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {['logistic_regression', 'decision_tree'].map(type => (
                  <button
                    key={type}
                    onClick={() => setModelType(type)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all ${
                      modelType === type 
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400' 
                        : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                      {modelType === type && <Zap size={14} className="fill-cyan-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </label>
          </div>

          <button
            onClick={handleTrain}
            disabled={!target || !sensitiveCol || loading}
            className="w-full btn-primary"
          >
            {loading ? 'Training...' : 'Start Training'}
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {!results && !loading && !error && (
              <div className="glass-card p-12 text-center border-dashed border-2">
                <BrainCircuit className="text-slate-700 mx-auto mb-4" size={48} />
                <p className="text-slate-500">Configure parameters and start training to see results</p>
              </div>
            )}

            {results && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Accuracy Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/10 to-transparent">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy Score</p>
                    <p className="text-4xl font-black">{(results.accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-violet-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Demographic Parity</p>
                    <p className="text-3xl font-bold">{(results.fairness_metrics.demographic_parity_difference * 100).toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-500 mt-1">Disparity Gap</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-pink-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Equalized Odds</p>
                    <p className="text-3xl font-bold">{(results.fairness_metrics.equalized_odds_difference * 100).toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-500 mt-1">FPR/TPR Gap</p>
                  </div>
                </div>

                {/* Feature Importance (XAI) */}
                <div className="glass-card p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Activity className="text-violet-400" />
                      Explainable AI: Feature Weightage
                    </h3>
                    <Info size={16} className="text-slate-500 cursor-help" />
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={importanceData} layout="vertical" margin={{ left: 40 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {importanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === sensitiveCol ? '#f472b6' : '#06b6d4'} />
                          ))}
                        </Bar>
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-4 text-xs text-slate-500 italic">
                    * Features highlighted in <span className="text-pink-400">pink</span> represent sensitive attributes. High weightage here indicates potential proxies for bias.
                  </p>
                </div>

                {/* Gemini AI Report */}
                <div className="glass-card p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-indigo-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-300">
                      <Sparkles className="text-indigo-400" />
                      Gemini AI Fairness Analysis
                    </h3>
                    {!geminiReport && (
                      <button
                        onClick={handleGenerateReport}
                        disabled={geminiLoading}
                        className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-lg text-sm font-bold transition-all border border-indigo-500/30 flex items-center gap-2"
                      >
                        {geminiLoading ? 'Analyzing...' : 'Generate Report'}
                      </button>
                    )}
                  </div>
                  
                  {geminiReport && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none text-slate-300">
                      <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {geminiReport}
                      </div>
                    </motion.div>
                  )}
                  {!geminiReport && !geminiLoading && (
                    <p className="text-slate-500 text-sm">Click generate to get an expert, plain-language summary of these fairness metrics.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelPage;
