import { Link } from "react-router";

type ContentProps = {
    id: number;
    heading: string;
    lead: string;
    photos: { photoUrlOriginal: string }[];
};

export const ContentCard: React.FC<ContentProps> = ({ id, heading, lead, photos }) => (
    <Link to={`/player/${id}`} className="content-card-link">
        <div className="content-card" key={id}>
            <img src={photos?.[0]?.photoUrlOriginal} alt={heading} width="150" />
            <h3>{heading}</h3>
            <div dangerouslySetInnerHTML={{ __html: lead }} />
        </div>
    </Link>
);
