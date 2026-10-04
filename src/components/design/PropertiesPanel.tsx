import React from 'react';
import { usePrototype } from '../../context/PrototypeContext';
import {
  CanvasElement,
  ElementStyles,
} from '../../types/prototype';
import {
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  Type,
  Maximize2,
  Square,
  Link,
  ChevronDown,
} from 'lucide-react';

interface PropertiesPanelProps {
  screenId: string;
  element: CanvasElement | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ screenId, element }) => {
  const {
    project,
    updateElementStyles,
    updateElementContent,
    updateElementAction,
    duplicateElement,
    deleteElement,
  } = usePrototype();

  if (!element) {
    return (
      <aside className="w-72 border-l border-neutral-800 bg-neutral-900/60 p-5 flex flex-col justify-center items-center text-center select-none text-neutral-500">
        <Square className="w-8 h-8 stroke-1 text-neutral-600 mb-3" />
        <h4 className="text-xs font-semibold text-neutral-300">No Element Selected</h4>
        <p className="text-[11px] text-neutral-500 mt-1 max-w-[180px] leading-relaxed">
          Click any element on the screen canvas to adjust its layout, typography, appearance, or navigation link.
        </p>
      </aside>
    );
  }

  const { styles } = element;
  const screens = Object.values(project.screens);

  const handleStyleChange = (partial: Partial<ElementStyles>) => {
    updateElementStyles(screenId, element.id, partial);
  };

  return (
    <aside className="w-80 border-l border-neutral-800 bg-neutral-900/90 overflow-y-auto p-4 space-y-5 select-none text-neutral-200">
      {/* Header: Element Name and Quick Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="truncate pr-2">
          <span className="text-[10px] uppercase font-semibold text-neutral-500 font-mono tracking-wider">
            {element.type}
          </span>
          <h3 className="text-xs font-semibold text-white truncate">{element.name}</h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateElement(screenId, element.id)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            title="Duplicate Element"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteElement(screenId, element.id)}
            className="p-1.5 rounded hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition-colors"
            title="Delete Element"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Primary Content / Text
        </label>
        <input
          type="text"
          value={element.content}
          onChange={(e) => updateElementContent(screenId, element.id, e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-indigo-500"
        />

        {element.secondaryContent !== undefined && (
          <div className="pt-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Secondary Subtitle
            </label>
            <input
              type="text"
              value={element.secondaryContent}
              onChange={(e) => updateElementContent(screenId, element.id, element.content, e.target.value)}
              className="w-full mt-1 px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-md text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* 1. Layout Section */}
      <div className="space-y-3 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-neutral-500" />
            <span>Layout</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Width</label>
            <input
              type="text"
              value={styles.width || '100%'}
              onChange={(e) => handleStyleChange({ width: e.target.value })}
              className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
              placeholder="e.g. 100% or 200px"
            />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Height</label>
            <input
              type="text"
              value={styles.height || 'auto'}
              onChange={(e) => handleStyleChange({ height: e.target.value })}
              className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
              placeholder="auto"
            />
          </div>
        </div>

        {/* Position X / Y Offset */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Offset X</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={styles.x || 0}
                onChange={(e) => handleStyleChange({ x: Number(e.target.value) })}
                className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
              />
              <span className="text-[10px] text-neutral-600">px</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Offset Y</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={styles.y || 0}
                onChange={(e) => handleStyleChange({ y: Number(e.target.value) })}
                className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
              />
              <span className="text-[10px] text-neutral-600">px</span>
            </div>
          </div>
        </div>

        {/* Spacing / Padding */}
        <div>
          <label className="text-[10px] text-neutral-500 block mb-1">Inner Spacing (Padding)</label>
          <input
            type="text"
            value={styles.padding || '12px'}
            onChange={(e) => handleStyleChange({ padding: e.target.value })}
            className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
            placeholder="e.g. 12px or 8px 16px"
          />
        </div>
      </div>

      {/* 2. Typography Section */}
      <div className="space-y-3 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Type className="w-3 h-3 text-neutral-500" />
            <span>Typography</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Size (px)</label>
            <input
              type="number"
              value={styles.fontSize || 14}
              onChange={(e) => handleStyleChange({ fontSize: Number(e.target.value) })}
              className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
              min={10}
              max={48}
            />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Weight</label>
            <select
              value={styles.fontWeight || '400'}
              onChange={(e) => handleStyleChange({ fontWeight: e.target.value as any })}
              className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label className="text-[10px] text-neutral-500 block mb-1">Text Alignment</label>
          <div className="flex bg-neutral-950 p-0.5 rounded border border-neutral-800">
            <button
              onClick={() => handleStyleChange({ textAlign: 'left' })}
              className={`flex-1 py-1 rounded text-xs flex justify-center ${
                styles.textAlign === 'left' || !styles.textAlign ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleStyleChange({ textAlign: 'center' })}
              className={`flex-1 py-1 rounded text-xs flex justify-center ${
                styles.textAlign === 'center' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleStyleChange({ textAlign: 'right' })}
              className={`flex-1 py-1 rounded text-xs flex justify-center ${
                styles.textAlign === 'right' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <AlignRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Appearance Section */}
      <div className="space-y-3 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          <span>Appearance</span>
        </div>

        {/* Text Color */}
        <div>
          <label className="text-[10px] text-neutral-500 block mb-1">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styles.color || '#0F172A'}
              onChange={(e) => handleStyleChange({ color: e.target.value })}
              className="w-6 h-6 rounded border border-neutral-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={styles.color || '#0F172A'}
              onChange={(e) => handleStyleChange({ color: e.target.value })}
              className="flex-1 px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-mono"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="text-[10px] text-neutral-500 block mb-1">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styles.backgroundColor || '#0F172A'}
              onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
              className="w-6 h-6 rounded border border-neutral-700 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={styles.backgroundColor || 'transparent'}
              onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
              className="flex-1 px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-mono"
            />
          </div>
          {/* Quick Color Presets */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {[
              { label: 'Dark', hex: '#0F172A' },
              { label: 'Blue', hex: '#2563EB' },
              { label: 'Green', hex: '#059669' },
              { label: 'Amber', hex: '#D97706' },
              { label: 'White', hex: '#FFFFFF' },
            ].map((preset) => (
              <button
                key={preset.hex}
                onClick={() =>
                  handleStyleChange({
                    backgroundColor: preset.hex,
                    color: preset.hex === '#FFFFFF' ? '#0F172A' : '#FFFFFF',
                  })
                }
                className="w-4 h-4 rounded-full border border-neutral-700 hover:scale-110 transition-transform"
                style={{ backgroundColor: preset.hex }}
                title={`Set ${preset.label}`}
              />
            ))}
          </div>
        </div>

        {/* Border & Corner Radius */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Border (px)</label>
            <input
              type="number"
              value={styles.borderWidth || 0}
              onChange={(e) => handleStyleChange({ borderWidth: Number(e.target.value) })}
              className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
              min={0}
              max={10}
            />
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Radius (px)</label>
            <input
              type="number"
              value={styles.borderRadius !== undefined ? styles.borderRadius : 8}
              onChange={(e) => handleStyleChange({ borderRadius: Number(e.target.value) })}
              className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
              min={0}
              max={32}
            />
          </div>
        </div>
      </div>

      {/* 4. Navigation & Flow Action Link */}
      <div className="space-y-2.5 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          <Link className="w-3 h-3 text-indigo-400" />
          <span>Interactive Flow Link</span>
        </div>
        <p className="text-[11px] text-neutral-500">
          When clicked in prototype preview, navigate directly to:
        </p>

        <select
          value={element.actionTarget || ''}
          onChange={(e) => updateElementAction(screenId, element.id, e.target.value)}
          className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-indigo-300 font-medium focus:outline-none focus:border-indigo-500"
        >
          <option value="">(No navigation action)</option>
          {screens.map((sc) => (
            <option key={sc.id} value={sc.id}>
              → {sc.name} ({sc.id})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};
