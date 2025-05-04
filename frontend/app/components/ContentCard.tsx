import { Card, CardMedia, Grid, Typography } from "@mui/material";
import { Link } from "react-router";

type ContentProps = {
    id: number;
    heading: string;
    lead: string;
    photos: { photoUrlOriginal: string }[];
};

export const ContentCard: React.FC<ContentProps> = ({ id, heading, lead, photos }) => (
    <Link to={`/player/${id}`} style={{ textDecoration: 'none' }}>
        <Card style={{ height: "20rem", textDecoration: 'none' }}>
            <CardMedia component="img" src={photos?.[0]?.photoUrlOriginal} alt={heading} width="200" />
            <Typography variant="h5" align="center">{heading}</Typography>
        </Card>
    </Link>
);
