import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, BarChart3, BrainCircuit, Scale, Zap, History } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { to: '/', icon: <ShieldAlert size={20} />, label: 'Upload' },
    { to: '/dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { to: '/training', icon: <BrainCircuit size={20} />, label: 'Training' },
    { to: '/fairness', icon: <Scale size={20} />, label: 'Fairness' },
    { to: '/mitigation', icon: <Zap size={20} />, label: 'Mitigation' },
    { to: '/memory', icon: <History size={20} />, label: 'Logs' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="text-primary-400" size={28} />
          <span className="text-xl font-bold gradient-text">Unbiased AI</span>
        </div>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-1.5 transition-colors duration-200 ${
                  isActive ? 'text-primary-400 font-medium' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
