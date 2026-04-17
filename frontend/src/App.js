import React, { useState } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, MessageSquare, Database, RefreshCcw } from 'lucide-react';

const API_BASE_URL = "https://curalink-backend-73rv.onrender.com";

export default function App() {
  const [form, setForm] = useState({ disease: "", intent: "", location: "" });
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("all");

  const resultsPerPage = 3;

  const handleResearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/research`, form);
      setResults(res.data.publications.concat(res.data.trials));
      setSummary(res.data.summary);
      setPage(1);
    } catch (err) { alert("Server error"); }
    finally { setLoading(false); }
  };

  // Filter and Paginate
  const filteredData = results.filter(r => sourceFilter === "all" || r.source.toLowerCase().includes(sourceFilter));
  const paginatedData = filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage);

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100">
      {/* 1. HEADER (Navigation) */}
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]">
        <h1 className="font-bold flex items-center gap-2"><Database className="text-blue-500"/> CURALINK AI</h1>
        <button onClick={() => {setResults([]); setSummary("");}} className="text-xs flex items-center gap-1 text-slate-400 hover:text-white">
          <RefreshCcw size={12}/> New Research
        </button>
      </header>

      {/* 2. CHAT & RESULTS AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:px-20 space-y-6">
        {summary && (
          <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/20 max-w-3xl">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Ollama Reasoning</span>
            <p className="text-sm mt-2 italic">"{summary}"</p>
          </div>
        )}

        {/* Selected Toggle Searches (Filter) */}
        {results.length > 0 && (
          <div className="flex gap-2">
            {['all', 'pubmed', 'clinical', 'openalex'].map(src => (
              <button 
                key={src}
                onClick={() => {setSourceFilter(src); setPage(1);}}
                className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold transition ${sourceFilter === src ? 'bg-blue-600' : 'bg-slate-800 text-slate-500'}`}
              >
                {src}
              </button>
            ))}
          </div>
        )}

        {/* Paginated Results */}
        <div className="grid gap-4">
          {paginatedData.map((res, i) => (
            <div key={i} className="p-4 bg-slate-900 rounded-xl border border-slate-800 animate-in fade-in duration-500">
              <h4 className="text-sm font-bold text-blue-300">{res.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{res.source} • {res.status || 'Verified'}</p>
              <a href={res.url} target="_blank" className="text-[10px] text-blue-500 underline mt-2 inline-block">View Source</a>
            </div>
          ))}
        </div>

        {/* Page Moves (Front/Back) */}
        {filteredData.length > resultsPerPage && (
          <div className="flex items-center gap-4 justify-center py-4">
            <button onClick={() => setPage(p => Math.max(1, p-1))} className="p-2 bg-slate-800 rounded-lg disabled:opacity-30"><ChevronLeft/></button>
            <span className="text-xs font-mono">PAGE {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page * resultsPerPage >= filteredData.length} className="p-2 bg-slate-800 rounded-lg disabled:opacity-30"><ChevronRight/></button>
          </div>
        )}
      </div>

      {/* 3. INPUT BAR (Chat Style) */}
      <footer className="p-6 bg-[#020617]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <input className="bg-transparent px-4 text-sm flex-1 outline-none" placeholder="Disease..." onChange={e => setForm({...form, disease: e.target.value})}/>
          <input className="bg-transparent px-4 text-sm flex-1 outline-none border-l border-slate-800" placeholder="Intent..." onChange={e => setForm({...form, intent: e.target.value})}/>
          <button onClick={handleResearch} className="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition disabled:opacity-50">
            {loading ? <RefreshCcw className="animate-spin"/> : <Send size={18}/>}
          </button>
        </div>
      </footer>
    </div>
  );
}