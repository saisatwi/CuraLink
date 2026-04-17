import React, { useState } from 'react';
import axios from 'axios';
import { Search, Activity, ShieldCheck, Send, Bot, User, Loader2 } from 'lucide-react';

// EXACT Link to your Render Backend
const API_BASE_URL = "https://curalink-backend-73rv.onrender.com";

export default function App() {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query, id: Date.now() };
    setChat(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // We add a 10-second timeout to wait for the server to wake up
      const response = await axios.get(`${API_BASE_URL}/api/search?q=${query}`, { timeout: 15000 });
      
      const botMsg = { 
        role: 'bot', 
        content: response.data.length > 0 ? "Here are the matching records:" : "No direct matches found in database.",
        results: response.data,
        id: Date.now() + 1 
      };
      setChat(prev => [...prev, botMsg]);
    } catch (err) {
      setChat(prev => [...prev, { 
        role: 'bot', 
        content: "The server is currently waking up. Please wait 10 seconds and try your search again.", 
        id: Date.now() + 1 
      }]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      {/* Sidebar - Pro Design */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-12">
          <Activity className="text-blue-500" />
          <span className="font-bold text-xl tracking-tighter">CuraLink</span>
        </div>
        <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] text-blue-400 font-bold uppercase animate-pulse">
           Cloud Backend Active
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 flex items-center px-8 text-xs text-slate-500 font-mono">
          ENDPOINT: {API_BASE_URL}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chat.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-[#1e293b] border border-slate-700'}`}>
                <p className="text-sm">{msg.content}</p>
                {msg.results && msg.results.map((r, i) => (
                  <div key={i} className="mt-3 p-2 bg-black/20 rounded text-xs border border-white/5">
                    <strong className="text-blue-400">{r.title}</strong>: {r.snippet}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-slate-500 animate-pulse flex items-center gap-2"><Loader2 size={12} className="animate-spin"/> Searching...</div>}
        </div>

        <form onSubmit={handleSearch} className="p-6">
          <div className="max-w-4xl mx-auto flex gap-2 bg-[#0f172a] p-2 rounded-xl border border-slate-700">
            <input 
              className="flex-1 bg-transparent px-4 outline-none text-sm" 
              placeholder="Search symptoms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="bg-blue-600 p-2 rounded-lg"><Send size={18}/></button>
          </div>
        </form>
      </main>
    </div>
  );
}