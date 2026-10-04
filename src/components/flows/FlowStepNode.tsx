import React, { useState } from 'react';
import { usePrototype } from '../../context/PrototypeContext';
import { FlowStep, Screen } from '../../types/prototype';
import {
  ExternalLink,
  Trash2,
  ArrowRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FlowStepNodeProps {
  step: FlowStep;
  index: number;
  totalSteps: number;
  screen?: Screen;
  isSelected: boolean;
  onSelect: () => void;
  onMoveEarlier: () => void;
  onMoveLater: () => void;
  onDelete: () => void;
  onChangeDestination: (targetScreenId: string) => void;
}

export const FlowStepNode: React.FC<FlowStepNodeProps> = ({
  step,
  index,
  totalSteps,
  screen,
  isSelected,
  onSelect,
  onMoveEarlier,
  onMoveLater,
  onDelete,
  onChangeDestination,
}) => {
  const { setActiveScreenId, setMode, project } = usePrototype();
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const screens = Object.values(project.screens);

  const handleOpenScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveScreenId(step.screenId);
    setMode('design');
  };

  return (
    <div
      onClick={onSelect}
      className={`w-72 rounded-xl p-4 transition-all duration-150 select-none cursor-pointer border relative group ${
        isSelected
          ? 'bg-neutral-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
          : 'bg-neutral-900/80 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
      }`}
    >
      {/* Top row: Step index and screen category */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center text-[10px] font-mono font-semibold">
            {index + 1}
          </span>
          <span className="text-[11px] font-medium text-neutral-400 capitalize">
            {screen?.category || 'Screen'}
          </span>
        </div>

        {/* Reorder and menu buttons */}
        <div className="flex items-center gap-1">
          {index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveEarlier();
              }}
              className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              title="Move earlier in flow"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {index < totalSteps - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveLater();
              }}
              className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              title="Move later in flow"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 rounded text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-40 bg-neutral-950 border border-neutral-800 rounded-lg shadow-xl p-1 z-30 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setIsEditingDestination(!isEditingDestination);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-800 text-neutral-300 text-left"
                >
                  <Edit2 className="w-3 h-3 text-neutral-400" />
                  <span>Change Destination</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenScreen({} as any);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-800 text-neutral-300 text-left"
                >
                  <Layers className="w-3 h-3 text-indigo-400" />
                  <span>Edit in Design</span>
                </button>
                {totalSteps > 1 && (
                  <button
                    onClick={() => {
                      onDelete();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-red-950/60 text-red-400 text-left"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Step</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screen Title & Micro-Preview */}
      <div className="space-y-1.5">
        <h4 className="text-sm font-semibold text-white tracking-tight flex items-center justify-between">
          <span>{screen?.name || step.title}</span>
          <span className="text-[10px] text-neutral-500 font-mono">id: {step.screenId}</span>
        </h4>
        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
          {screen?.description || 'Active screen in execution graph'}
        </p>
      </div>

      {/* Action Trigger Box */}
      <div className="mt-3 p-2 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-[11px] space-y-1">
        <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
          User Action Trigger
        </div>
        <div className="text-neutral-200 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
          <span className="truncate">{step.actionTrigger}</span>
        </div>
      </div>

      {/* Target Destination Link */}
      <div className="mt-2.5 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
        <div className="text-neutral-400 flex items-center gap-1 truncate max-w-[170px]">
          <span className="text-neutral-500">Leads to:</span>
          {step.targetScreenId ? (
            <span className="font-semibold text-indigo-300 truncate">
              {project.screens[step.targetScreenId]?.name || step.targetScreenId}
            </span>
          ) : (
            <span className="text-neutral-600 italic">Terminal Step</span>
          )}
        </div>

        {/* Open Screen Button */}
        <button
          onClick={handleOpenScreen}
          className="flex items-center gap-1 text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded transition-colors"
          title="Open this screen in Design workspace"
        >
          <span>Open Screen</span>
          <ExternalLink className="w-3 h-3 text-neutral-400" />
        </button>
      </div>

      {/* Inline Destination Switcher */}
      {isEditingDestination && (
        <div
          className="mt-3 p-2.5 rounded-lg bg-neutral-950 border border-indigo-800/80 space-y-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] text-neutral-400 font-medium">Rewire step destination to:</div>
          <select
            value={step.targetScreenId || ''}
            onChange={(e) => {
              onChangeDestination(e.target.value);
              setIsEditingDestination(false);
            }}
            className="w-full px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-xs text-white focus:outline-none"
          >
            <option value="">(None - End of flow)</option>
            {screens.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name} ({sc.id})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
