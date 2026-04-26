import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Info } from 'lucide-react';

const FairnessPage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-primary-500/10 p-6 rounded-full inline-block"
      >
        <Scale className="text-primary-400" size={48} />
      </motion.div>
      <h1 className="text-4xl font-bold">Fairness <span className="gradient-text">Evaluation</span></h1>
      <p className="text-slate-400 max-w-lg mx-auto">
        Detailed fairness breakdown metrics are integrated into the **Training** flow. 
        Train a model to see group-level disparities and demographic parity metrics.
      </p>
      
      <div className="glass p-8 rounded-3xl text-left max-w-2xl mx-auto flex items-start gap-4">
        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 mt-1">
          <Info size={20} />
        </div>
        <div>
          <h3 className="font-bold mb-2">Why Fairness Matters?</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Machine learning models can inadvertently learn and amplify biases present in historical data. 
            Fairness metrics like Demographic Parity help ensure that outcomes are not dependent on protected attributes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FairnessPage;
