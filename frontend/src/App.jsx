import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ModelPage from './pages/ModelPage';
import MemoryPage from './pages/MemoryPage';
import BiasCheckPage from './pages/BiasCheckPage';
import AuditReport from './pages/AuditReport';
import MitigationPage from './pages/MitigationPage';
import DocsPage from './pages/DocsPage';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-slate-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/bias-check" element={<BiasCheckPage />} />
              <Route path="/privacy-audit" element={<AuditReport />} />
              <Route path="/model" element={<ModelPage />} />
              <Route path="/mitigation" element={<MitigationPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/memory" element={<MemoryPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
