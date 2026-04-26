import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Users,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/stats');
        setStatsData(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Fairness Score', value: statsData?.fairness_score || 'N/A', icon: ShieldAlert, color: 'text-cyan-400' },
    { label: 'Total Audits', value: statsData?.total_audits || '0', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Active Alerts', value: statsData?.active_alerts || '0', icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Dataset Size', value: statsData?.dataset_size || '0', icon: Zap, color: 'text-violet-400' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="text-primary animate-spin" size={48} />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-surface border border-white/5 p-16">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 via-secondary/10 to-transparent blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 max-w-2xl">
          <motion.h1 variants={itemVariants} className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
            Engineering <span className="neon-text">Algorithmic</span> Justice
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
            Deploy state-of-the-art bias detection and mitigation pipelines. 
            Ensure your machine learning models operate with mathematical fairness and human integrity.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-6">
            <button onClick={() => navigate('/upload')} className="btn-primary flex items-center gap-3 group">
              Start New Audit <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/docs')} className="btn-outline border-white/5 bg-white/5">System Documentation</button>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="glass-card p-6 flex items-center gap-4 group cursor-pointer hover:bg-slate-800/40 transition-colors"
          >
            <div className={`p-3 rounded-xl bg-slate-800 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actionable Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">System Insights</h2>
            <TrendingUp className="text-cyan-400" />
          </div>
          <div className="space-y-6">
            {!statsData?.dataset_size || statsData.dataset_size === '0' ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-500 font-medium italic">No active audit data. Upload a dataset to begin.</p>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 rounded-full bg-cyan-400" />
                    <div>
                      <p className="font-bold">Dataset Loaded</p>
                      <p className="text-sm text-slate-400">Current dataset ready for bias analysis.</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/bias-check')} className="text-cyan-400 font-bold hover:underline">Start Audit</button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-8 bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {!statsData?.recent_activities || statsData.recent_activities.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No recent activity found.</p>
            ) : (
              statsData.recent_activities.map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{activity}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Recent action</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => navigate('/memory')} className="w-full mt-8 btn-outline text-sm py-2">Full History</button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
