import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Activity, ShieldAlert, TrendingUp } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AIAssistant = ({ token }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}ai/insights/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsights(response.data);
    } catch (err) {
      setError("AI Core Synchronization Failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchInsights();
  }, [token]);

  return (
    <div className="bg-primary/5 backdrop-blur-xl border border-primary/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Sparkles size={120} className="text-primary animate-pulse" />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary p-2 rounded-lg">
          <Activity size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-black text-primary tracking-tight uppercase italic">Matrix AI Brain</h2>
          <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Autonomous Strategic Layer</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-primary/10 rounded w-3/4"></div>
          <div className="h-20 bg-primary/5 rounded w-full"></div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase">
          <ShieldAlert size={16} />
          {error}
        </div>
      ) : insights ? (
        <div className="space-y-6 relative z-10">
          <div className="p-4 bg-white/50 rounded-2xl border border-primary/5">
            <p className="text-sm font-bold text-primary leading-relaxed">
              "{insights.summary}"
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2">Strategic Directives</h3>
            {insights.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-primary text-secondary rounded-xl hover:scale-[1.02] transition-transform cursor-pointer shadow-lg">
                <TrendingUp size={14} className="mt-0.5 shrink-0" />
                <p className="text-[11px] font-bold uppercase leading-tight">{rec}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={fetchInsights}
            className="w-full py-3 border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-secondary transition-all"
          >
            Recalibrate Strategy
          </button>
        </div>
      ) : (
        <button 
          onClick={fetchInsights}
          className="w-full py-4 bg-primary text-secondary rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-primary/20 shadow-xl transition-all"
        >
          Initialize AI Core
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
