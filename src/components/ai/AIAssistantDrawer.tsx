import React, { useState } from 'react';
import { usePrototype } from '../../context/PrototypeContext';
import {
  Sparkles,
  X,
  Send,
  CheckCircle2,
  ArrowRight,
  Layers,
  GitFork,
  HelpCircle,
  Clock,
  Zap,
} from 'lucide-react';

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    executeAiCommand,
    aiLogs,
    setActiveScreenId,
    setActiveFlowId,
    setMode,
  } = usePrototype();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentResult, setRecentResult] = useState<{
    message: string;
    type: string;
  } | null>(null);

  if (!isAiDrawerOpen) return null;

  const quickPrompts = [
    'Add a delivery address screen before checkout.',
    'Make the checkout button blue.',
    'Make the buy button emerald green.',
    'Add a search screen.',
    'Change the product card layout.',
  ];

  const handleSubmit = async (textToRun?: string) => {
    const promptToExecute = textToRun || inputPrompt;
    if (!promptToExecute.trim() || isProcessing) return;

    setIsProcessing(true);
    setRecentResult(null);

    try {
      const res = await executeAiCommand(promptToExecute);
      setRecentResult({ message: res.message, type: res.type });
      if (!textToRun) setInputPrompt('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col select-none animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">AI Prototype Assistant</h3>
            <p className="text-[10px] text-neutral-400">Targeted prototype modifications</p>
          </div>
        </div>

        <button
          onClick={() => setIsAiDrawerOpen(false)}
          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Concept Notice */}
        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
          <div className="text-neutral-200 font-semibold flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>Targeted Execution Engine</span>
          </div>
          <p>
            AI handles technical wiring and design tokens without inadvertently altering unrelated screens or flows.
          </p>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Quick Prompts
          </label>
          <div className="space-y-1">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(q)}
                disabled={isProcessing}
                className="w-full text-left p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800/80 text-xs text-neutral-300 hover:text-white transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <span className="truncate pr-2">{q}</span>
                <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-indigo-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Live Diff / Feedback Card */}
        {recentResult && (
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/50 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Targeted Modification Applied</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {recentResult.message}
            </p>
            <div className="pt-2 border-t border-indigo-900/60 flex items-center gap-2 text-xs">
              <button
                onClick={() => {
                  setMode('flow');
                  setIsAiDrawerOpen(false);
                }}
                className="flex items-center gap-1 text-indigo-300 hover:text-white font-medium"
              >
                <GitFork className="w-3 h-3" />
                <span>Inspect in Flows</span>
              </button>
              <span className="text-neutral-600">·</span>
              <button
                onClick={() => {
                  setMode('design');
                  setIsAiDrawerOpen(false);
                }}
                className="flex items-center gap-1 text-indigo-300 hover:text-white font-medium"
              >
                <Layers className="w-3 h-3" />
                <span>Inspect in Design</span>
              </button>
            </div>
          </div>
        )}

        {/* Modification History / Audit Log */}
        <div className="space-y-2 pt-2 border-t border-neutral-800/80">
          <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Modification Audit Log</span>
            </span>
            <span className="font-mono text-neutral-500">{aiLogs.length}</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {aiLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/70 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span className="font-mono font-medium text-indigo-400 uppercase">
                    {log.type.replace('_', ' ')}
                  </span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="font-medium text-neutral-200">{log.title}</div>
                <p className="text-[11px] text-neutral-400 leading-snug">{log.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Prompt Input */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type a prototype adjustment..."
            className="flex-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isProcessing}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
