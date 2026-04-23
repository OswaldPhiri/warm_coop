import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bird, 
  Sprout, 
  Stethoscope, 
  CircleDollarSign,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import BirdManager from './components/BirdManager';
import FeedLog from './components/FeedLog';
import VaccineTracker from './components/VaccineTracker';
import FinanceLog from './components/FinanceLog';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'birds', label: 'Population', icon: Bird },
    { id: 'feed', label: 'Feed Usage', icon: Sprout },
    { id: 'vaccines', label: 'Health', icon: Stethoscope },
    { id: 'finance', label: 'Finance', icon: CircleDollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'birds': return <BirdManager />;
      case 'feed': return <FeedLog />;
      case 'vaccines': return <VaccineTracker />;
      case 'finance': return <FinanceLog />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-warm-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold tracking-tight">WarmCoop</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar/Navigation */}
      <nav className={`
        ${isMenuOpen ? 'block' : 'hidden'} 
        md:flex md:flex-col
        fixed md:sticky top-0 z-40 
        w-full md:w-64 h-[calc(100vh-60px)] md:h-screen
        bg-white border-r border-slate-200 p-4
        transition-all duration-300
      `}>
        <div className="hidden md:block mb-8 px-2">
          <h1 className="text-2xl font-black text-warm-600">WarmCoop</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Farmer's Assistant</p>
        </div>

        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'bg-warm-50 text-warm-600 shadow-sm ring-1 ring-warm-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                `}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'text-warm-600' : 'text-slate-400'} />
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-auto p-4 bg-warm-50 rounded-2xl md:block hidden">
          <p className="text-xs font-bold text-warm-700 uppercase">Pro Tip</p>
          <p className="text-xs text-warm-600 mt-1">Log mortality daily for accurate profit calculation.</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
