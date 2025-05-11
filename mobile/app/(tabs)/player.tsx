import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-audio';

export default function PlayerScreen() {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const { id } = useLocalSearchParams();
    const numericId = typeof id === 'string' ? parseInt(id) : id;

      const [episode, setEpisode] = useState<any>(null);
      const [isPlaying, setIsPlaying] = useState(false);
      const [position, setPosition] = useState(0);
      const [duration, setDuration] = useState(1);
      const [isSeeking, setIsSeeking] = useState(false);

      const playerRef = useRef<Audio.Player | null>(null);
      const intervalRef = useRef<NodeJS.Timeout | null>(null);

      useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/content/range?from=${numericId}&to=${numericId}`)
        .then(res => res.json())
      .then(data => {
        const content = data[0];
        const media = content.medias?.[0];
        setEpisode({
          title: content.heading,
          imageUrl: content.photos?.[0]?.photoUrlOriginal,
          audioUrl: media?.podcastUrl,
        });
      });
  }, [numericId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) playerRef.current.unloadAsync();
    };
  }, []);

  const loadAndPlay = async () => {
    if (!episode || playerRef.current) return;

    const player = new Audio.Player();
    await player.load(episode.audioUrl);
    await player.play();

    setIsPlaying(true);
    playerRef.current = player;

    // Polling position
    intervalRef.current = setInterval(async () => {
      const status = await player.getStatus();
      if (!isSeeking) {
        setPosition(status.positionMillis);
      }
      setDuration(status.durationMillis);
    }, 500);
  };

  const togglePlay = async () => {
    const player = playerRef.current;

    if (!player) {
      await loadAndPlay();
      return;
    }

    if (isPlaying) {
      await player.pause();
      setIsPlaying(false);
    } else {
      await player.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = async (value: number) => {
    const player = playerRef.current;
    if (player) {
      await player.setPosition(value);
      setPosition(value);
    }
  };

  const formatTime = (ms: number): string => {
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60).toString().padStart(2, '0');
    const sec = (total % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  if (!episode) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Image source={{ uri: episode.imageUrl }} style={{ width: '100%', height: 200 }} />
      <Text style={{ fontSize: 24, marginVertical: 10 }}>{episode.title}</Text>

      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={togglePlay} />

      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{formatTime(position)}</Text>
          <Text>{formatTime(duration)}</Text>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={val => {
            setIsSeeking(true);
            setPosition(val);
          }}
          onSlidingComplete={(val) => {
            setIsSeeking(false);
            handleSeek(val);
          }}
        />
      </View>
    </View>
  );
}
