import React, { useState, useEffect } from 'react';
import { Settings as SettingsType, ModelOption } from '../types';
import { fetchAvailableModels } from '../services/geminiService';
import { Save, RefreshCw, Key, Server } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [selectedModel, setSelectedModel] = useState(settings.model);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initial load if key exists
  useEffect(() => {
    if (apiKey && models.length === 0) {
      handleFetchModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchModels = async () => {
    if (!apiKey) {
      setError("Please enter an API Key first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fetchedModels = await fetchAvailableModels(apiKey);
      setModels(fetchedModels);
      if (fetchedModels.length > 0 && !selectedModel) {
        // Default to a flash model if available, else first one
        const flash = fetchedModels.find(m => m.name.includes('flash'));
        setSelectedModel(flash ? flash.name : fetchedModels[0].name);
      }
    } catch (err) {
      setError("Failed to fetch models. Verify your API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave({ apiKey, model: selectedModel });
    alert("Settings saved!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <Server className="w-6 h-6 text-indigo-600" />
        System Configuration
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Google Gemini API Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Key className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Paste your API key here..."
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            The key is stored locally in your browser state.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">AI Model</label>
            <button
              onClick={handleFetchModels}
              disabled={loading || !apiKey}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Models
            </button>
          </div>
          
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={models.length === 0}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100"
          >
            {models.length === 0 ? (
              <option value="">{loading ? "Loading..." : "Enter Key and Refresh to list models"}</option>
            ) : (
              models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.displayName} ({m.name})
                </option>
              ))
            )}
          </select>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium flex justify-center items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
