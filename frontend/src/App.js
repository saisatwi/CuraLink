import React, { useState } from 'react';
import axios from 'axios';
import { Search, BookOpen, Activity, MapPin, Send, Loader2, Award } from 'lucide-react';

const API_BASE_URL = "https://curalink-backend-73rv.onrender.com";

export default function App() {
  const [form, setForm] = useState({ disease: "", intent: "", location: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/research`, form);
      setResult(res.data);
    } catch (err) {
      alert("Error fetching research data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold tracking-tighter uppercase">CuraLink Pro</h1>
        </div>
        <div className="text-[10px] border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 font-mono">
          V1.0 LIVE RESEARCH ENGINE
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Left: Structured Input */}
        <section className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 h-fit">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Search size={18} className="text-blue-400"/> Research Parameters
          </h2>
          <form onSubmit={handleResearch} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold px-1">Disease</label>
              <input 
                className="w-full bg-[#1e293b] border border-slate-700 p-3 rounded-xl mt-1 outline-none focus:border-blue-500"
                placeholder="e.g. Parkinson's"
                onChange={(e) => setForm({...form, disease: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold px-1">Specific Intent</label>
              <input 
                className="w-full bg-[#1e293b] border border-slate-700 p-3 rounded-xl mt-1 outline-none focus:border-blue-500"
                placeholder="e.g. Deep Brain Stimulation"
                onChange={(e) => setForm({...form, intent: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold px-1">Location (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 text-slate-500" size={16}/>
                <input 
                  className="w-full bg-[#1e293b] border border-slate-700 p-3 pl-10 rounded-xl mt-1 outline-none focus:border-blue-500"
                  placeholder="Toronto, Canada"
                  onChange={(e) => setForm({...form, location: e.target.value})}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Send size={18}/> Execute Research</>}
            </button>
          </form>
        </section>

        {/* Right: Results Display */}
        <section className="md:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="h-64 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p>Enter medical context to begin reasoning pipeline</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* LLM Summary */}
              <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl">
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Award size={14}/> LLM Reasoning Summary
                </h3>
                <p className="text-sm leading-relaxed text-slate-200 italic">"{result.summary}"</p>
              </div>

              {/* Trials */}
              <div className="space-y-4">
                <h3 className="text-white font-bold px-2">Clinical Trials ({result.trials.length})</h3>
                <div className="grid gap-3">
                  {result.trials.map((t, i) => (
                    <a href={t.url} target="_blank" key={i} className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all">
                      <div className="text-xs text-emerald-400 font-bold mb-1 uppercase tracking-tighter">{t.status}</div>
                      <div className="text-sm font-semibold">{t.title}</div>
                      <div className="text-[10px] text-slate-500 mt-2">Source: {t.source}</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Publications */}
              <div className="space-y-4">
                <h3 className="text-white font-bold px-2">Scientific Publications</h3>
                <div className="grid gap-3">
                  {result.publications.map((p, i) => (
                    <a href={p.url} target="_blank" key={i} className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all">
                      <div className="text-sm font-semibold text-slate-200">{p.title}</div>
                      <div className="text-[10px] text-slate-500 mt-2 flex justify-between">
                        <span>{p.source} • {p.year || "2026"}</span>
                        <span className="text-blue-500 italic underline">View Paper</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}