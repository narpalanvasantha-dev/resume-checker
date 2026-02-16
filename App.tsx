import React, { useState } from 'react';
import { LayoutDashboard, UserPlus, Settings as SettingsIcon, Database, BrainCircuit } from 'lucide-react';
import { Candidate, Settings as SettingsType } from './types';
import { INITIAL_CANDIDATES } from './constants';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import CandidateList from './components/CandidateList';
import Settings from './components/Settings';

// Navigation Constants
type View = 'dashboard' | 'scanner' | 'database' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // App State
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [settings, setSettings] = useState<SettingsType>({
    apiKey: '',
    model: 'gemini-2.5-flash', // Default model
  });

  // Handlers
  const handleAddCandidate = (candidate: Candidate) => {
    setCandidates((prev) => [candidate, ...prev]);
    setCurrentView('database'); // Switch to list view after adding
  };

  const handleUpdateSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard candidates={candidates} />;
      case 'scanner':
        return <Scanner settings={settings} onAnalysisComplete={handleAddCandidate} />;
      case 'database':
        return <CandidateList candidates={candidates} />;
      case 'settings':
        return <Settings settings={settings} onSave={handleUpdateSettings} />;
      default:
        return <Dashboard candidates={candidates} />;
    }
  };

  const NavItem = ({ view, label, icon: Icon }: { view: View; label: string; icon: React.ElementType }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <BrainCircuit className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-white">ResumeRank</h1>
          </div>
          <p className="text-xs text-slate-500">AI-Powered HR Screening</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="dashboard" label="Overview" icon={LayoutDashboard} />
          <NavItem view="scanner" label="New Assessment" icon={UserPlus} />
          <NavItem view="database" label="Candidates" icon={Database} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <NavItem view="settings" label="System Settings" icon={SettingsIcon} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {currentView === 'database' ? 'Candidate Database' : 
             currentView === 'scanner' ? 'Resume Scanner' : 
             currentView}
          </h2>
          
          <div className="flex items-center gap-4">
             <div className="text-sm text-right hidden md:block">
               <p className="font-medium text-slate-700">HR Admin</p>
               <p className="text-xs text-slate-400">{settings.apiKey ? 'System Online' : 'API Key Required'}</p>
             </div>
             <div className={`w-3 h-3 rounded-full ${settings.apiKey ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
