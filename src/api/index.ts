import axios from 'axios';

export const getPlaceData = async (type: string, sw: { lat: number; lng: number }, ne: { lat: number; lng: number }) => {
    try {
        const { data: {data} } = await axios.get(`https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary`, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
            }
        });
        return data;
    } catch (error) {
        console.error('Error fetching place data:', error);
        throw new Error('Failed to fetch place data');
    }
}