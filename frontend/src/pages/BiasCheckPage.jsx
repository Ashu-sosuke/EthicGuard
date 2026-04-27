import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Plus, 
  X,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

const BiasCheckPage = () => {
  const [columns, setColumns] = useState([]);
  const [selectedCols, setSelectedCols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const res = await axios.get('http://localhost:8000/columns');
        setColumns(res.data.columns);
      } catch (err) {
        setError('Failed to fetch columns. Ensure data is uploaded.');
      }
    };
    fetchColumns();
  }, []);

  const handleAnalyze = async () => {
    if (selectedCols.length === 0) return;
    setLoading(true);
    setResults(null);
    try {
      let res;
      if (selectedCols.length === 1) {
        res = await axios.post(`http://localhost:8000/detect-bias?sensitive_column=${selectedCols[0]}`);
      } else {
        res = await axios.post('http://localhost:8000/detect-bias-intersectional', selectedCols);
      }
      setResults(res.data);
    } catch (err) {
      setError('Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (col) => {
    setSelectedCols(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const COLORS = ['#06b6d4', '#8b5cf6', '#f472b6', '#f59e0b', '#10b981'];

  const getChartData = () => {
    if (!results || !results.distribution) return [];
    const entries = Object.entries(results.distribution).sort((a, b) => b[1] - a[1]);
    const topN = 8;
    
    if (entries.length <= topN + 1) {
      return entries.map(([name, value]) => ({
        name: name.replace(/[()']/g, '').replace(/, /g, ' | '),
        value
      }));
    }

    const topEntries = entries.slice(0, topN).map(([name, value]) => ({
      name: name.replace(/[()']/g, '').replace(/, /g, ' | '),
      value
    }));

    const otherValue = entries.slice(topN).reduce((sum, [_, v]) => sum + v, 0);
    topEntries.push({ name: 'Other (Rest)', value: otherValue });
    return topEntries;
  };

  const chartData = getChartData();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto space-y-10"
    >
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold neon-text">Bias Audit</h1>
          <p className="text-slate-400">Select dimensions to audit for distribution disparity.</p>
        </div>
        <div className="flex gap-2">
          {selectedCols.length > 1 && (
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold border border-violet-500/20 flex items-center gap-1">
              <Zap size={12} /> Intersectional Mode
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Selection Sidebar */}
        <div className="glass-card p-6 h-fit space-y-6">
          <h3 className="font-bold flex items-center gap-2">
            <ShieldCheck className="text-cyan-400" size={18} />
            Features
          </h3>
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[400px]">
            {columns.map(col => (
              <button
                key={col}
                onClick={() => toggleColumn(col)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  selectedCols.includes(col)
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={selectedCols.length === 0 || loading}
            className="w-full btn-primary text-sm py-2"
          >
            {loading ? 'Processing...' : 'Run Audit'}
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
            >
              <AlertTriangle size={18} />
              {error}
              <button onClick={() => setError(null)} className="ml-auto hover:text-white">
                <X size={16} />
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!results && !loading && !error && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-12 text-center border-dashed border-2"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium">Select features and run audit to see insights</p>
              </motion.div>
            )}

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`glass-card p-6 border-l-4 ${results.bias_flag ? 'border-amber-500' : 'border-emerald-500'}`}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bias Flag</p>
                    <div className="flex items-center gap-3">
                      {results.bias_flag ? <AlertTriangle className="text-amber-500" /> : <CheckCircle2 className="text-emerald-500" />}
                      <span className="text-2xl font-bold">{results.bias_flag ? 'Detected' : 'Clear'}</span>
                    </div>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-violet-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Max Disparity</p>
                    <p className="text-3xl font-black text-violet-400">{(results.disparity * 100).toFixed(1)}%</p>
                  </div>
                </div>

                {/* Visualization */}
                <div className="glass-card p-8">
                  <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                    <PieChartIcon className="text-cyan-400" />
                    Distribution Analysis
                  </h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={90}
                          outerRadius={120}
                          paddingAngle={8}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{ paddingTop: '20px', fontSize: '11px', opacity: 0.8 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Verdict Card */}
                <div className="glass-card p-6 bg-gradient-to-r from-slate-900 to-slate-800">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${results.bias_flag ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-lg">Ethics Verdict: {results.severity} Severity</p>
                      <p className="text-slate-400 text-sm">
                        {results.bias_flag 
                          ? `The audit detected significant distribution disparity in ${selectedCols.join(' x ')}. Mitigation is recommended before training to prevent systematic discrimination.`
                          : `The feature distribution appears balanced. No immediate action required, but intersectional analysis is always recommended.`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default BiasCheckPage;
