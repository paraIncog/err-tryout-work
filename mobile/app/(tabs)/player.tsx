import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

export default function PlayerScreen() {
  const { id } = useLocalSearchParams();
  const numericId = typeof id === 'string' ? parseInt(id) : id;

  const [episode, setEpisode] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const res = await fetch(`https://services.err.ee/api/v2/radioAppContent/getContentPageData?contentId=${numericId}`);
        const json = await res.json();
        const content = json?.data?.mainContent;
        const media = content?.medias?.[0] || content?.clips?.[0]?.medias?.[0];
        if (!media) return;

        setEpisode({
          title: content.heading,
          imageUrl: content.photos?.[0]?.photoUrlOriginal,
          audioUrl: media.podcastUrl,
        });
      } catch (error) {
        console.error("Failed to fetch episode:", error);
      }
    };

    fetchEpisode();
  }, [numericId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const loadAndPlay = async () => {
    if (!episode || soundRef.current) return;

    const { sound } = await Audio.Sound.createAsync(
      { uri: episode.audioUrl },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;
    setIsPlaying(true);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (!isSeeking) {
      setPosition(status.positionMillis);
    }
    setDuration(status.durationMillis || 1);
    setIsPlaying(status.isPlaying);
  };

  const togglePlay = async () => {
    const sound = soundRef.current;

    if (!sound) {
      await loadAndPlay();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    const sound = soundRef.current;
    if (sound) {
      await sound.setPositionAsync(value);
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
          onSlidingComplete={val => {
            setIsSeeking(false);
            handleSeek(val);
          }}
        />
      </View>
    </View>
  );
}
