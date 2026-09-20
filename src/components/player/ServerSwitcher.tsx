'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Moon,
  Sun,
  ExternalLink,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  Server,
  Check,
  Sparkles,
} from 'lucide-react';
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
  const [showMoreServers, setShowMoreServers] = useState(false);

  // Top 2 Primary Options
  const primaryServers = STREAM_SERVERS.slice(0, 2);
  // Hidden Backup Mirrors
  const backupServers = STREAM_SERVERS.slice(2);

  const activeServer =
    STREAM_SERVERS.find((s) => s.id === activeServerId) || STREAM_SERVERS[0];

  const isBackupActive = backupServers.some((s) => s.id === activeServerId);

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-indigo-950/70 bg-[#0b0e20]/95 p-4 sm:p-5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.65)]">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Server className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Streaming Server
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live: {activeServer.name}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="hidden sm:inline">Automatic Failover Enabled</span>
          <span className="text-white/20">•</span>
          <span className="text-amber-400/80 font-medium">1080p / 4K Stream</span>
        </div>
      </div>

      {/* Primary 2 Servers + Smart More Dropdown Trigger */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Option 1: VidSrc VIP */}
        {primaryServers[0] && (
          <button
            type="button"
            onClick={() => {
              onSelectServer(primaryServers[0].id);
              setShowMoreServers(false);
            }}
            className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeServerId === primaryServers[0].id
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-black font-bold shadow-lg shadow-amber-500/30 border border-amber-300 scale-[1.02]'
                : 'border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:border-amber-400/50'
            }`}
          >
            <Star
              className={`h-4 w-4 ${
                activeServerId === primaryServers[0].id
                  ? 'fill-black text-black'
                  : 'fill-amber-400/40 text-amber-400'
              }`}
            />
            <span>{primaryServers[0].name}</span>
            <span
              className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold ${
                activeServerId === primaryServers[0].id
                  ? 'bg-black/20 text-black'
                  : 'bg-amber-400/20 text-amber-300'
              }`}
            >
              Primary 4K
            </span>
          </button>
        )}

        {/* Option 2: VidSrc.pm */}
        {primaryServers[1] && (
          <button
            type="button"
            onClick={() => {
              onSelectServer(primaryServers[1].id);
              setShowMoreServers(false);
            }}
            className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeServerId === primaryServers[1].id
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/40 border border-indigo-400/50 ring-1 ring-indigo-400/40 scale-[1.02]'
                : 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/60'
            }`}
          >
            <Zap
              className={`h-4 w-4 ${
                activeServerId === primaryServers[1].id ? 'text-amber-300' : 'text-indigo-400'
              }`}
            />
            <span>{primaryServers[1].name}</span>
            <span
              className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold ${
                activeServerId === primaryServers[1].id
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-500/20 text-indigo-300'
              }`}
            >
              Mirror 2
            </span>
          </button>
        )}

        {/* Smart Expand Button for Other Mirrors */}
        <button
          type="button"
          onClick={() => setShowMoreServers((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            isBackupActive
              ? 'border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-500/15 font-semibold'
              : showMoreServers
              ? 'border border-white/25 bg-white/15 text-white font-semibold'
              : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
          }`}
          title="Toggle auxiliary streaming servers"
        >
          {isBackupActive ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Active: {activeServer.name}</span>
            </>
          ) : (
            <>
              <span>More Mirrors ({backupServers.length})</span>
            </>
          )}
          {showMoreServers ? (
            <ChevronUp className="h-3.5 w-3.5 text-white/60" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-white/60" />
          )}
        </button>
      </div>

      {/* Expandable Hidden Mirrors Drawer */}
      <AnimatePresence>
        {showMoreServers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-white/10 bg-[#121630]/90 p-3.5 sm:p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/5 pb-2">
                <span className="font-semibold text-white/70">
                  Auxiliary Cloud Mirrors & CDNs:
                </span>
                <span className="text-[11px] text-indigo-300/80">
                  Switch if primary server buffers
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {backupServers.map((server) => {
                  const isActive = activeServerId === server.id;
                  const isUltra = server.speed === 'Ultra';

                  return (
                    <button
                      key={server.id}
                      type="button"
                      onClick={() => {
                        onSelectServer(server.id);
                        setShowMoreServers(false);
                      }}
                      className={`flex flex-col items-start gap-1 rounded-xl p-2.5 text-left text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'border border-emerald-500/60 bg-emerald-500/20 text-white font-bold shadow-md shadow-emerald-500/20'
                          : 'border border-white/8 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-1">
                        <span className="font-semibold truncate">{server.name}</span>
                        {isActive && (
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                        <span
                          className={`font-medium ${
                            isUltra ? 'text-amber-300' : 'text-indigo-300'
                          }`}
                        >
                          {isUltra ? '⚡ Ultra' : 'Fast'}
                        </span>
                        <span>•</span>
                        <span>{server.quality}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Toolbar: Open Direct Stream, Reload, Lights Out */}
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
            (Bypasses iframe restrictions)
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
