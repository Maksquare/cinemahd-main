'use client';

import React from 'react';
import { RefreshCw, Moon, Sun, ExternalLink, Star } from 'lucide-react';
import { STREAM_SERVERS } from '@/lib/embeds';

interface ServerSwitcherProps {
  activeServerId: string;
  onSelectServer: (serverId: string) => void;
  onRefresh: () => void;
  isLightsOut: boolean;
  onToggleLightsOut: () => void;
  currentEmbedUrl: string;
}

export const ServerSwitcher: React.FC<ServerSwitcherProps> = ({
  activeServerId,
  onSelectServer,
  onRefresh,
  isLightsOut,
  onToggleLightsOut,
  currentEmbedUrl,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-indigo-950/70 bg-[#0c0f22]/90 p-4 sm:p-5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
      {/* Cinebloom-style Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-tight text-white">
            Select Server
          </h3>
          <span className="text-xs text-indigo-300/70 font-normal">
            recommended server is highlighted
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{STREAM_SERVERS.length} Streaming Mirrors Online</span>
        </div>
      </div>

      {/* Grid / Wrap of Server Buttons matching Cinebloom exactly */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {STREAM_SERVERS.map((server) => {
          const isActive = activeServerId === server.id;
          const isRecommended = server.id === 'vidsrc';

          return (
            <button
              key={server.id}
              type="button"
              onClick={() => onSelectServer(server.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/35 border border-indigo-400/40 ring-1 ring-indigo-400/30 scale-[1.02]'
                  : isRecommended
                  ? 'bg-[#181d3d] text-indigo-200 hover:bg-[#222955] border border-indigo-500/30 hover:border-indigo-400/60'
                  : 'bg-[#14172e] text-white/80 hover:text-white hover:bg-[#1e2345] border border-[#22284d] hover:border-white/20'
              }`}
            >
              <span>{server.name}</span>
              <span className={`text-xs ${isActive ? 'text-amber-300' : 'text-white/40'}`}>
                ☆
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Toolbar: Popout direct window, Reload, Lights Out */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
        <div className="flex items-center gap-2">
          <a
            href={currentEmbedUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all shadow-sm"
            title="Opens the current server stream in a direct new window (bypasses browser adblockers and iframe sandbox)"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Direct Stream Window ↗</span>
          </a>
          <span className="hidden md:inline text-[11px] text-white/40">
            (Bypasses iframe & adblock restrictions)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            title="Reload current stream buffer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
            <span>Reload</span>
          </button>

          <button
            type="button"
            onClick={onToggleLightsOut}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              isLightsOut
                ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
            }`}
            title="Toggle Cinema Lights-Out Ambient Mode"
          >
            {isLightsOut ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span>{isLightsOut ? 'Lights On' : 'Lights Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
