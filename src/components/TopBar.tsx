import React from 'react';
import { usePrototype } from '../context/PrototypeContext';
import { Play, Sparkles, Check, RefreshCw, Smartphone, Tablet, Monitor } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    project,
    mode,
    setMode,
    saveStatus,
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    previewDevice,
    setPreviewDevice,
  } = usePrototype();

  return (
    <header className="h-14 border-b border-neutral-800 bg-[#131314]/95 px-4 flex items-center justify-between select-none z-30 shrink-0 text-neutral-100 backdrop-blur">
      {/* Zone 1: Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-sm">
            PF
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-100">
            ProtoFlow
          </span>
        </div>

        <span className="text-neutral-600" aria-hidden="true">/</span>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-neutral-200 max-w-[260px] truncate">
            {project.name}
          </span>
          <span className="text-neutral-500 hidden sm:inline">· Quick Commerce</span>
        </div>
      </div>

      {/* Zone 2: Mode Navigation Tabs & Device Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 rounded-lg border bg-neutral-950 border-neutral-800">
          <button
            onClick={() => setMode('build')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'build'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Build
          </button>
          <button
            onClick={() => setMode('design')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'design'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => setMode('flow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'flow'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Flows
          </button>
        </div>

        {/* Device switcher in Design & Preview modes */}
        {(mode === 'design' || mode === 'preview') && (
          <div className="hidden md:flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 gap-0.5">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded transition-colors ${
                previewDevice === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded transition-colors ${
                previewDevice === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded transition-colors ${
                previewDevice === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Desktop View (1200px)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Zone 3: Actions & Status */}
      <div className="flex items-center gap-3">
        {/* Save Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-neutral-400">
          {saveStatus === 'saved' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Saving...</span>
            </>
          )}
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isAiDrawerOpen
              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white border border-neutral-700'
          }`}
          title="Open AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Assistant</span>
        </button>

        {/* Preview Button */}
        <button
          onClick={() => setMode(mode === 'preview' ? 'design' : 'preview')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'preview'
              ? 'bg-neutral-800 text-white border border-neutral-700'
              : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-sm'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{mode === 'preview' ? 'Exit Preview' : 'Preview'}</span>
        </button>
      </div>
    </header>
  );
};
