import { useMediaQuery } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { debounce } from "lodash";
import React, { useRef } from "react";

interface MapProps {
  setCoordinates: (coords: { lat: number; lng: number }) => void;
  setBounds: (bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } }) => void;
  coordinates: { lat: number; lng: number };
  bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | null;
}

const Map: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates, bounds }) => {
  const isDesktop = useMediaQuery("(min-width: 600px)");
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastBoundsRef = useRef<{ ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | null>(null);
  const setBoundsDebounced = debounce((b) => setBounds(b), 500, { leading: true });

  const containerStyle = {
    width: "100%",
    height: "55vh",
  };

  const round = (num: number) => Number(num.toFixed(5));

  const DELTA = 0.002;      // ~200m of wiggle room

  const close = (a: number, b: number) => Math.abs(a - b) < DELTA;

  const coordsEqual = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    return round(a.lat) === round(b.lat) && round(a.lng) === round(b.lng);
  };

  // const boundsEqual = (
  //   b1: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } },
  //   b2: typeof b1 | null
  // ) => {
  //   if (!b2) return false;
  //   return coordsEqual(b1.ne, b2.ne) && coordsEqual(b1.sw, b2.sw);
  // };

  const boundsEqual = (b1: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } }, b2: typeof b1 | null) => {
    if (!b2) return false;
    return (
      close(b1.ne.lat, b2.ne.lat) &&
      close(b1.ne.lng, b2.ne.lng) &&
      close(b1.sw.lat, b2.sw.lat) &&
      close(b1.sw.lng, b2.sw.lng)
    );
  };

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // const onIdle = () => {
  //   if (mapRef.current) {
  //     const newCenter = mapRef.current.getCenter();
  //     const newBounds = mapRef.current.getBounds();

  //     if (newCenter && newBounds) {
  //       const newCoords = {
  //         lat: round(newCenter.lat()),
  //         lng: round(newCenter.lng()),
  //       };

  //       const formattedBounds = {
  //         ne: {
  //           lat: round(newBounds.getNorthEast().lat()),
  //           lng: round(newBounds.getNorthEast().lng()),
  //         },
  //         sw: {
  //           lat: round(newBounds.getSouthWest().lat()),
  //           lng: round(newBounds.getSouthWest().lng()),
  //         },
  //       };

  //       if (!coordsEqual(newCoords, coordinates)) {
  //         setCoordinates(newCoords);
  //       }

  //       if (!boundsEqual(formattedBounds, lastBoundsRef.current)) {
  //         console.log("Fetching places with bounds:", formattedBounds);
  //         console.log("Last bounds:", lastBoundsRef.current);
  //         console.log("Current bounds:", bounds);
  //         lastBoundsRef.current = formattedBounds;
  //         setBoundsDebounced(formattedBounds);
  //         // setBounds(formattedBounds);
  //       }
  //     }
  //   }
  // };
  const onIdle = () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    const mb = mapRef.current.getBounds();
    if (!center || !mb) return;

    const newCoords = {
      lat: round(center.lat()),
      lng: round(center.lng()),
    };

    const formattedBounds = {
      ne: { lat: round(mb.getNorthEast().lat()), lng: round(mb.getNorthEast().lng()) },
      sw: { lat: round(mb.getSouthWest().lat()), lng: round(mb.getSouthWest().lng()) },
    };

    if (!coordsEqual(newCoords, coordinates)) {
      setCoordinates(newCoords);
    }

    if (!boundsEqual(formattedBounds, lastBoundsRef.current)) {
      lastBoundsRef.current = formattedBounds;
      setBoundsDebounced(formattedBounds);
    }
  };

  return (
    <div className="h-[55vh] w-full mt-[4.2rem]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={14}
        onLoad={onLoad}
        onIdle={onIdle}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </div>
  );
};

// export default Map;

export default React.memo(Map);
