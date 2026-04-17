import React, { useState } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Database, RefreshCcw, Send, Loader2 } from 'lucide-react';

const API_BASE_URL = "https://curalink-backend-73rv.onrender.com";

export default function App() {
  const [form, setForm] = useState({ disease: "", intent: "", location: "" });
  const [results, setResults] = useState([]); // Must be an array
  const [summary, setSummary] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("all");

  const resultsPerPage = 3;

  const handleResearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/research`, form);
      // Combine all data into one list
      const combined = [...(res.data.publications || []), ...(res.data.trials || [])];
      setResults(combined);
      setSummary(res.data.summary || "");
      setPage(1);
    } catch (err) {
      console.error("API Error", err);
    } finally {
      setLoading(false);
    }
  };

  // Safe Filtering Logic
  const filteredData = Array.isArray(results) ? results.filter(r => 
    sourceFilter === "all" || r.source?.toLowerCase().includes(sourceFilter)
  ) : [];

  const paginatedData = filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100 font-sans">
      {/* 1. Header with Toggles */}
      <header className="p-4 border-b border-slate-800 bg-[#0f172a] flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="font-bold flex items-center gap-2"><Database className="text-blue-500" size={20}/> CURALINK PRO</h1>
        
        {results.length > 0 && (
          <div className="flex gap-2 bg-black/20 p-1 rounded-lg border border-slate-800">
            {['all', 'pubmed', 'clinical', 'openalex'].map(src => (
              <button 
                key={src}
                onClick={() => {setSourceFilter(src); setPage(1);}}
                className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold transition ${sourceFilter === src ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {src}
              </button>
            ))}
          </div>
        )}

        <button onClick={() => window.location.reload()} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 uppercase tracking-widest">
          <RefreshCcw size={12}/> Reset Session
        </button>
      </header>

      {/* 2. Results & Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:px-20 space-y-6">
        {summary && (
          <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/20 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Ollama Reasoning Engine</span>
            <p className="text-sm mt-2 leading-relaxed italic text-slate-300">"{summary}"</p>
          </div>
        )}

        <div className="grid gap-4 max-w-4xl">
          {paginatedData.map((res, i) => (
            <div key={i} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">{res.source}</span>
                <span className="text-[10px] text-slate-500">{res.status || 'Research'}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-2">{res.title}</h4>
              <a href={res.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">View Official Records →</a>
            </div>
          ))}
        </div>

        {/* 3. Pagination Controls */}
        {filteredData.length > resultsPerPage && (
          <div className="flex items-center gap-6 justify-center py-8">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 disabled:opacity-20">
              <ChevronLeft size={20}/>
            </button>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Results {page} / {Math.ceil(filteredData.length / resultsPerPage)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page * resultsPerPage >= filteredData.length} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 disabled:opacity-20">
              <ChevronRight size={20}/>
            </button>
          </div>
        )}
      </div>

      {/* 4. Chat Style Input (Requirement: Structured Context) */}
      <footer className="p-6 bg-gradient-to-t from-[#020617] to-transparent">
        <form onSubmit={handleResearch} className="max-w-5xl mx-auto flex flex-col md:flex-row gap-3 bg-[#0f172a] p-3 rounded-2xl border border-slate-800 shadow-2xl">
          <input className="bg-transparent px-4 text-sm flex-1 outline-none border-b md:border-b-0 md:border-r border-slate-800 py-2" placeholder="Disease (e.g. Parkinson's)" value={form.disease} onChange={e => setForm({...form, disease: e.target.value})} required/>
          <input className="bg-transparent px-4 text-sm flex-1 outline-none border-b md:border-b-0 md:border-r border-slate-800 py-2" placeholder="Intent (e.g. Treatment)" value={form.intent} onChange={e => setForm({...form, intent: e.target.value})}/>
          <button type="submit" className="bg-blue-600 p-4 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center min-w-[60px]" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
          </button>
        </form>
      </footer>
    </div>
  );
}