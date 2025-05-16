import Grid from "@mui/joy/Grid";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import PlaceDetails from "./PlaceDetails";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import noDataImage from '../assets/images/no-data.svg'; // adjust the path based on your component location


interface ListProps {
  isLoading: boolean;
  places: any[];
  type: string;
  setType: (value: string) => void;
  rating: string;
  setRating: (value: string) => void;
  childClicked: number | null;
};

const setRefs = (...refs: any[]) => (node: HTMLDivElement | null) => {
  refs.forEach(ref => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  })
}

const List: React.FC<ListProps> = ({ isLoading, places, type, setType, rating, setRating, childClicked }) => {
  const [elRefs, setElRefs] = useState([]);
  console.log('childClicked:', childClicked);

  useEffect(() => {
    setElRefs((refs) => Array(places?.length).fill(null).map((_, i) => refs[i] || createRef()))
  }, [places]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visiblePlaces, setVisiblePlaces] = useState<number>(10);

  const lastPlaceRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisiblePlaces(prev => Math.min(prev + 10, entries.length));
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, places.length]);

  return (
    <div className="mt-[4.2rem] p-[25px]">
      <Typography variant="h4" fontSize={20} marginBottom={4}>Returants, Hotels & Attractions around you</Typography>
      <>
        <FormControl sx={{ marginBottom: '20px' }} className="w-full">
          <InputLabel id="type-label">Type</InputLabel>
          <Select name="type" value={type} onChange={(e) => setType(e.target.value)} label="Type" labelId="type-label">
            <MenuItem value="restaurants">Restaurants</MenuItem>
            <MenuItem value="hotels">Hotels</MenuItem>
            <MenuItem value="attractions">Attractions</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="w-full">
          <InputLabel id="demo-select-small-label">Rating</InputLabel>
          <Select value={rating} onChange={(e) => setRating(e.target.value)} labelId="demo-select-small-label" label="Rating">
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={3}>Above 3.0</MenuItem>
            <MenuItem value={4}>Above 4.0</MenuItem>
            <MenuItem value={4.5}>Above 5.0</MenuItem>
          </Select>
        </FormControl>
        {isLoading ? (
          <div className="flex justify-center mt-4">
            <CircularProgress size="30px" />
          </div>
        ) : (
          <Grid container spacing={3} className="h-[75vh] overflow-auto" sx={{ marginTop: '20px' }}>
            {Array.isArray(places) && places.length > 0 ? (
              places.slice(0, visiblePlaces).map((place, i) => {
                const scrollRef = elRefs[i];
                const isLastVisible = i === visiblePlaces - 1;
                const comninedRef = isLastVisible ? setRefs(scrollRef, lastPlaceRef) : setRefs(scrollRef);
                return (
                  <Grid ref={comninedRef} key={i} xs={12}>
                    <PlaceDetails
                      place={place}
                      selected={childClicked === i}
                      refProp={scrollRef}
                    />
                  </Grid>
                )
              }
              )) : (
              <div className="flex mx-auto">
                <img src={noDataImage} alt="No place found" className="w-[200px]" />
              </div>
            )}
          </Grid>
        )}
      </>


    </div>
  )
}

export default List
