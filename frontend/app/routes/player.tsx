// player.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pleier } from "~/components/Pleier";
import type { Route } from "./+types/home";

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
          setEpisode({
            id: content.id,
            title: content.heading,
            description: content.lead,
            date: content.dateCreated,
            imageUrl: content.photos?.[0]?.photoUrlOriginal,
            duration: content.media?.[0]?.duration || 240,
          });
        }
      });
  }, [id]);

  if (!episode) return <div>Loading...</div>;

  return <Pleier episodeList={[episode]} />;
}
