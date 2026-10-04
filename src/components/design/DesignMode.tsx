import React, { useState } from 'react';
import { usePrototype } from '../../context/PrototypeContext';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { PropertiesPanel } from './PropertiesPanel';
import {
  ZoomIn,
  ZoomOut,
  Plus,
  Play,
  Type,
  Square,
  BadgeAlert,
  TextCursorInput,
  FolderPlus,
  ChevronDown,
} from 'lucide-react';
import { ElementType } from '../../types/prototype';

export const DesignMode: React.FC = () => {
  const {
    project,
    activeScreenId,
    setActiveScreenId,
    activeScreen,
    selectedElementId,
    setSelectedElementId,
    selectedElement,
    previewDevice,
    updateElementStyles,
    addElement,
    addCustomScreen,
    setMode,
  } = usePrototype();

  const [zoom, setZoom] = useState<number>(100);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const screens = Object.values(project.screens);

  // Device frame widths
  const deviceWidths = {
    mobile: 'max-w-[400px]',
    tablet: 'max-w-[640px]',
    desktop: 'max-w-[960px]',
  };

  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  const handleAddComponent = (type: ElementType) => {
    addElement(activeScreenId, type);
    setIsAddMenuOpen(false);
  };

  const handleNewScreenPrompt = () => {
    const name = window.prompt('Enter new screen name (e.g., Delivery Instructions, Coupon Code):', 'Special Offers');
    if (name && name.trim()) {
      addCustomScreen(name.trim(), 'conversion');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-neutral-800 bg-neutral-900/70 px-4 flex items-center justify-between gap-4 select-none shrink-0">
        {/* Screen Switcher Dropdown & Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider hidden sm:inline">
            Screen:
          </span>
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            {screens.slice(0, 6).map((sc) => {
              const isActive = sc.id === activeScreenId;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setActiveScreenId(sc.id);
                    setSelectedElementId(null);
                  }}
                  className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {sc.name}
                </button>
              );
            })}

            {screens.length > 6 && (
              <select
                value={activeScreenId}
                onChange={(e) => {
                  setActiveScreenId(e.target.value);
                  setSelectedElementId(null);
                }}
                className="bg-transparent text-xs text-neutral-300 font-medium px-2 py-1 focus:outline-none cursor-pointer"
              >
                {screens.slice(6).map((sc) => (
                  <option key={sc.id} value={sc.id} className="bg-neutral-900 text-white">
                    {sc.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleNewScreenPrompt}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
            title="Create new screen"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Add Screen</span>
          </button>
        </div>

        {/* Center / Right: Add Components & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Add Component Menu */}
          <div className="relative">
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Element</span>
              <ChevronDown className="w-3 h-3 text-indigo-200" />
            </button>

            {isAddMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl p-1 z-50 text-xs">
                <button
                  onClick={() => handleAddComponent('button')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-800 text-neutral-200 text-left"
                >
                  <Square className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Action Button</span>
                </button>
                <button
                  onClick={() => handleAddComponent('text')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-800 text-neutral-200 text-left"
                >
                  <Type className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Heading / Text</span>
                </button>
                <button
                  onClick={() => handleAddComponent('badge')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-800 text-neutral-200 text-left"
                >
                  <BadgeAlert className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Status Badge</span>
                </button>
                <button
                  onClick={() => handleAddComponent('card')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-800 text-neutral-200 text-left"
                >
                  <Square className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Feature Card</span>
                </button>
                <button
                  onClick={() => handleAddComponent('input')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-neutral-800 text-neutral-200 text-left"
                >
                  <TextCursorInput className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Input Field</span>
                </button>
              </div>
            )}
          </div>

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-950 px-1 py-0.5 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 15))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[11px] text-neutral-300">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 15))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fast preview toggle */}
          <button
            onClick={() => setMode('preview')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
            title="Preview interactive flow"
          >
            <Play className="w-3 h-3 fill-current text-emerald-400" />
            <span className="hidden sm:inline">Test Screen</span>
          </button>
        </div>
      </div>

      {/* Main Center Canvas & Right Properties Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div
          onClick={handleCanvasClick}
          className="flex-1 overflow-auto p-6 md:p-10 flex items-start justify-center relative bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Device Mockup Canvas */}
          <div
            className={`w-full ${deviceWidths[previewDevice]} bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 relative select-none`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mock Device Header / Status Bar */}
            <div className="h-9 bg-neutral-950 px-4 border-b border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>9:41</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-indigo-400 font-sans font-semibold tracking-wide uppercase">
                  {activeScreen.name}
                </span>
                <span>5G · 100%</span>
              </div>
            </div>

            {/* Screen Content Container */}
            <div className="p-4 space-y-3 min-h-[560px] bg-slate-50 text-slate-900 relative">
              {activeScreen.elements.map((element) => (
                <CanvasElementRenderer
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onSelect={() => setSelectedElementId(element.id)}
                  onMove={(dx, dy) => {
                    updateElementStyles(activeScreenId, element.id, {
                      x: (element.styles.x || 0) + dx,
                      y: (element.styles.y || 0) + dy,
                    });
                  }}
                />
              ))}

              {activeScreen.elements.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  This screen is currently empty. Click "Add Element" above to insert components.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel on the right */}
        <PropertiesPanel screenId={activeScreenId} element={selectedElement} />
      </div>
    </div>
  );
};
