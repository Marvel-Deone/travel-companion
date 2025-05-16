import { Paper, Rating, Typography, useMediaQuery } from "@mui/material";
import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { debounce } from "lodash";
import React, { useRef } from "react";
import mapStlyes from "./mapStyles";

interface MapProps {
  setCoordinates: (coords: { lat: number; lng: number }) => void;
  setBounds: (bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } }) => void;
  coordinates: { lat: number; lng: number };
  bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | null;
  places?: any[];
  setChildClicked: (i: number) => void;
}

const Map: React.FC<MapProps> = ({ setCoordinates, setBounds, coordinates, places, setChildClicked }) => {
  const isDesktop = useMediaQuery("(min-width: 600px)");
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastBoundsRef = useRef<{ ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | null>(null);
  const setBoundsDebounced = debounce((b) => setBounds(b), 500, { leading: true });

  const containerStyle = {
    width: "100%",
    height: "55vh",
  };

  const round = (num: number) => Number(num.toFixed(5));

  const DELTA = 0.002;

  const close = (a: number, b: number) => Math.abs(a - b) < DELTA;

  const coordsEqual = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    return round(a.lat) === round(b.lat) && round(a.lng) === round(b.lng);
  };

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

  const onChildClick = (i: number) => {
    setChildClicked(i);
  }

  return (
    <div className="h-[55vh] w-full mt-[4.2rem]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={14}
        onLoad={onLoad}
        onIdle={onIdle}
         options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: mapStlyes,
                }}
      >
        {Array.isArray(places) && places?.map((place, i) => (
          <Marker
            key={i}
            position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
          >
            {isDesktop && (
              <OverlayView
                position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <Paper elevation={3} sx={{ zIndex: 0 }} className="p-2.5 flex flex-col relative z-0 justify-center w-[100px] shrink transition-all duration-300 ease-in-out transform hover:scale-[1.1] hover:z-[1000] hover:shadow-xl">
                  <Typography variant="subtitle2" gutterBottom>
                    {place.name}
                  </Typography>
                  <img
                    className="cursor-pointer h-[70px]"
                    src={place.photo ? place.photo.images.large.url : 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0'}
                    alt={place.name}
                    onClick={() => onChildClick(i)}
                  />
                  <Rating size="small" value={Number(place.rating)} readOnly />
                </Paper>
              </OverlayView>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
};

// export default Map;

export default React.memo(Map);
