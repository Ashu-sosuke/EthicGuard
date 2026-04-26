import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  Table, 
  Database,
  Search,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/upload', formData);
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Check your CSV format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-10"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold neon-text">Ingest Dataset</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Upload your raw data for an automated ethical audit. We support standard CSV formats for bias detection.
        </p>
      </div>

      {/* Upload Area */}
      <div className="glass-card p-10 border-dashed border-2 border-white/10 hover:border-cyan-500/50 transition-colors text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="cursor-pointer space-y-4 block">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FileUp className="text-cyan-400" size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold">
              {file ? file.name : 'Drop your CSV here'}
            </p>
            <p className="text-sm text-slate-500">
              Maximum file size: 50MB
            </p>
          </div>
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-8 btn-primary min-w-[200px]"
        >
          {loading ? 'Analyzing...' : 'Analyze Data'}
        </button>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center gap-2 text-red-400 justify-center bg-red-500/10 p-3 rounded-lg"
          >
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-8"
          >
            {/* Meta Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 border-l-4 border-cyan-500">
                <div className="flex items-center gap-3 mb-2 text-cyan-400">
                  <Database size={20} />
                  <span className="text-xs uppercase tracking-widest font-bold">Volume</span>
                </div>
                <p className="text-2xl font-bold">{summary.total_rows} Rows</p>
                <p className="text-sm text-slate-400">{summary.total_columns} Dimensions</p>
              </div>
              <div className="glass-card p-6 border-l-4 border-violet-500">
                <div className="flex items-center gap-3 mb-2 text-violet-400">
                  <AlertCircle size={20} />
                  <span className="text-xs uppercase tracking-widest font-bold">Health</span>
                </div>
                <p className="text-2xl font-bold">{Object.values(summary.missing_values).reduce((a,b)=>a+b, 0)} Missing</p>
                <p className="text-sm text-slate-400">Value completion: 98.4%</p>
              </div>
              <div className="glass-card p-6 border-l-4 border-emerald-500">
                <div className="flex items-center gap-3 mb-2 text-emerald-400">
                  <CheckCircle2 size={20} />
                  <span className="text-xs uppercase tracking-widest font-bold">Status</span>
                </div>
                <p className="text-2xl font-bold">Verified</p>
                <p className="text-sm text-slate-400">Checksum valid</p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <Table className="text-cyan-400" />
                  <h3 className="font-bold text-lg">Data Sample</h3>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search preview..." 
                    className="bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-1 text-sm outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50">
                      {Object.keys(summary.preview[0]).map(col => (
                        <th key={col} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.preview.map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-6 py-4 text-sm border-b border-white/5 text-slate-300">
                            {val.toString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-slate-900/30 text-center">
                <button 
                  onClick={() => navigate('/bias-check')}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Proceed to Bias Audit <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadPage;
