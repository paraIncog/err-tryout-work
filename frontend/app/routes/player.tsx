// player.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pleier } from "~/components/Pleier";

export default function Player() {
  const { id } = useParams();
  const [episode, setEpisode] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/content/range?from=${id}&to=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const content = data[0];
          const media = content.medias?.[0];
          setEpisode({
            id: content.id,
            title: content.heading,
            description: content.lead,
            imageUrl: content.photos?.[0]?.photoUrlOriginal,
            audioUrl: media?.podcastUrl,
            duration: media?.duration || 240,
            createdTime: content.formatedTimes?.created || '',
          });
        }
      });
  }, [id]);

  if (!episode) return <div>Loading...</div>;

  return <Pleier episodeList={[episode]} />;
}
