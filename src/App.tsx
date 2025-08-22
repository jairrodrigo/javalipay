import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Capture } from './pages/Capture';
import { Chat } from './pages/Chat';
import { Goals } from './pages/Goals';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-neutral-black">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto bg-neutral-black">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/capture" element={<Capture />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/transactions" element={<div className="p-6 text-neutral-light">Transações (Em desenvolvimento)</div>} />
              <Route path="/reports" element={<div className="p-6 text-neutral-light">Relatórios (Em desenvolvimento)</div>} />
              <Route path="/insights" element={<div className="p-6 text-neutral-light">Insights (Em desenvolvimento)</div>} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<div className="p-6 text-neutral-light">Configurações (Em desenvolvimento)</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
