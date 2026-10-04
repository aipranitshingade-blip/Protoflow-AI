import React, { useState, useEffect } from 'react';
import { usePrototype } from '../../context/PrototypeContext';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers,
  GitFork,
  ChevronRight,
  Check,
  MapPin,
  Clock,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import { Screen, CanvasElement } from '../../types/prototype';

export const PreviewView: React.FC = () => {
  const {
    project,
    activeScreenId,
    setActiveScreenId,
    activeFlowId,
    previewDevice,
    setMode,
  } = usePrototype();

  const [currentScreenId, setCurrentScreenId] = useState<string>(activeScreenId || 'home');
  const [history, setHistory] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(2);
  const [navNotification, setNavNotification] = useState<string | null>(null);

  // Sync with activeScreenId on mount
  useEffect(() => {
    if (activeScreenId) {
      setCurrentScreenId(activeScreenId);
    }
  }, [activeScreenId]);

  const currentScreen: Screen =
    project.screens[currentScreenId] || project.screens['home'] || Object.values(project.screens)[0];

  const currentFlow = project.flows[activeFlowId] || project.flows['product_purchase'];

  // Calculate position in current flow
  const currentFlowStepIndex = currentFlow.steps.findIndex(
    (s) => s.screenId === currentScreenId
  );

  const navigateTo = (targetScreenId: string, actionName?: string) => {
    if (project.screens[targetScreenId]) {
      const targetName = project.screens[targetScreenId].name;
      setHistory((prev) => [...prev, currentScreenId]);
      setCurrentScreenId(targetScreenId);
      setActiveScreenId(targetScreenId);

      // Show clear flow-connection feedback
      if (currentScreenId === 'details' && targetScreenId === 'address') {
        setNavNotification('Flow Rule Applied: Reached "Delivery Address" screen before Checkout!');
      } else if (currentScreenId === 'details' && targetScreenId === 'checkout') {
        setNavNotification('Direct Checkout: Navigated straight to Checkout (standard flow).');
      } else {
        setNavNotification(`Navigated to ${targetName} ${actionName ? `via "${actionName}"` : ''}`);
      }

      setTimeout(() => setNavNotification(null), 3500);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentScreenId(prev);
      setActiveScreenId(prev);
    } else {
      navigateTo('home');
    }
  };

  const handleRestart = () => {
    setHistory([]);
    // Find initial step in active flow or go home
    const firstStepScreen = currentFlow.steps[0]?.screenId || 'home';
    setCurrentScreenId(firstStepScreen);
    setActiveScreenId(firstStepScreen);
  };

  const deviceFrames = {
    mobile: 'max-w-[410px] min-h-[720px] rounded-[36px] border-[8px] border-neutral-800 shadow-2xl',
    tablet: 'max-w-[700px] min-h-[780px] rounded-[28px] border-[8px] border-neutral-800 shadow-2xl',
    desktop: 'max-w-[1000px] min-h-[720px] rounded-xl border border-neutral-700 shadow-xl',
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950 text-neutral-100 select-none">
      {/* Top Preview Control Ribbon */}
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/80 px-4 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Interactive Prototype</span>
          </div>

          <span className="text-neutral-600 hidden sm:inline">|</span>

          {/* Active Flow Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-neutral-400">
            <GitFork className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active Flow:</span>
            <span className="text-indigo-300 font-medium">{currentFlow.name}</span>
            {currentFlowStepIndex !== -1 ? (
              <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono">
                Step {currentFlowStepIndex + 1} of {currentFlow.steps.length} ({currentScreen.name})
              </span>
            ) : (
              <span className="text-neutral-500 text-[10px]">(Out-of-flow branch)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Restart Prototype Journey"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart Journey</span>
          </button>

          <button
            onClick={() => setMode('flow')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-950 border border-indigo-800/80 hover:bg-indigo-900 text-indigo-200 transition-colors"
          >
            <GitFork className="w-3 h-3" />
            <span>Edit Flow</span>
          </button>

          <button
            onClick={() => setMode('design')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
          >
            <Layers className="w-3 h-3" />
            <span>Edit in Design</span>
          </button>
        </div>
      </div>

      {/* Main Preview Frame Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] relative">
        {/* Floating Flow Notification Banner */}
        {navNotification && (
          <div className="absolute top-4 z-40 px-4 py-2 rounded-full bg-neutral-900 border border-indigo-500/80 shadow-2xl text-xs font-medium text-indigo-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{navNotification}</span>
          </div>
        )}

        <div className={`w-full ${deviceFrames[previewDevice]} bg-white text-slate-900 flex flex-col overflow-hidden relative transition-all duration-200`}>
          {/* Mobile Hardware Top Notch / Speaker (if mobile) */}
          {previewDevice === 'mobile' && (
            <div className="h-7 bg-neutral-900 px-6 flex items-center justify-between text-[11px] text-white font-mono shrink-0 select-none">
              <span>9:41</span>
              <div className="w-20 h-4 bg-neutral-950 rounded-full" />
              <span>5G · 100%</span>
            </div>
          )}

          {/* App In-Screen Navigation Header */}
          <div className="h-12 border-b border-slate-200 bg-white/90 backdrop-blur px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {currentScreenId !== 'home' ? (
                <button
                  onClick={handleBack}
                  className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                  QM
                </div>
              )}
              <span className="font-bold text-sm tracking-tight text-slate-900">
                {currentScreen.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('cart')}
                className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
                title="Open Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Screen Dynamic Interactive Elements Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
            {currentScreen.elements.map((element: CanvasElement) => {
              const { styles } = element;

              const elementStyle: React.CSSProperties = {
                width: styles.width || '100%',
                height: styles.height || 'auto',
                padding: styles.padding || '12px',
                fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
                fontWeight: styles.fontWeight || '400',
                color: styles.color,
                backgroundColor: styles.backgroundColor,
                borderRadius: styles.borderRadius !== undefined ? `${styles.borderRadius}px` : undefined,
                borderColor: styles.borderColor,
                borderWidth: styles.borderWidth !== undefined ? `${styles.borderWidth}px` : undefined,
                borderStyle: styles.borderWidth ? 'solid' : undefined,
                textAlign: styles.textAlign || 'left',
              };

              const hasAction = !!element.actionTarget;

              return (
                <div
                  key={element.id}
                  onClick={() => {
                    if (element.actionTarget) {
                      navigateTo(element.actionTarget, element.actionLabel || element.content);
                    }
                  }}
                  className={`${
                    hasAction
                      ? 'cursor-pointer active:scale-[0.98] transition-all hover:opacity-95 shadow-xs'
                      : ''
                  }`}
                  style={elementStyle}
                >
                  <div className="flex items-center justify-between">
                    <span className="leading-snug">{element.content}</span>
                    {hasAction && element.type === 'button' && (
                      <ChevronRight className="w-4 h-4 ml-1 opacity-70 shrink-0" />
                    )}
                  </div>

                  {element.secondaryContent && (
                    <div className="text-[12px] opacity-80 mt-1 font-normal leading-relaxed">
                      {element.secondaryContent}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation Bar */}
          <div className="h-14 border-t border-slate-200 bg-white px-6 flex items-center justify-around text-[10px] text-slate-500 shrink-0 font-medium">
            <button
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreenId === 'home' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span>Store</span>
            </button>
            <button
              onClick={() => navigateTo('listing')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreenId === 'listing' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span>Browse</span>
            </button>
            <button
              onClick={() => navigateTo('cart')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreenId === 'cart' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span>Cart ({cartCount})</span>
            </button>
            <button
              onClick={() => navigateTo('tracking')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreenId === 'tracking' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span>Orders</span>
            </button>
            <button
              onClick={() => navigateTo('login')}
              className={`flex flex-col items-center gap-0.5 ${
                currentScreenId === 'login' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span>Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Active Flow Path Tracker Bar */}
      <div className="h-10 bg-neutral-900/90 border-t border-neutral-800 px-4 flex items-center justify-between text-xs text-neutral-400 select-none shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
            Flow Journey:
          </span>
          {currentFlow.steps.map((st, i) => {
            const isPassed = currentFlowStepIndex >= i;
            const isCurrent = st.screenId === currentScreenId;
            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => navigateTo(st.screenId)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    isCurrent
                      ? 'bg-indigo-600 text-white font-semibold'
                      : isPassed
                      ? 'bg-neutral-800 text-neutral-200'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {st.title}
                </button>
                {i < currentFlow.steps.length - 1 && (
                  <span className="text-neutral-600 text-[10px]">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
          Two-way sync active
        </div>
      </div>
    </div>
  );
};
