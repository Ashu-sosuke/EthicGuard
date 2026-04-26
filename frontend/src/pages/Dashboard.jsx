import React, { useState, useEffect } from 'react';
import { getColumns, detectBias } from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [biasResult, setBiasResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await getColumns();
        setColumns(response.data.columns);
      } catch (err) {
        console.error(err);
      }
    };
    fetchColumns();
  }, []);

  const handleDetect = async () => {
    if (!selectedColumn) return;
    setLoading(true);
    try {
      const response = await detectBias(selectedColumn);
      setBiasResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#38bdf8', '#818cf8', '#fbbf24', '#f87171', '#c084fc'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Bias <span className="gradient-text">Detection</span></h1>
          <p className="text-slate-400">Select a sensitive column to analyze its distribution.</p>
        </div>
        <div className="flex space-x-4">
          <select 
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Select Column</option>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
          <button 
            onClick={handleDetect}
            disabled={loading || !selectedColumn}
            className="bg-primary-500 hover:bg-primary-600 px-6 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {biasResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 glass p-8 rounded-3xl h-[400px]"
          >
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Info size={18} className="text-primary-400" />
              Distribution: {biasResult.column}
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(biasResult.distribution).map(([name, value]) => ({ name, value }))}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(biasResult.distribution).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className={`p-8 rounded-3xl ${biasResult.bias_flag ? 'bg-red-500/10 border border-red-500/50' : 'bg-green-500/10 border border-green-500/50'}`}>
              <div className="flex items-center space-x-3 mb-4">
                {biasResult.bias_flag ? <AlertTriangle className="text-red-400" /> : <CheckCircle className="text-green-400" />}
                <h3 className="text-lg font-bold">{biasResult.bias_flag ? 'Bias Detected' : 'Fair Distribution'}</h3>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Disparity level: <span className="font-bold text-white">{(biasResult.disparity * 100).toFixed(2)}%</span>
              </p>
              <div className={`text-xs px-3 py-1 rounded-full inline-block font-bold ${
                biasResult.severity === 'High' ? 'bg-red-500 text-white' : 
                biasResult.severity === 'Medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
              }`}>
                Severity: {biasResult.severity}
              </div>
            </div>

            <div className="glass p-8 rounded-3xl">
              <h3 className="font-bold mb-4">Analysis Insights</h3>
              <ul className="text-sm text-slate-400 space-y-3">
                <li>• Max imbalance observed across {Object.keys(biasResult.distribution).length} categories.</li>
                <li>• Recommendation: Consider {biasResult.bias_flag ? 'mitigation techniques' : 'proceeding to model training'}.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
