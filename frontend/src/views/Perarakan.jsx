import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  IconButton,
  Input,
  Spinner,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { PencilIcon, PlusIcon, PrinterIcon, TrashIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import Modal from "../components/Modal";
import PerarakanMap from "../components/Maps/PerarakanMap";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";
import { printRoute } from "../utils/printPerarakan";

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

  return (
    <PageComponent title="Route Perarakan">
      <div className="flex h-[calc(100vh-100px)] gap-4 p-4">
        <div className="flex h-full w-1/3 flex-col overflow-hidden rounded-lg bg-white p-4 shadow">
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h6" color="blue-gray">
              Route Perarakan
            </Typography>
            <Button
              color="blue"
              size="sm"
              className="flex items-center gap-1"
              disabled={drawMode}
              onClick={startDraw}
            >
              <PlusIcon className="h-4 w-4" />
              Tambah Route
            </Button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner color="blue" />
              </div>
            ) : routes.length === 0 ? (
              <Typography color="gray" className="py-10 text-center">
                Tiada route perarakan
              </Typography>
            ) : (
              routes.map((route) => (
                <Card
                  key={route.id}
                  className="cursor-pointer p-3 transition-shadow hover:shadow-lg"
                  onMouseEnter={() => setActiveRoute(route)}
                  onMouseLeave={() => setActiveRoute(null)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <Typography variant="h6" className="truncate">
                        {route.name}
                      </Typography>
                      <Typography variant="small" color="gray">
                        Jarak: {route.distance_km ?? "0.00"} km
                      </Typography>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Switch
                        checked={route.visible}
                        color="green"
                        onChange={() => toggleVisible(route)}
                      />
                      <IconButton
                        variant="text"
                        size="sm"
                        color="blue-gray"
                        title="Cetak Route"
                        onClick={() => printRoute(route)}
                      >
                        <PrinterIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        variant="text"
                        size="sm"
                        disabled={drawMode}
                        onClick={() => editRoute(route)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        variant="text"
                        size="sm"
                        color="red"
                        disabled={drawMode}
                        onClick={() => deleteRoute(route)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="relative h-full w-2/3 overflow-hidden rounded-lg bg-white shadow">
          <PerarakanMap
            routes={routes}
            drawMode={drawMode}
            activeRoute={activeRoute}
            onRouteComplete={handleRouteComplete}
            initialWaypoints={editingRoute?.coords ?? []}
          />

          {drawMode && (
            <div className="absolute bottom-4 left-1/2 z-[1000] w-[420px] max-w-[90%] -translate-x-1/2 rounded-lg bg-white p-4 shadow-xl">
              <Typography variant="small" color="blue-gray" className="text-center">
                Klik pada peta untuk tambah waypoint
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
                <Button
                  color="green"
                  size="sm"
                  className="flex-1"
                  disabled={pendingCoords.length < 2}
                  onClick={() => setShowForm(true)}
                >
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