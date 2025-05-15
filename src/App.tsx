import { LoadScript } from '@react-google-maps/api';
import './App.css';
import Header from './components/Header';
import Grid from '@mui/joy/Grid';
import Map from './components/Map/Map';
import List from './components/List';
import { useEffect, useRef, useState } from 'react';
import { debounce, set } from 'lodash';
import { getPlaceData } from './api';

function App() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 12.838442, lng: 109.095887 });
  const [bounds, setBounds] = useState<{ ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>('restaurants');
  const [rating, setRating] = useState<string>('');
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const fetchPlacesDebounced = useRef(
    debounce((type, sw, ne) => {
      console.log("Calling API with:", type, sw, ne);
      console.log('Hits me');

      getPlaceData(type, sw, ne)
        .then((data) => {
          console.log("Fetched places:", data);
          setPlaces(data);
        })
        .catch((error) => {
          console.error("Error fetching places:", error);
        })
        .finally(() => {
          console.log('Hi');
          setIsLoading(false);
        });
    }, 500)
  ).current;

  useEffect(() => {
    console.log('Bounds changed:', bounds);
    if (bounds?.sw && bounds?.ne) {
      setIsLoading(true); // ✅ trigger before debounce kicks in
      fetchPlacesDebounced(type, bounds.sw, bounds.ne);
    }
  }, [type, bounds]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLEMAP_API_KEY} libraries={['places']}>
      <Header />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid xs={12} md={4}>
          <List
            isLoading={isLoading}
            places={places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid xs={12} md={8}>
          <Map
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            bounds={bounds}
            setBounds={setBounds}
          />
        </Grid>
      </Grid>
    </LoadScript>
  );
}

export default App;
