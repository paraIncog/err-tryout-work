import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pleier } from "~/components/Pleier";
import { fetchContentRange } from "~/services/api";

export default function Player() {
  const { id } = useParams();
  const [episode, setEpisode] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;

    fetchContentRange(Number(id), Number(id)).then((data) => {
      if (data.length > 0) {
        setEpisode(data[0]);
      }
    });
  }, [id]);

  if (!episode) return <div>Loading...</div>;

  return <Pleier episodeList={[episode]} />;
}
