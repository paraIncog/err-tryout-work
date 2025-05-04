import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { fetchContentRange } from "~/services/api";
import { Grid, Stack } from "@mui/material";
import { ContentCard } from "~/components/ContentCard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentRange().then((data) => {
      setItems(data);
      setLoading(false);
    }).catch((err) => {
      console.error("Error fetching content:", err);
      setLoading(false);
    });
  }
    , []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {items.map((item) => (
          <Grid size={4} item xs={12} sm={6} md={4} key={item.id}>
            <Stack spacing={2}>
              <ContentCard {...item} />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
