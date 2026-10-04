import React, { useState } from 'react';
import { usePrototype } from '../../context/PrototypeContext';
import { FlowStepNode } from './FlowStepNode';
import { AddStepModal } from './AddStepModal';
import {
  GitFork,
  Plus,
  Play,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const FlowMode: React.FC = () => {
  const {
    project,
    activeFlowId,
    setActiveFlowId,
    activeScreenId,
    setActiveScreenId,
    removeStepFromFlow,
    reorderFlowSteps,
    updateStepDestination,
    setMode,
  } = usePrototype();

  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; insertIndex: number }>({
    isOpen: false,
    insertIndex: 0,
  });

  const flows = Object.values(project.flows);
  const currentFlow = project.flows[activeFlowId] || flows[0];

  const handleOpenAddModal = (index: number) => {
    setModalState({
      isOpen: true,
      insertIndex: index,
    });
  };

  // Check if Delivery Address is in the Product Purchase flow
  const hasDeliveryAddressInPurchase =
    currentFlow.id === 'product_purchase' &&
    currentFlow.steps.some((s) => s.screenId === 'address');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Top Header & Flow Selector Bar */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 p-4 space-y-3 shrink-0 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-indigo-400" />
              <h1 className="text-base font-bold text-white tracking-tight">Product Flows</h1>
              <span className="text-[11px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                {flows.length} flows defined
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Visual navigation architecture. Reordering, adding, or rewiring steps changes the prototype in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('preview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Flow in Preview</span>
            </button>
          </div>
        </div>

        {/* Horizontal Flow Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {flows.map((flow) => {
            const isActive = flow.id === activeFlowId;
            return (
              <button
                key={flow.id}
                onClick={() => {
                  setActiveFlowId(flow.id);
                  setSelectedStepIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-neutral-700'
                    : 'bg-neutral-950/70 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80 hover:bg-neutral-900'
                }`}
              >
                <span>{flow.name}</span>
                <span className="text-[10px] font-mono text-neutral-500">({flow.steps.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Demonstration Callout Banner */}
      <div className="px-6 py-2.5 bg-indigo-950/40 border-b border-indigo-900/40 flex items-center justify-between text-xs text-indigo-200 select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            <strong>Core Interaction:</strong> Insert, delete, or rewire any step below. When you click{' '}
            <span className="font-semibold text-white">"+ Add Step"</span> between Product Details and Checkout,
            the prototype's <span className="underline decoration-indigo-400">Buy Now</span> button immediately directs to the new step!
          </span>
        </div>

        {hasDeliveryAddressInPurchase ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px] bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivery Address Active in Flow</span>
          </div>
        ) : (
          <button
            onClick={() => handleOpenAddModal(2)}
            className="text-[11px] font-semibold text-indigo-300 hover:text-white underline decoration-indigo-400 ml-4 whitespace-nowrap"
          >
            Try: Insert Delivery Address Step
          </button>
        )}
      </div>

      {/* Flow Diagram Workspace Canvas */}
      <div className="flex-1 overflow-auto p-6 md:p-10 relative bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px]">
        <div className="min-w-max pb-16 flex items-center gap-3">
          {currentFlow.steps.map((step, idx) => {
            const screen = project.screens[step.screenId];
            const isSelected = selectedStepIndex === idx;

            return (
              <React.Fragment key={step.id}>
                {/* Flow Step Card */}
                <div className="relative">
                  <FlowStepNode
                    step={step}
                    index={idx}
                    totalSteps={currentFlow.steps.length}
                    screen={screen}
                    isSelected={isSelected}
                    onSelect={() => setSelectedStepIndex(idx)}
                    onMoveEarlier={() => reorderFlowSteps(currentFlow.id, idx, idx - 1)}
                    onMoveLater={() => reorderFlowSteps(currentFlow.id, idx, idx + 1)}
                    onDelete={() => removeStepFromFlow(currentFlow.id, idx)}
                    onChangeDestination={(newTarget) =>
                      updateStepDestination(currentFlow.id, idx, newTarget)
                    }
                  />
                </div>

                {/* Connector Arrow + Inline "+ Add Step" button */}
                <div className="flex flex-col items-center justify-center px-1 group relative">
                  {/* Visual SVG Arrow */}
                  <div className="flex items-center text-neutral-600 group-hover:text-indigo-400 transition-colors">
                    <div className="w-6 h-[2px] bg-current" />
                    <ArrowRight className="w-4 h-4 -ml-1" />
                  </div>

                  {/* Add Step Button */}
                  <button
                    onClick={() => handleOpenAddModal(idx + 1)}
                    className="absolute -top-3 p-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all opacity-80 group-hover:opacity-100 shadow-md group-hover:scale-110"
                    title={`Insert step after ${step.title}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  <span className="text-[9px] text-neutral-500 mt-1 font-mono select-none">
                    next
                  </span>
                </div>
              </React.Fragment>
            );
          })}

          {/* Add Terminal Step Card Button at the End */}
          <button
            onClick={() => handleOpenAddModal(currentFlow.steps.length)}
            className="w-48 h-36 rounded-xl border-2 border-dashed border-neutral-800 hover:border-indigo-500/80 bg-neutral-900/40 hover:bg-neutral-900/80 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer p-4 text-center select-none"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold">Append Final Step</div>
            <div className="text-[10px] text-neutral-500 leading-tight">
              Add completion or follow-up screen
            </div>
          </button>
        </div>
      </div>

      {/* Add Step Modal */}
      <AddStepModal
        flowId={currentFlow.id}
        insertIndex={modalState.insertIndex}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, insertIndex: 0 })}
      />
    </div>
  );
};
