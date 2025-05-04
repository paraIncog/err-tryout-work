import { Grid, Typography } from '@mui/material';

type Episode = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO format, e.g. '2025-05-03T13:30:00Z'
  formatedDate: string; // e.g. '03.05.2025 13:30'
  imageUrl: string;
  audioUrl: string;
  duration: number; // in seconds
};

type PleierProps = {
  episodeList: Episode[];
};

export const Pleier: React.FC<PleierProps> = ({ episodeList }) => {

  const episode = episodeList[0];
  if (!episode) return null;

  return (
    <div>
      <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center" style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <Grid align="center" size={4}>
          <img src={episode.imageUrl} alt="Thumbnail" style={{ maxWidth: '20rem', maxHeight: '20rem' }} />
        </Grid>
        <Grid size={8} direction={'column'}>
          <Typography variant='h4'>{episode.title}</Typography>
          <Typography variant='subtitle1'>{episode.description}</Typography>
          <Typography variant='subtitle2' style={{ fontSize: '0.9em', color: '#666' }}>{episode.formatedDate}</Typography>
          <audio controls style={{ width: '100%', marginTop: 16 }}>
            <source src={episode.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

        </Grid>
      </Grid>
    </div>
  );
};
