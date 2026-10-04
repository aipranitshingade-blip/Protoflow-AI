import React, { useState, useRef } from 'react';
import { CanvasElement } from '../../types/prototype';
import { Link, Move } from 'lucide-react';

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onMove?: (deltaX: number, deltaY: number) => void;
  onDoubleClickEdit?: () => void;
}

export const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onMove,
}) => {
  const { styles } = element;
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = Math.round((moveEvent.clientX - dragStart.current.x) / 4) * 4;
      const dy = Math.round((moveEvent.clientY - dragStart.current.y) / 4) * 4;
      if ((dx !== 0 || dy !== 0) && onMove) {
        onMove(dx, dy);
        dragStart.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Convert element styles to inline style
  const inlineStyle: React.CSSProperties = {
    width: styles.width || '100%',
    height: styles.height || 'auto',
    padding: styles.padding || '0px',
    fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
    fontWeight: styles.fontWeight || '400',
    color: styles.color,
    backgroundColor: styles.backgroundColor,
    borderRadius: styles.borderRadius !== undefined ? `${styles.borderRadius}px` : undefined,
    borderColor: styles.borderColor,
    borderWidth: styles.borderWidth !== undefined ? `${styles.borderWidth}px` : undefined,
    borderStyle: styles.borderWidth ? 'solid' : undefined,
    textAlign: styles.textAlign || 'left',
    transform: `translate(${styles.x || 0}px, ${styles.y || 0}px)`,
    transition: 'transform 0.05s ease',
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={handleMouseDown}
      className={`group relative cursor-pointer transition-shadow ${
        isSelected
          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-neutral-900 z-20'
          : 'hover:ring-1 hover:ring-indigo-400/50'
      }`}
      style={inlineStyle}
    >
      {/* Selected Element Label Pill */}
      {isSelected && (
        <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-600 text-[10px] text-white font-medium select-none pointer-events-none shadow-sm z-30">
          <Move className="w-2.5 h-2.5" />
          <span>{element.name}</span>
          {element.actionTarget && (
            <span className="flex items-center gap-0.5 text-indigo-200 bg-indigo-700/60 px-1 rounded text-[9px]">
              <Link className="w-2 h-2" />
              <span>→ {element.actionTarget}</span>
            </span>
          )}
        </div>
      )}

      {/* Resize corner indicators when selected */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-indigo-600 rounded-sm pointer-events-none z-30" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-indigo-600 rounded-sm pointer-events-none z-30" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-indigo-600 rounded-sm pointer-events-none z-30" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-indigo-600 rounded-sm pointer-events-none z-30" />
        </>
      )}

      {/* Render element content */}
      <div className="select-none pointer-events-none">
        <div className="leading-snug">{element.content}</div>
        {element.secondaryContent && (
          <div className="text-[12px] opacity-75 mt-1 font-normal leading-relaxed">
            {element.secondaryContent}
          </div>
        )}
      </div>

      {/* Flow link badge indicator if not selected but has target */}
      {!isSelected && element.actionTarget && (
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 text-neutral-300 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Link className="w-2.5 h-2.5 text-indigo-400" />
          <span>→ {element.actionTarget}</span>
        </div>
      )}
    </div>
  );
};
