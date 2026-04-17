import React, { useState } from 'react';
import axios from 'axios';
import { Search, Activity, ShieldCheck, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

// Auto-configures based on where the app is running
const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:10000" 
  : "https://curalink-backend-73rv.onrender.com";

export default function App() {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query, id: Date.now() };
    setChat(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/search?q=${query}`);
      const botMessage = { 
        role: 'bot', 
        content: response.data[0]?.snippet || "Results loaded.",
        results: response.data,
        id: Date.now() + 1 
      };
      setChat(prev => [...prev, botMessage]);
    } catch (error) {
      setChat(prev => [...prev, { 
        role: 'bot', 
        content: "Server is waking up. Please try your search again in 15 seconds.", 
        id: Date.now() + 1 
      }]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Activity className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter">CURALINK</span>
        </div>
        <div className="flex-1 space-y-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Network Status</div>
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-500/10 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Cloud Sync
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 flex items-center px-8 bg-[#020617]/50 backdrop-blur-xl">
          <ShieldCheck size={16} className="text-blue-500 mr-2"/>
          <span className="text-xs font-semibold text-slate-400">HIPAA Compliant Environment</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-8">
          {chat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-50">
              <Sparkles size={48} className="text-blue-600 mb-4" />
              <h2 className="text-2xl font-light italic">Search Medical Data...</h2>
            </div>
          )}
          {chat.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-2xl shadow-2xl ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#1e293b] border border-slate-700 rounded-tl-none'
              }`}>
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
                {msg.results && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                    {msg.results.map((r, i) => (
                      <div key={i} className="p-3 bg-black/30 rounded-lg border border-white/5">
                        <div className="text-blue-400 font-bold text-xs mb-1 uppercase tracking-wider">{r.title}</div>
                        <div className="text-slate-400 text-xs leading-snug">{r.snippet}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Querying Cloud Database...</div>}
        </div>

        {/* Search Bar */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex gap-3 bg-[#0f172a] p-2 rounded-2xl border border-slate-800 shadow-2xl focus-within:border-blue-500 transition-all">
            <input 
              className="flex-1 bg-transparent px-4 outline-none text-sm placeholder-slate-600" 
              placeholder="Enter symptoms or medication name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">
              <Send size={20} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}