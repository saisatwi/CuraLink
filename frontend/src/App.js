import React, { useState } from 'react';
import axios from 'axios';
import { Search, Activity, ShieldCheck, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

// PERFECTION: Auto-detects environment
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
        content: response.data[0]?.snippet || "I've analyzed the medical database for your query.",
        results: response.data,
        id: Date.now() + 1 
      };
      setChat(prev => [...prev, botMessage]);
    } catch (error) {
      setChat(prev => [...prev, { 
        role: 'bot', 
        content: "System is currently waking up. Please try again in 30 seconds.", 
        id: Date.now() + 1 
      }]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b]/50 border-r border-slate-800 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Activity className="text-blue-500" size={24} />
          <h1 className="text-xl font-bold text-white tracking-tight">CuraLink</h1>
        </div>
        <div className="flex-1 space-y-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Live Status</div>
          <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Cloud Sync Active
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ShieldCheck size={14} className="text-blue-400"/>
            Verified Medical Database
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Sparkles className="text-blue-500 mb-4" size={40} />
              <h2 className="text-2xl font-bold text-white">How can I assist your health today?</h2>
            </div>
          )}
          {chat.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'}`}>
                <p className="text-sm">{msg.content}</p>
                {msg.results && (
                  <div className="mt-4 space-y-2">
                    {msg.results.map((r, i) => (
                      <div key={i} className="text-xs bg-black/20 p-2 rounded border border-white/5">
                        <span className="font-bold text-blue-300">{r.title}:</span> {r.snippet}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Processing...</div>}
        </div>

        <div className="p-6 bg-gradient-to-t from-[#0f172a] to-transparent">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex gap-2 bg-[#1e293b] p-2 rounded-xl border border-slate-700">
            <input 
              className="flex-1 bg-transparent px-4 outline-none text-sm" 
              placeholder="Ask about symptoms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}