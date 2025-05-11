import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Link } from "react-router";

type ContentProps = {
    id: number;
    heading: string;
    lead: string;
    photos: { photoUrlOriginal: string }[];
};

export const ContentCard: React.FC<ContentProps> = ({ id, heading, photos }) => (
    <Link to={`/player/${id}`} style={{ textDecoration: 'none' }}>
        <Card sx={{ height: { xs: 300, sm: 336 }, display: 'flex', flexDirection: 'column' }} style={{ height: "21rem", textDecoration: 'none' }}>
            <CardMedia sx={{
                width: '100%',
                height: 160,
                objectFit: 'cover',
            }} component="img" src={photos?.[0]?.photoUrlOriginal} alt={heading} width="200" />
            <CardContent sx={{ flexGrow: 1 }} style={{ padding: "1rem" }}>
                <Typography fontSize={{ xs: '1rem', sm: '1.25rem' }} variant="h5" align="center">{heading}</Typography>
            </CardContent>
        </Card>
    </Link>
);
