import React, { useState } from 'react';
import { usePrototype } from '../../context/PrototypeContext';
import { Plus, X, ArrowRight, ShieldCheck, MapPin, CreditCard, Tag } from 'lucide-react';

interface AddStepModalProps {
  flowId: string;
  insertIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const AddStepModal: React.FC<AddStepModalProps> = ({
  flowId,
  insertIndex,
  isOpen,
  onClose,
}) => {
  const { project, insertStepIntoFlow } = usePrototype();
  const [selectedScreenId, setSelectedScreenId] = useState<string>('address');
  const [actionTrigger, setActionTrigger] = useState<string>('Confirms shipping destination');

  if (!isOpen) return null;

  const screens = Object.values(project.screens);
  const currentFlow = project.flows[flowId];
  const prevStep = insertIndex > 0 ? currentFlow?.steps[insertIndex - 1] : null;
  const nextStep = currentFlow?.steps[insertIndex] || null;

  const handleInsert = () => {
    const chosenScreen = project.screens[selectedScreenId];
    insertStepIntoFlow(
      flowId,
      insertIndex,
      selectedScreenId,
      chosenScreen?.name || 'New Step',
      actionTrigger
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Add Step to Flow</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Insert a screen into <span className="text-indigo-300 font-medium">{currentFlow?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Visual Insertion Preview */}
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs flex items-center justify-between gap-2 overflow-x-auto font-mono">
            <div className="px-2.5 py-1.5 rounded bg-neutral-800 text-neutral-300 truncate max-w-[120px]">
              {prevStep ? prevStep.title : 'Flow Start'}
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="px-2.5 py-1.5 rounded bg-indigo-950 border border-indigo-500/80 text-indigo-200 font-semibold truncate max-w-[140px] animate-pulse">
              + {project.screens[selectedScreenId]?.name || 'Selected Screen'}
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="px-2.5 py-1.5 rounded bg-neutral-800 text-neutral-300 truncate max-w-[120px]">
              {nextStep ? nextStep.title : 'Flow End'}
            </div>
          </div>

          {/* Screen Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Choose Screen to Insert</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {screens.map((screen) => {
                const isSelected = screen.id === selectedScreenId;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      setSelectedScreenId(screen.id);
                      if (screen.id === 'address') {
                        setActionTrigger('Confirms delivery address');
                      } else if (screen.id === 'cart') {
                        setActionTrigger('Reviews items in basket');
                      } else {
                        setActionTrigger(`Continues to ${nextStep?.title || 'next screen'}`);
                      }
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate">{screen.name}</div>
                    <div className="text-[10px] text-neutral-500 truncate mt-0.5">{screen.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Label */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Action / Trigger Label</label>
            <input
              type="text"
              value={actionTrigger}
              onChange={(e) => setActionTrigger(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Enters shipping details"
            />
          </div>

          {/* Two-Way Sync Explanation Banner */}
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg text-[11px] text-neutral-400 space-y-1">
            <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <span>Automatic Prototype Wiring</span>
            </div>
            <p>
              ProtoFlow will automatically update the previous screen's primary CTA button to target this new screen, and wire this screen's submit action to continue to the next step.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-sm"
          >
            Insert Step & Rewire Flow
          </button>
        </div>
      </div>
    </div>
  );
};
