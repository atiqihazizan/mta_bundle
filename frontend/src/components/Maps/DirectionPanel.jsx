import {
  Button,
  Card,
  Typography,
} from "@material-tailwind/react";
import { ArrowPathIcon, MapIcon } from "@heroicons/react/24/outline";

export default function DirectionPanel({ route }) {
  const buildMapsUrl = (r) => {
    if (!r.coords || r.coords.length < 2) return "#";
    const origin = `${r.coords[0][0]},${r.coords[0][1]}`;
    const destination = `${r.coords[r.coords.length - 1][0]},${r.coords[r.coords.length - 1][1]}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
  };

  if (!route?.id) {
    return (
      <Card className="p-4 text-center shadow-md">
        <Typography variant="small" className="font-semibold text-blue-gray-700">
          Arah Navigasi
        </Typography>
        <Typography variant="small" color="gray" className="mt-1">
          Pilih route pada senarai untuk lihat arah
        </Typography>
      </Card>
    );
  }

  return (
    <Card className="w-[260px] p-3 shadow-xl">
      <div className="flex items-center gap-2">
        <MapIcon className="h-4 w-4 text-blue-600" />
        <Typography variant="small" className="flex-1 font-semibold text-blue-gray-800">
          {route.name}
        </Typography>
      </div>

      <div className="mt-2 border-t border-blue-gray-100 pt-2">
        <Typography variant="small" color="gray" className="text-xs">
          Jumlah: {route.distance_km ?? "0.00"} km · {route.coords?.length ?? 0} titik
        </Typography>
        <div className="mt-2 flex gap-2">
          <a href={buildMapsUrl(route)} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button color="blue" size="sm" className="w-full" disabled={!route.coords || route.coords.length < 2}>
              Google Maps
            </Button>
          </a>
          <Button
            color="gray"
            size="sm"
            variant="outlined"
            title="Muat semula"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
