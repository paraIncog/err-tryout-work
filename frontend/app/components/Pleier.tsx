import { Grid, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

type Episode = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  createdTime?: string;
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

      <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ p: 2 }}>
        <Grid item xs={12} sm={5} sx={{ textAlign: 'center' }}>
          <img
            src={episode.imageUrl}
            alt="Thumbnail"
            style={{ maxWidth: '100%', maxHeight: '20rem', borderRadius: 8 }}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Typography variant="body2" gutterBottom>
            Avaldatud: {episode.createdTime}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {episode.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {episode.description}
          </Typography>
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

      <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />
    </div>

  );
};
