import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Cpu, Zap, Info } from 'lucide-react';

const DocsPage = () => {
  const sections = [
    {
      title: 'Project Overview',
      icon: <Shield className="text-cyan-400" />,
      content: 'EthicGuard is a comprehensive suite designed to identify and eliminate systematic bias in machine learning datasets. Our system uses mathematical fairness metrics to ensure that AI decisions are equitable across all demographic groups.'
    },
    {
      title: 'Bias Detection',
      icon: <Cpu className="text-violet-400" />,
      content: 'We employ Demographic Parity and Equalized Odds metrics to quantify bias. The system analyzes the distribution of sensitive features (like gender, race, or age) relative to the target outcomes.'
    },
    {
      title: 'Mitigation Strategies',
      icon: <Zap className="text-pink-400" />,
      content: 'When bias is detected, you can deploy mitigation strategies: Oversampling (balancing the data), Reweighting (adjusting sample importance), or Feature Removal (eliminating sensitive attributes).'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <div className="bg-white/5 p-4 rounded-full inline-block">
          <BookOpen className="text-primary" size={40} />
        </div>
        <h1 className="text-4xl font-black neon-text">System Documentation</h1>
        <p className="text-slate-400">Technical guide and operational overview of EthicGuard.</p>
      </div>

      <div className="grid gap-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 flex gap-6 items-start"
          >
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
              {section.icon}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="text-slate-400 leading-relaxed">{section.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/20 p-8 rounded-[2rem] flex items-start gap-4">
        <Info className="text-primary mt-1" />
        <div className="space-y-2">
          <h3 className="font-bold text-primary">Need Help?</h3>
          <p className="text-sm text-slate-400">
            For advanced integration or custom fairness constraints, please refer to the internal API documentation or contact the ethics board.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
