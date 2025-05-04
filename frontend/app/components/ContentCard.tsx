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
        <Card style={{ height: "21rem", textDecoration: 'none' }}>
            <CardMedia component="img" src={photos?.[0]?.photoUrlOriginal} alt={heading} width="200" />
            <CardContent style={{ padding: "1rem" }}>
                <Typography variant="h5" align="center">{heading}</Typography>
            </CardContent>
        </Card>
    </Link>
);
