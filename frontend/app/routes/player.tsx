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
			formatedDate: new Date(content.dateCreated).toLocaleString("de-DE", {
			  day: "2-digit",
			  month: "2-digit",
			  year: "numeric",
			  hour: "2-digit",
			  minute: "2-digit",
			}),
            imageUrl: content.photos?.[0]?.photoUrlOriginal,
            audioUrl: content.media?.[0]?.mediaUrl, // adjust based on actual API response
            duration: content.media?.[0]?.duration || 240,
          });
        }
      });
  }, [id]);

  if (!episode) return <div>Loading...</div>;

  return <Pleier episodeList={[episode]} />;
}
