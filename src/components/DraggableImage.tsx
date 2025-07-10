import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { ImageElement } from '../types';
import { Move, RotateCw, Trash2, Image } from 'lucide-react';

interface DraggableImageProps {
  element: ImageElement;
  onUpdate: (element: ImageElement) => void;
  onSelect: (element: ImageElement) => void;
  onDelete?: (elementId: string) => void;
  isSelected: boolean;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  element,
  onUpdate,
  onSelect,
  onDelete,
  isSelected,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    onSelect(element);
  };

  const handleDragStop = (e: any, data: any) => {
    setIsDragging(false);
    onUpdate({
      ...element,
      x: Math.max(0, data.x),
      y: Math.max(0, data.y),
    });
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    onSelect(element);
  };

  const handleResizeStop = (e: any, direction: any, ref: any, delta: any, position: any) => {
    setIsResizing(false);
    onUpdate({
      ...element,
      width: Math.max(20, parseInt(ref.style.width) || element.width),
      height: Math.max(20, parseInt(ref.style.height) || element.height),
      x: Math.max(0, position.x),
      y: Math.max(0, position.y),
    });
  };

  const imageStyle = {
    opacity: element.opacity || 1,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <Rnd
      size={{
        width: element.width,
        height: element.height,
      }}
      position={{
        x: element.x,
        y: element.y,
      }}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      bounds="parent"
      minWidth={20}
      minHeight={20}
      maxWidth={400}
      maxHeight={400}
      dragHandleClassName="drag-handle"
      className={`${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} ${
        isDragging || isResizing ? 'z-50' : 'z-10'
      } transition-all duration-200`}
      onClick={() => onSelect(element)}
      enableResizing={{
        top: isSelected,
        right: isSelected,
        bottom: isSelected,
        left: isSelected,
        topRight: isSelected,
        bottomRight: isSelected,
        bottomLeft: isSelected,
        topLeft: isSelected,
      }}
      resizeHandleStyles={{
        topRight: { background: '#3b82f6', width: '12px', height: '12px', borderRadius: '50%' },
        bottomRight: { background: '#3b82f6', width: '12px', height: '12px', borderRadius: '50%' },
        bottomLeft: { background: '#3b82f6', width: '12px', height: '12px', borderRadius: '50%' },
        topLeft: { background: '#3b82f6', width: '12px', height: '12px', borderRadius: '50%' },
        top: { background: '#3b82f6', height: '4px' },
        right: { background: '#3b82f6', width: '4px' },
        bottom: { background: '#3b82f6', height: '4px' },
        left: { background: '#3b82f6', width: '4px' },
      }}
    >
      <div
        className="drag-handle w-full h-full relative group"
        style={imageStyle}
      >
        <img
          src={element.src}
          alt={element.type}
          className="w-full h-full object-contain"
          draggable={false}
        />
        
        {/* Selection indicators */}
        {isSelected && (
          <>
            <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium opacity-90 flex items-center gap-1">
              <Image className="w-3 h-3" />
              {element.type}
            </div>
            
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete(element.id);
                }}
                className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Delete element"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </>
        )}

        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full opacity-75">
            <Move className="w-4 h-4" />
          </div>
        )}

        {/* Resize indicator */}
        {isResizing && (
          <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-tl text-xs">
            {element.width} × {element.height}
          </div>
        )}
      </div>
    </Rnd>
  );
};

export default DraggableImage;