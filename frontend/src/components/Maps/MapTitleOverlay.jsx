import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, IconButton, Slider, Typography } from "@material-tailwind/react";
import { Cog6ToothIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PropTypes from 'prop-types';

export default function MapTitleOverlay({ title, onChange, onSave, controlsOpen = false, onCloseControls, onHide }) {
  const [editing, setEditing] = useState(false);
  const draggingRef = useRef(null);
  const containerRef = useRef(null);
  const saveTimeout = useRef(null);

  const debouncedSave = useCallback((data) => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => onSave?.(data), 600);
  }, [onSave]);

  useEffect(() => () => clearTimeout(saveTimeout.current), []);

  const startDrag = (e) => {
    if (editing) return;
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - (title.x / 100) * rect.width;
    const offsetY = e.clientY - rect.top - (title.y / 100) * rect.height;
    draggingRef.current = { rect, offsetX, offsetY };

    const onMove = (ev) => {
      const d = draggingRef.current;
      if (!d) return;
      let x = ((ev.clientX - d.rect.left - d.offsetX) / d.rect.width) * 100;
      let y = ((ev.clientY - d.rect.top - d.offsetY) / d.rect.height) * 100;
      x = Math.min(98, Math.max(0, x));
      y = Math.min(95, Math.max(0, y));
      const next = { ...title, x: +x.toFixed(2), y: +y.toFixed(2) };
      onChange?.(next);
      debouncedSave(next);
    };
    const onUp = () => {
      draggingRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!title || !title.visible) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 z-[1100]"
        style={{ cursor: draggingRef.current ? 'grabbing' : 'default' }}
        onMouseDown={startDrag}
      >
        <div
          className="pointer-events-auto absolute select-none rounded px-3 py-1.5 text-center font-extrabold leading-tight shadow-lg transition-shadow hover:shadow-2xl"
          style={{
            left: `${title.x}%`,
            top: `${title.y}%`,
            fontSize: `${title.font_size}px`,
            color: title.color,
            backgroundColor: title.bg_color,
            border: '2px solid rgba(0,0,0,0.25)',
            cursor: editing ? 'text' : 'grab',
            maxWidth: '90%',
            whiteSpace: 'pre-wrap',
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
            onCloseControls ? onCloseControls() : null;
          }}
        >
          {editing ? (
            <textarea
              autoFocus
              value={title.text}
              onChange={(e) => {
                const next = { ...title, text: e.target.value };
                onChange?.(next);
                debouncedSave(next);
              }}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditing(false);
                e.stopPropagation();
              }}
              className="resize border-none bg-transparent outline-none"
              style={{ color: title.color, fontSize: `${title.font_size}px` }}
              rows={Math.min(4, title.text.split('\n').length)}
            />
          ) : (
            title.text.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))
          )}
        </div>
      </div>

      {/* Panel kawalan */}
      {controlsOpen && (
        <div
          className="absolute right-2 top-16 z-[1200] w-56 space-y-2 rounded-lg bg-white p-3 shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <Typography variant="small" className="font-semibold text-blue-gray-800">
              Tetapan Title
            </Typography>
            <IconButton size="sm" variant="text" onClick={onCloseControls}>
              <XMarkIcon className="h-4 w-4" />
            </IconButton>
          </div>

          <div>
            <Typography variant="small" color="gray">
              Saiz font: {title.font_size}px
            </Typography>
            <Slider
              value={title.font_size}
              min={8}
              max={72}
              onChange={(e) => {
                const next = { ...title, font_size: Number(e.target.value) };
                onChange?.(next);
                debouncedSave(next);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex flex-1 items-center gap-1 text-xs text-blue-gray-700">
              Teks
              <input
                type="color"
                value={title.color}
                onChange={(e) => {
                  const next = { ...title, color: e.target.value };
                  onChange?.(next);
                  debouncedSave(next);
                }}
                className="h-7 w-full cursor-pointer rounded border border-blue-gray-200"
              />
            </label>
            <label className="flex flex-1 items-center gap-1 text-xs text-blue-gray-700">
              Latar
              <input
                type="color"
                value={title.bg_color}
                onChange={(e) => {
                  const next = { ...title, bg_color: e.target.value };
                  onChange?.(next);
                  debouncedSave(next);
                }}
                className="h-7 w-full cursor-pointer rounded border border-blue-gray-200"
              />
            </label>
          </div>

          <Button
            size="sm"
            variant="outlined"
            color="red"
            className="w-full flex items-center justify-center gap-1"
            onClick={() => {
              onHide?.();
            }}
          >
            <EyeSlashIcon className="h-4 w-4" /> Sembunyi Title
          </Button>

          <Typography variant="small" color="gray" className="text-center text-[10px]">
            Drag untuk alih · Klik 2× untuk ubah teks
          </Typography>
        </div>
      )}
    </>
  );
}

MapTitleOverlay.propTypes = {
  title: PropTypes.shape({
    text: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    font_size: PropTypes.number,
    color: PropTypes.string,
    bg_color: PropTypes.string,
    visible: PropTypes.bool,
  }),
  onChange: PropTypes.func,
  onSave: PropTypes.func,
  controlsOpen: PropTypes.bool,
  onCloseControls: PropTypes.func,
  onHide: PropTypes.func,
};

export function MapTitleToggle({ onClick, active }) {
  return (
    <IconButton
      color={active ? "amber" : "blue-gray"}
      size="sm"
      variant={active ? "filled" : "outlined"}
      title="Tetapan title peta"
      onClick={onClick}
    >
      <Cog6ToothIcon className="h-4 w-4" />
    </IconButton>
  );
}