import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function PublicationTrendsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-xs">
        No publication trend data available.
      </div>
    );
  }

  const chartData = data.map(d => ({
    period: d.period,
    'Publications Indexed': d.papers_indexed,
    'AI Syntheses Run': d.syntheses_run,
    'Evidence Quality Score': (d.avg_evidence_score * 100).toFixed(0),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPapers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorSyntheses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#1e293b',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="Publications Indexed"
            stroke="#38bdf8"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorPapers)"
          />
          <Area
            type="monotone"
            dataKey="AI Syntheses Run"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSyntheses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
