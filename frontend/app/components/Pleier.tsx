import { Grid, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const episode = episodeList[0];
  if (!episode) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  return (
    <div>
      <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center" style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
        <Grid>
          <img src={episode.imageUrl} alt="Thumbnail" style={{ maxWidth: '20rem' }} />
        </Grid>
        <Grid>
          <Typography variant='h4'>{episode.title}</Typography>
          <Typography variant='h5'>{episode.description}</Typography>
          <p style={{ fontSize: '0.9em', color: '#666' }}>{episode.formatedDate}</p>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <button onClick={togglePlay} style={{ marginRight: 10 }}>
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <span>{formatDuration(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={episode.duration}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value);
                if (audioRef.current) {
                  audioRef.current.currentTime = time;
                }
                setCurrentTime(time);
              }}
              style={{ flexGrow: 1, margin: '0 8px' }}
            />
            <span>{formatDuration(episode.duration)}</span>
          </div>
        </Grid>
      </Grid>

      <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />
    </div>
  );
};
