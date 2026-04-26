import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  History, 
  Terminal, 
  Clock, 
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

const MemoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/memory');
        // Parse markdown logs from the backend
        const lines = res.data.content.split('\n');
        const parsedLogs = lines
          .filter(line => line.startsWith('* ') && line.includes(' : '))
          .map(line => {
            const cleanLine = line.substring(2); // Remove '* '
            const parts = cleanLine.split(' : ');
            return {
              timestamp: parts[0] || 'Unknown Time',
              action: parts[1] || 'Unknown Action',
              id: Math.random().toString(36).substr(2, 9)
            };
          }).reverse();
        setLogs(parsedLogs);
      } catch (err) {
        console.error('Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold neon-text">Activity Trace</h1>
          <p className="text-slate-400">System-wide audit trail and operation logs.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-cyan-500 w-64"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-slate-900/50 border-b border-white/5 flex items-center gap-3 text-slate-400">
          <Terminal size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Audit Trail v1.0</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-20 text-center text-slate-500">Retrieving system memory...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-20 text-center text-slate-500">No activity recorded yet.</div>
          ) : (
            filteredLogs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 flex items-start gap-6 hover:bg-white/5 transition-colors group"
              >
                <div className="shrink-0 mt-1">
                  {log.action.toLowerCase().includes('error') ? (
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                      <AlertTriangle size={20} />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {log.action}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {log.timestamp}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={12} />
                      System Log
                    </div>
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs font-bold text-cyan-400 hover:underline">View Trace</button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryPage;
