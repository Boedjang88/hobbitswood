"use client";

import { Activity, Users, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function StorePulse() {
  const visitors = 12;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-zinc-900 p-6 rounded-2xl shadow-xl text-white group">
      {/* Animated glowing orb in the background */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse delay-1000" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
            <Activity className="w-7 h-7 text-white" />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Live Store Pulse</h2>
            <p className="text-sm text-purple-200 mt-1">Real-time activity overview</p>
          </div>
        </div>

        <div className="flex items-center gap-8 bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10 w-full md:w-auto">
          <div>
            <div className="flex items-center gap-2 text-purple-200 text-sm mb-1">
              <Users className="w-4 h-4" /> Active Visitors
            </div>
            <div className="text-3xl font-bold flex items-baseline gap-2">
              {visitors}
              <span className="text-xs font-normal text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> Live
              </span>
            </div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div>
            <div className="flex items-center gap-2 text-purple-200 text-sm mb-1">
              Store Status
            </div>
            <div className="text-sm font-medium px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online & Fast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
