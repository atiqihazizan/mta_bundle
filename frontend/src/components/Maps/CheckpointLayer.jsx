import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';

export const CHECKPOINT_ICONS = {
  pin: '📍',
  flag: '🚩',
  mosque: '🕌',
  star: '⭐',
  water: '💧',
  food: '🍱',
  toilet: '🚻',
  medic: '⛑️',
  parking: '🅿️',
  crossing: '🚸',
  school: '🏫',
  start: '🟢',
  end: '🔴',
};

const makeIcon = (iconKey) => {
  const emoji = CHECKPOINT_ICONS[iconKey] || CHECKPOINT_ICONS.pin;

  return L.divIcon({
    className: '',
    html: `<div style="font-size:26px;line-height:26px;text-align:center;cursor:pointer">${emoji}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
};

export function injectCpLabelStyles() {
  if (document.getElementById('cp-label-styles')) return;
  const style = document.createElement('style');
  style.id = 'cp-label-styles';
  style.textContent = `
    .cp-tooltip {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
    }
    .cp-tooltip::before { display: none; }
    .cp-label {
      display: inline-block;
      font-weight: 800;
      font-size: 12px;
      line-height: 1.2;
      color: #1e293b;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.15);
      white-space: nowrap;
    }
    .cp-sublabel {
      font-weight: 600;
      font-size: 10px;
      opacity: 0.75;
    }
  `;
  document.head.appendChild(style);
}

export default function CheckpointLayer({ checkpoints = [], editable = false, onEdit, onDelete, onMove }) {
  injectCpLabelStyles();

  return checkpoints.map((cp) => (
    <Marker
      key={cp.id}
      position={[cp.lat, cp.lng]}
      icon={makeIcon(cp.icon)}
      draggable={editable}
      eventHandlers={
        editable
          ? {
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onMove?.(cp, lat, lng);
              },
            }
          : undefined
      }
      click={() => {}}
    >
      {/* Label kekal — background warna custom (default putih) */}
      <Tooltip permanent direction="right" offset={[10, -6]} className="cp-tooltip" opacity={1}>
        <div className="cp-label" style={{ backgroundColor: cp.label_color || '#ffffff' }}>
          {cp.name}
          {cp.label && (
            <>
              <br />
              <span className="cp-sublabel">{cp.label}</span>
            </>
          )}
        </div>
      </Tooltip>
      <Popup>
        <div className="min-w-[140px]">
          <strong>{cp.name}</strong>
          {cp.label && <div className="text-xs text-gray-600">{cp.label}</div>}
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-blue-500 px-2 py-0.5 text-xs text-white hover:bg-blue-600"
              onClick={(e) => {
                L.DomEvent.stopPropagation(e);
                onEdit?.(cp);
              }}
            >
              Edit
            </button>
            <button
              className="rounded bg-red-500 px-2 py-0.5 text-xs text-white hover:bg-red-600"
              onClick={(e) => {
                L.DomEvent.stopPropagation(e);
                onDelete?.(cp);
              }}
            >
              Padam
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  ));
}

CheckpointLayer.propTypes = {
  checkpoints: PropTypes.array,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onMove: PropTypes.func,
};