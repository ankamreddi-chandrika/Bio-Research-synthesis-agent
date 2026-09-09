import React from 'react';
import { Users, Mail, Building, Award, Plus } from 'lucide-react';

export default function TeamView({ users }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Pharma Research Personnel & Investigators</h2>
          <p className="text-xs text-slate-400">Reviewers, Principal Investigators, and Clinical Scientists</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users && users.length > 0 ? (
          users.map((u) => (
            <div
              key={u.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={u.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`}
                  alt={u.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
                />
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-white leading-tight">{u.name}</h3>
                  <p className="text-[11px] font-medium text-sky-400">{u.role}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{u.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate text-slate-300 font-mono text-[11px]">{u.email}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 p-8 text-center text-slate-500 text-xs rounded-2xl bg-slate-900/40 border border-slate-800/60">
            No research team members found.
          </div>
        )}
      </div>
    </div>
  );
}
