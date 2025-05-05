import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { fetchContentRange } from "~/services/api";
import { Box, Grid, Stack, Typography } from "@mui/material";
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

  // Grouping logic - adjust as needed
  const categorize = (items: any[]) => {
    const categories: Record<string, any[]> = {
      "Päevakajaline": [],
      "Meelelahutus": [],
      "Muu": []
    };

    for (const item of items) {
      if (item.heading?.includes("päev") || item.heading?.includes("aktuaalne")) {
        categories["Päevakajaline"].push(item);
      } else if (item.heading?.includes("meelelahutus") || item.heading?.includes("huumor")) {
        categories["Meelelahutus"].push(item);
      } else {
        categories["Muu"].push(item);
      }
    }

    return categories;
  };

  const categorizedItems = categorize(items);

  return (
    <div>
      {Object.entries(categorizedItems).map(([category, contents]) => (
        <Box key={category} mb={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {category}
          </Typography>
          <Box display="flex" overflow="auto" gap={2} pb={1}>
            {contents.map((item) => (
              <Box key={item.id} flex="0 0 auto" width={240}>
                <ContentCard {...item} />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </div>
  );
}
