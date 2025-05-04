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

  if (!episodeList || episodeList.length === 0) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setEpisodeDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const episode = episodeList[0];
  if (!episode) return null;

  const [episodeDuration, setEpisodeDuration] = useState<number>(episode.duration || 0);

  return (
    
    <div>

      <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center" style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>

        <Grid align="center" size={4}>
          <img src={episode.imageUrl} alt="Thumbnail" style={{ maxWidth: '20rem', maxHeight: '20rem' }} />
        </Grid>

        <Grid size={8} direction={'column'}>
          <Typography variant='h4'>{episode.title}</Typography>
          <Typography variant='subtitle1'>{episode.description}</Typography>
          <Grid>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <button onClick={togglePlay} style={{ marginRight: 10 }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <span>{formatDuration(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={episodeDuration}
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
            <span>{formatDuration(episodeDuration)}</span>
          </div>
          </Grid>

        </Grid>
        
      </Grid>
      <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />
    </div>

  );
};
