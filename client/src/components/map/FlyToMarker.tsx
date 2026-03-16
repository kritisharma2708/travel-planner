import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface FlyToMarkerProps {
  lat: number;
  lng: number;
}

export default function FlyToMarker({ lat, lng }: FlyToMarkerProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 0.8 });

    // Open the popup for the marker at this location after flying
    const timeout = setTimeout(() => {
      map.eachLayer((layer) => {
        if ("getLatLng" in layer) {
          const marker = layer as L.Marker;
          const pos = marker.getLatLng();
          if (
            Math.abs(pos.lat - lat) < 0.0001 &&
            Math.abs(pos.lng - lng) < 0.0001
          ) {
            marker.openPopup();
          }
        }
      });
    }, 850);

    return () => clearTimeout(timeout);
  }, [lat, lng, map]);

  return null;
}
