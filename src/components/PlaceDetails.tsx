import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Rating, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

interface PlaceDetailsProps {
    place: any;
    selected: boolean;
    refProp: React.RefObject<any>;
};

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place, selected, refProp }) => {
    console.log('selected:', selected, refProp);
    if (selected) {
        refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return (
        <Card elevation={6}>
            <CardMedia
                style={{ height: 350 }}
                image={place.photo ? place.photo.images.large.url : 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0'}
                title={place.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" className="!text-[16px] md:text-[18px]">{place.name}</Typography>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" gutterBottom className="!text-[14px] md:text-[16px]">Pricing</Typography>
                    <Typography variant="subtitle1" gutterBottom>{place.price_level}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Rating name="read-only" value={Number(place.rating)} readOnly />
                    <Typography gutterBottom variant="subtitle1" color="text.secondary">{place.num_reviews} reviews</Typography>
                </Box>
                {place?.ranking && <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" gutterBottom className="!text-[13px] md:text-[15px]">Ranking</Typography>
                    <Typography variant="subtitle1" gutterBottom className="!text-[13px] md:text-[15px]">{place.ranking}</Typography>
                </Box>}
                {place?.awards && place?.awards?.map((award: { images: { small: string }; display_name: string }) => (
                    <Box my={1} display="flex" justifyContent="space-between" alignItems="center">
                        <img src={award.images.small} alt={award.display_name} />
                        <Typography variant="subtitle2" color="textSecondary">{award.display_name}</Typography>
                    </Box>
                ))}
                {place?.cuisine && place?.cuisine?.map(({ name }: { name: any }) => (
                    <Chip key={name} size="small" label={name} className="my-[5px] ml-[5px]"></Chip>
                ))}
                {place?.address && (
                    <p color="textSecondary" className="mb-8 flex items-center justify-between mt-2.5 w-full text-[12px] md:text-[14px]">
                        <LocationOnIcon />
                        <span className="ml-3 lg:ml-0">{place.address}</span>
                    </p>
                )}
                {place?.phone && (
                    <Typography gutterBottom variant="subtitle2" color="textSecondary" className="flex items-center justify-between">
                        <PhoneIcon /> {place.phone}
                    </Typography>
                )}
                <CardActions>
                    <Button size="small" color="primary" onClick={() => window.open(place.web_url, '_blank')}>Trip Companion</Button>
                    {place?.website && <Button size="small" color="primary" onClick={() => window.open(place.website, '_blank')}>Website</Button>}
                </CardActions>
            </CardContent>
        </Card>
    )
}

export default PlaceDetails
