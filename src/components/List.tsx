import Grid from "@mui/joy/Grid";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

interface ListProps {
  isLoading: Boolean;
  places: any[];
  type: string;
  setType: (value: string) => void;
  rating: string;
  setRating: (value: string) => void;
};

const List: React.FC<ListProps> = ({ isLoading, places, type, setType, rating, setRating }) => {
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
        {/*  Array.isArray(places) && places.length > 0 ? (
          places.map((place, i) => ( */}
        {isLoading ? (
          <div className="flex justify-center mt-4">
            <CircularProgress size="30px" />
          </div>
        ) : (
          <Grid container spacing={3} className="h-[75vh] overflow-auto" sx={{ marginTop: '20px' }}>
            {Array.isArray(places) && places.length > 0 ? (
              places.map((place, i) => (
                <Grid key={i} xs={12}>
                  <h2>{place.name}</h2>
                  <p>{place.description}</p>
                </Grid>
              )
              )) : (
              <h1>No places found</h1>
            )}
          </Grid>
        )}
        {/* Render place details here */}
      </>


    </div>
  )
}

export default List
