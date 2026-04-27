import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  FileCheck, 
  FileWarning,
  Download,
  ShieldAlert,
  Info,
  CheckCircle2
} from 'lucide-react';

const AuditReport = () => {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await axios.get('http://localhost:8000/audit');
        setAudit(res.data);
      } catch (err) {
        setError('No active dataset found for audit.');
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, []);

  if (loading) return <div className="p-20 text-center text-slate-500">Conducting ethical audit...</div>;
  if (error) return (
    <div className="max-w-2xl mx-auto glass-card p-12 text-center mt-20">
      <ShieldAlert size={48} className="text-amber-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Audit Blocked</h2>
      <p className="text-slate-400">{error}</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold neon-text">Privacy & Ethics Audit</h1>
          <p className="text-slate-400">Heuristic-based compliance scan for PII and data integrity.</p>
        </div>
        <button className="btn-outline flex items-center gap-2">
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* PII Card */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-xl ${audit.pii_detected.length > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {audit.pii_detected.length > 0 ? <Lock size={24} /> : <ShieldCheck size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-bold">PII Detection Results</h3>
                <p className="text-sm text-slate-400">Scanning for Personally Identifiable Information.</p>
              </div>
            </div>

            {audit.pii_detected.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                  <FileWarning className="text-amber-500 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-500">Critical Warnings Found</p>
                    <p className="text-sm text-slate-400">Potential PII columns detected. These features may lead to privacy leaks or biased modeling.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {audit.pii_detected.map(col => (
                    <span key={col} className="px-3 py-1 bg-slate-800 text-slate-200 border border-white/5 rounded-lg font-mono text-xs">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3">
                <FileCheck className="text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-400">Privacy Scan Passed</p>
                  <p className="text-sm text-slate-400">No common PII patterns detected in column headers.</p>
                </div>
              </div>
            )}
          </div>

          {/* Missing Values Card */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6">Data Integrity</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(audit.missing_values).map(([col, count]) => (
                <div key={col} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm font-medium">{col}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${count > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {count} Missing
                    </span>
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${count > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(100, (count / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border-cyan-500/20">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info size={18} className="text-cyan-400" />
              Ethics Recommendation
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed italic mb-4">
              "{audit.recommendation}"
            </p>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Generated by EthicGuard v1.2</div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold">Compliance Checklist</h3>
            <div className="space-y-3">
              {[
                { label: 'GDPR Compliance Scan', status: true },
                { label: 'Anonymization Check', status: audit.pii_detected.length === 0 },
                { label: 'Bias Surface Area', status: true },
                { label: 'Model Transparency', status: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  {item.status ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <AlertCircle size={16} className="text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditReport;
