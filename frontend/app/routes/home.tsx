import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { fetchContentRange } from "~/services/api";
import { Grid, Stack } from "@mui/material";

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
          <Grid size={4} key={item.id}>
            <Stack spacing={2}>
              <div className="content-card" key={item.id}>
                <img src={item.photos?.[0]?.photoUrlOriginal} alt={item.heading} width="150" />
                <h3>{item.heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: item.lead }} />
              </div>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
