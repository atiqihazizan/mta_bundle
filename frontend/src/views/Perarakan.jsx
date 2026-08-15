import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  IconButton,
  Input,
  Spinner,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { CheckIcon, MapPinIcon, PencilIcon, PlusIcon, PrinterIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import Modal from "../components/Modal";
import PerarakanMap from "../components/Maps/PerarakanMap";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";
import { printRoute } from "../utils/printPerarakan";

const buildMapsUrl = (route) => {
  const coords = route.coords;
  if (!coords || coords.length < 2) return '#';
  const origin = `${coords[0][0]},${coords[0][1]}`;
  const destination = `${coords[coords.length - 1][0]},${coords[coords.length - 1][1]}`;
  const middle = coords.slice(1, -1);
  const step = Math.max(1, Math.floor(middle.length / 8));
  const sampled = middle.filter((_, i) => i % step === 0).slice(0, 8);
  const waypointsParam = sampled.length
    ? `&waypoints=${sampled.map((c) => `${c[0]},${c[1]}`).join('|')}`
    : '';
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=walking`;
};

export default function Perarakan() {
  const { showToast } = useStateContext();

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawMode, setDrawMode] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newRouteName, setNewRouteName] = useState("");
  const [pendingCoords, setPendingCoords] = useState([]);
  const [pendingDistance, setPendingDistance] = useState(0);
  const [editingRoute, setEditingRoute] = useState(null);
  const [saving, setSaving] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef(null);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/perarakan');
      setRoutes(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const handleRouteComplete = useCallback((coords, distance) => {
    setPendingCoords(coords);
    setPendingDistance(distance);
  }, []);

  const startDraw = () => {
    setEditingRoute(null);
    setNewRouteName("");
    setActiveRoute(null);
    setDrawMode(true);
  };

  const cancelDraw = () => {
    setDrawMode(false);
    setEditingRoute(null);
    setPendingCoords([]);
    setPendingDistance(0);
  };

  const editRoute = (route) => {
    setEditingRoute(route);
    setActiveRoute(route);
    setNewRouteName(route.name);
    setPendingCoords(route.coords ?? []);
    setPendingDistance(route.distance ?? 0);
    setDrawMode(true);
  };

  const saveRoute = async () => {
    if (!newRouteName.trim() || pendingCoords.length < 2) return;
    setSaving(true);
    try {
      const payload = {
        name: newRouteName.trim(),
        visible: editingRoute ? editingRoute.visible : true,
        coords: pendingCoords,
        distance: pendingDistance,
      };

      if (editingRoute) {
        await axiosClient.put(`/perarakan/${editingRoute.id}`, payload);
        showToast("Route perarakan dikemaskini");
      } else {
        await axiosClient.post('/perarakan', payload);
        showToast("Route perarakan disimpan");
      }

      setShowForm(false);
      setNewRouteName("");
      setEditingRoute(null);
      setDrawMode(false);
      setPendingCoords([]);
      setPendingDistance(0);
      fetchRoutes();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const startRename = (e, route) => {
    e.stopPropagation();
    setRenamingId(route.id);
    setRenameValue(route.name);
  };

  const saveRename = async (route) => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === route.name) {
      setRenamingId(null);
      return;
    }
    try {
      await axiosClient.put(`/perarakan/${route.id}`, {
        name: trimmed,
        visible: route.visible,
        coords: route.coords,
        distance: route.distance,
      });
      showToast("Nama route dikemaskini");
      setRenamingId(null);
      fetchRoutes();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVisible = async (route) => {
    try {
      await axiosClient.put(`/perarakan/${route.id}`, {
        name: route.name,
        visible: !route.visible,
        coords: route.coords,
        distance: route.distance,
      });
      showToast(`Route '${route.name}' ${!route.visible ? "dipaparkan" : "disembunyikan"}`);
      fetchRoutes();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRoute = async (route) => {
    if (!window.confirm(`Anda pasti hendak padam route '${route.name}'?`)) return;
    try {
      await axiosClient.delete(`/perarakan/${route.id}`);
      if (activeRoute?.id === route.id) setActiveRoute(null);
      showToast("Route perarakan dipadam");
      fetchRoutes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardClick = (route) => {
    if (drawMode || renamingId) return;
    setActiveRoute((prev) => prev?.id === route.id ? null : route);
  };

  return (
    <PageComponent title="Route Perarakan">
      <div className="flex h-[calc(100vh-100px)] gap-3 p-3">

        {/* Panel kiri — senarai route (kecil) */}
        <div className="flex h-full w-52 shrink-0 flex-col overflow-hidden rounded-lg bg-white p-3 shadow">
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="small" className="font-semibold text-blue-gray-700">
              Route
            </Typography>
            <IconButton
              color="blue"
              size="sm"
              title="Tambah Route"
              disabled={drawMode}
              onClick={startDraw}
            >
              <PlusIcon className="h-4 w-4" />
            </IconButton>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner color="blue" />
              </div>
            ) : routes.length === 0 ? (
              <Typography variant="small" color="gray" className="py-10 text-center">
                Tiada route
              </Typography>
            ) : (
              routes.map((route) => {
                const isActive = activeRoute?.id === route.id;
                return (
                  <Card
                    key={route.id}
                    className={`cursor-pointer p-2 transition-all ${
                      isActive
                        ? "border border-blue-400 bg-blue-50 shadow-md"
                        : "border border-transparent hover:border-blue-gray-100 hover:shadow-sm"
                    }`}
                    onClick={() => handleCardClick(route)}
                  >
                    {/* Nama route — inline rename */}
                    {renamingId === route.id ? (
                      <div className="mb-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={renameInputRef}
                          className="w-full rounded border border-blue-300 px-1.5 py-0.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(route);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          onBlur={() => saveRename(route)}
                        />
                        <button onClick={() => saveRename(route)} className="text-green-600 hover:text-green-800">
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => setRenamingId(null)} className="text-red-400 hover:text-red-600">
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="mb-0.5 flex items-center gap-1">
                        <span className="flex-1 truncate text-sm font-semibold text-blue-gray-800">
                          {route.name}
                        </span>
                        <button
                          className="shrink-0 text-blue-gray-300 hover:text-blue-gray-600"
                          title="Rename"
                          onClick={(e) => startRename(e, route)}
                        >
                          <PencilIcon className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <Typography variant="small" color="gray" className="text-xs">
                      {route.distance_km ?? "0.00"} km
                    </Typography>

                    {/* Action bar */}
                    <div className="mt-1.5 flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={route.visible}
                        color="green"
                        onChange={() => toggleVisible(route)}
                        className="scale-75"
                      />
                      <div className="ml-auto flex items-center">
                        <a
                          href={buildMapsUrl(route)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Navigate di Google Maps"
                          className="inline-flex h-7 w-7 items-center justify-center rounded text-green-600 hover:bg-green-50"
                        >
                          <MapPinIcon className="h-3.5 w-3.5" />
                        </a>
                        <IconButton variant="text" size="sm" color="blue-gray" title="Cetak" onClick={() => printRoute(route)}>
                          <PrinterIcon className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton variant="text" size="sm" disabled={drawMode} onClick={() => editRoute(route)}>
                          <PencilIcon className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton variant="text" size="sm" color="red" disabled={drawMode} onClick={() => deleteRoute(route)}>
                          <TrashIcon className="h-3.5 w-3.5" />
                        </IconButton>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Peta — lebar penuh baki */}
        <div className="relative h-full flex-1 overflow-hidden rounded-lg bg-white shadow">
          <PerarakanMap
            routes={routes}
            drawMode={drawMode}
            activeRoute={activeRoute}
            onRouteComplete={handleRouteComplete}
            onRouteClick={(route) => setActiveRoute((prev) => prev?.id === route.id ? null : route)}
            initialWaypoints={editingRoute?.coords ?? []}
            editingRouteId={editingRoute?.id ?? null}
          />

          {drawMode && (
            <div className="absolute bottom-4 left-1/2 z-[1000] w-[420px] max-w-[90%] -translate-x-1/2 rounded-lg bg-white p-4 shadow-xl">
              <Typography variant="small" color="blue-gray" className="text-center">
                {editingRoute
                  ? "Drag waypoint untuk ubah posisi. Klik kanan vertex untuk padam."
                  : "Klik pada peta untuk tambah waypoint"}
              </Typography>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Jarak semasa:{" "}
                  <strong className="text-gray-900">
                    {(pendingDistance / 1000).toFixed(2)} km
                  </strong>
                </span>
                <span className="text-gray-600">
                  Waypoint: <strong className="text-gray-900">{pendingCoords.length} titik</strong>
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button color="green" size="sm" className="flex-1" disabled={pendingCoords.length < 2} onClick={() => setShowForm(true)}>
                  Simpan Route
                </Button>
                <Button color="red" size="sm" className="flex-1" onClick={cancelDraw}>
                  Batal
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showForm}
        onClose={() => setShowForm(false)}
        title={editingRoute ? "Kemaskini Route Perarakan" : "Simpan Route Perarakan"}
      >
        <div>
          <Input
            label="Nama Route"
            value={newRouteName}
            onChange={(e) => setNewRouteName(e.target.value)}
          />
          <Typography variant="small" color="gray" className="mt-2">
            Jarak: {(pendingDistance / 1000).toFixed(2)} km · {pendingCoords.length} titik
          </Typography>
          <div className="mt-4 flex justify-end gap-2">
            <Button color="red" size="sm" onClick={() => setShowForm(false)}>
              Batal
            </Button>
            <Button
              color="green"
              size="sm"
              disabled={!newRouteName.trim() || pendingCoords.length < 2 || saving}
              onClick={saveRoute}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageComponent>
  );
}
