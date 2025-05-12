import { Grid, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

type Episode = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdTime?: string;
};

type PleierProps = {
  episodeList: Episode[];
};

export const Pleier: React.FC<PleierProps> = ({ episodeList }) => {
  if (!episodeList || episodeList.length === 0) return null;

  const episode = episodeList[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [episodeDuration, setEpisodeDuration] = useState<number>(episode.duration || 0);

  const STORAGE_KEY = `episode-progress-${episode.id}`;

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

    // Take saved position
    const savedTime = localStorage.getItem(STORAGE_KEY);
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
      setCurrentTime(audio.currentTime);
    }

    const updateTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      localStorage.setItem(STORAGE_KEY, time.toString());
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setEpisodeDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    if ('mediaSession' in navigator && episode) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.title,
        artist: 'ERR',
        album: 'ERR Raadio',
        artwork: [{ src: episode.imageUrl, sizes: '512x512', type: 'image/png' }],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audio.play();
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.fastSeek && 'fastSeek' in audio) {
          (audio as any).fastSeek(details.seekTime);
        } else {
          audio.currentTime = details.seekTime ?? 0;
        }
        setCurrentTime(audio.currentTime);
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [episode]);

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
                localStorage.setItem(STORAGE_KEY, time.toString());
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
