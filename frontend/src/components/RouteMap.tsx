// src/components/RouteMap.tsx
import React, { useEffect, useRef } from "react";
import { loadGoogleMaps } from "./loadGoogleMaps";
const GOOGLE_MAPS_API_KEY = "AIzaSyAe3LyRvX8fPEDuu7l_c-6kE88yEg37QTE";

interface RouteMapProps {
  addresses: string[];
}

const RouteMap: React.FC<RouteMapProps> = ({ addresses }) => {
  const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (addresses.length < 2 || !mapRef.current) return;
    
      loadGoogleMaps(GOOGLE_MAPS_API_KEY).then(() => {
        const map = new google.maps.Map(mapRef.current!, {
          zoom: 6,
          center: { lat: 39.5, lng: -98.35 },
        });
    
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
    
        const origin = addresses[0];
        const destination = addresses[addresses.length - 1];
        const waypoints = addresses.slice(1, -1).map((address) => ({
          location: address,
          stopover: true,
        }));
    
        directionsService.route(
          {
            origin,
            destination,
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false,
          },
          (result, status) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result);
            } else {
              console.error("Directions request failed:", status);
            }
          }
        );
      });
    }, [addresses]);
    

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden" }}
    />
  );
};

export default RouteMap;
