import React, { useRef, useState } from 'react';
import { Check, Minus, Plus, RotateCcw, X } from 'lucide-react';

type Point = { x: number; y: number };
type ImageDimensions = { width: number; height: number };

type ImageCropModalProps = {
  imageSource: string;
  aspectWidth: number;
  aspectHeight: number;
  frameLabel: string;
  onCancel: () => void;
  onSave: (croppedImage: string) => void;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSource,
  aspectWidth,
  aspectHeight,
  frameLabel,
  onCancel,
  onSave,
}) => {
  const cropAreaRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; start: Point; origin: Point } | null>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  const getMetrics = (nextZoom = zoom) => {
    const area = cropAreaRef.current;
    if (!area || dimensions.width === 0 || dimensions.height === 0) return null;

    const boxWidth = area.clientWidth;
    const boxHeight = area.clientHeight;
    const baseScale = Math.max(boxWidth / dimensions.width, boxHeight / dimensions.height);
    const scale = baseScale * nextZoom;
    const renderedWidth = dimensions.width * scale;
    const renderedHeight = dimensions.height * scale;

    return {
      boxWidth,
      boxHeight,
      scale,
      renderedWidth,
      renderedHeight,
      maximumX: Math.max(0, (renderedWidth - boxWidth) / 2),
      maximumY: Math.max(0, (renderedHeight - boxHeight) / 2),
    };
  };

  const constrainOffset = (point: Point, nextZoom = zoom): Point => {
    const metrics = getMetrics(nextZoom);
    if (!metrics) return point;
    return {
      x: clamp(point.x, -metrics.maximumX, metrics.maximumX),
      y: clamp(point.y, -metrics.maximumY, metrics.maximumY),
    };
  };

  const updateZoom = (nextZoom: number) => {
    const safeZoom = clamp(nextZoom, 1, 3);
    setZoom(safeZoom);
    setOffset((current) => constrainOffset(current, safeZoom));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: offset,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setOffset(constrainOffset({
      x: drag.origin.x + event.clientX - drag.start.x,
      y: drag.origin.y + event.clientY - drag.start.y,
    }));
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const saveCrop = () => {
    const metrics = getMetrics();
    if (!metrics || dimensions.width === 0 || dimensions.height === 0) return;

    const sourceWidth = metrics.boxWidth / metrics.scale;
    const sourceHeight = metrics.boxHeight / metrics.scale;
    const sourceX = clamp(
      dimensions.width / 2 - offset.x / metrics.scale - sourceWidth / 2,
      0,
      dimensions.width - sourceWidth,
    );
    const sourceY = clamp(
      dimensions.height / 2 - offset.y / metrics.scale - sourceHeight / 2,
      0,
      dimensions.height - sourceHeight,
    );
    const aspectRatio = aspectWidth / aspectHeight;
    const canvas = document.createElement('canvas');

    if (aspectRatio >= 1) {
      canvas.width = 1400;
      canvas.height = Math.round(1400 / aspectRatio);
    } else {
      canvas.height = 1400;
      canvas.width = Math.round(1400 * aspectRatio);
    }

    const context = canvas.getContext('2d');
    if (!context) return;
    const sourceImage = new Image();
    sourceImage.onload = () => {
      context.drawImage(
        sourceImage,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      onSave(canvas.toDataURL('image/jpeg', 0.9));
    };
    sourceImage.src = imageSource;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="crop-title">
      <div className="flex max-h-[95dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-black/10 px-5 py-4">
          <div>
            <h2 id="crop-title" className="text-lg font-black text-black">Crop your photo</h2>
            <p className="mt-1 text-xs text-black/50">Drag and zoom to fit the {frameLabel} frame ratio.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close crop editor" className="grid h-9 w-9 place-items-center rounded-full border border-black/10 hover:bg-black hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f3f1ed] p-4 sm:p-7">
          <div
            ref={cropAreaRef}
            className="relative mx-auto max-h-[58vh] w-full max-w-[540px] touch-none cursor-grab overflow-hidden bg-black shadow-[0_20px_70px_rgba(0,0,0,0.25)] active:cursor-grabbing"
            style={{ aspectRatio: `${aspectWidth} / ${aspectHeight}` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
          >
            <img
              src={imageSource}
              alt="Photo being cropped"
              draggable={false}
              onLoad={(event) => setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover will-change-transform"
              style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})` }}
            />
            <div className="pointer-events-none absolute inset-0 border-[3px] border-white shadow-[inset_0_0_0_999px_rgba(0,0,0,0.06)]" />
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-45 [&>*]:border-white/70">
              {Array.from({ length: 9 }, (_, index) => <span key={index} className="border-b border-r last:border-r-0" />)}
            </div>
          </div>

          <div className="mx-auto mt-5 flex max-w-[540px] items-center gap-3 rounded-xl border border-black/10 bg-white p-3">
            <button type="button" aria-label="Zoom out" onClick={() => updateZoom(zoom - 0.1)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10"><Minus className="h-4 w-4" /></button>
            <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => updateZoom(Number(event.target.value))} className="w-full accent-black" aria-label="Crop zoom" />
            <button type="button" aria-label="Zoom in" onClick={() => updateZoom(zoom + 0.1)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10"><Plus className="h-4 w-4" /></button>
            <button type="button" aria-label="Reset crop" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10"><RotateCcw className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-black/10 p-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-lg border border-black/15 px-5 py-2.5 text-xs font-bold">Cancel</button>
          <button type="button" onClick={saveCrop} disabled={dimensions.width === 0} className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40">
            <Check className="h-4 w-4" /> Use cropped photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
