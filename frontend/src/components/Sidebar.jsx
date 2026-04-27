import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  ShieldCheck, 
  BrainCircuit, 
  Wand2, 
  History,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload Data' },
    { path: '/bias-check', icon: ShieldCheck, label: 'Bias Audit' },
    { path: '/docs', icon: FileText, label: 'Documentation' },
    { path: '/privacy-audit', icon: FileText, label: 'Ethics Audit' },
    { path: '/model', icon: BrainCircuit, label: 'Model Lab' },
    { path: '/mitigation', icon: Wand2, label: 'Mitigation' },
    { path: '/memory', icon: History, label: 'Memory Log' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background/50 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-main flex items-center justify-center shadow-glow-primary">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-black neon-text uppercase tracking-tighter">EthicGuard</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
