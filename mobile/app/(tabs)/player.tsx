import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-audio';
import { useLocalSearchParams } from 'expo-router';

export default function PlayerScreen({ route }) {
  const { id } = useLocalSearchParams();
  const [episode, setEpisode] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  const numericId = typeof id === 'string' ? parseInt(id) : id;

  useEffect(() => {
    fetch(`http://192.168.1.231:8080/api/content/range?from=${id}&to=${id}`)
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
  }, [id]);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const togglePlay = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: episode.audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    }
  };

  if (!episode) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Image source={{ uri: episode.imageUrl }} style={{ width: '100%', height: 200 }} />
      <Text style={{ fontSize: 24, marginVertical: 10 }}>{episode.title}</Text>
      <Button title={isPlaying ? "Pause" : "Play"} onPress={togglePlay} />
      <Slider
        value={position}
        minimumValue={0}
        maximumValue={duration}
        onValueChange={val => {
          if (sound) sound.setPositionAsync(val);
        }}
      />
    </View>
  );
}
