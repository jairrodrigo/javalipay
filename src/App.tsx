import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Capture } from './pages/Capture';
import { Chat } from './pages/Chat';
import { Goals } from './pages/Goals';
import MemoryTest from './pages/MemoryTest';
import { useTheme } from './hooks/useTheme';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  // Aplica o tema ao documento
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <Router>
      <div className="flex h-screen bg-background transition-colors duration-300">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto bg-background transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/capture" element={<Capture />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/transactions" element={<div className="p-6 text-text-primary">Transações (Em desenvolvimento)</div>} />
              <Route path="/reports" element={<div className="p-6 text-text-primary">Relatórios (Em desenvolvimento)</div>} />
              <Route path="/insights" element={<div className="p-6 text-text-primary">Insights (Em desenvolvimento)</div>} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/memory-test" element={<MemoryTest />} />
              <Route path="/settings" element={<div className="p-6 text-text-primary">Configurações (Em desenvolvimento)</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
