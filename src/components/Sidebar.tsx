import React from 'react';
import { usePrototype } from '../context/PrototypeContext';
import { Sparkles, Layers, GitFork, Smartphone, ChevronRight, Plus, RotateCcw } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    mode,
    setMode,
    project,
    activeScreenId,
    setActiveScreenId,
    activeFlowId,
    setActiveFlowId,
    resetToDefault,
  } = usePrototype();

  const screensList = Object.values(project.screens);
  const flowsList = Object.values(project.flows);

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 flex flex-col justify-between shrink-0 select-none">
      {/* Top Primary Modes */}
      <div className="p-3 space-y-6">
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Workspaces
          </div>

          <button
            onClick={() => setMode('build')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'build'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-4 h-4 ${mode === 'build' ? 'text-indigo-400' : 'text-neutral-500'}`} />
              <span>Build</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">1</span>
          </button>

          <button
            onClick={() => setMode('design')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'design'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className={`w-4 h-4 ${mode === 'design' ? 'text-indigo-400' : 'text-neutral-500'}`} />
              <span>Design</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">2</span>
          </button>

          <button
            onClick={() => setMode('flow')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === 'flow'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GitFork className={`w-4 h-4 ${mode === 'flow' ? 'text-indigo-400' : 'text-neutral-500'}`} />
              <span>Flows</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">3</span>
          </button>
        </div>

        {/* Quick Screens Navigator in Design Mode */}
        {mode === 'design' && (
          <div className="space-y-1">
            <div className="px-3 pb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              <span>Prototype Screens</span>
              <span className="font-mono text-[10px] text-neutral-600">{screensList.length}</span>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
              {screensList.map((screen) => {
                const isSelected = screen.id === activeScreenId;
                return (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreenId(screen.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                      isSelected
                        ? 'bg-indigo-950/60 text-indigo-200 font-medium border border-indigo-800/60'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Smartphone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{screen.name}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Flows Navigator in Flow Mode */}
        {mode === 'flow' && (
          <div className="space-y-1">
            <div className="px-3 pb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              <span>Active Flows</span>
              <span className="font-mono text-[10px] text-neutral-600">{flowsList.length}</span>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
              {flowsList.map((flow) => {
                const isSelected = flow.id === activeFlowId;
                return (
                  <button
                    key={flow.id}
                    onClick={() => setActiveFlowId(flow.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                      isSelected
                        ? 'bg-indigo-950/60 text-indigo-200 font-medium border border-indigo-800/60'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <GitFork className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{flow.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">{flow.steps.length}s</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Reset Demo */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/30">
        <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 mb-2">
          <div className="text-[11px] font-medium text-neutral-300">Model Concept</div>
          <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
            AI generates initial prototype. Human directs visual design and flow architecture.
          </div>
        </div>

        <button
          onClick={resetToDefault}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors"
          title="Reset sample app state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample App</span>
        </button>
      </div>
    </aside>
  );
};
