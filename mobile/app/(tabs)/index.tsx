import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
const router = useRouter();

const fetchContentRange = async () => {
  const res = await fetch('http://${API_URL}/api/content/range?from=1609669300&to=1609669316');
  return res.json();
};

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchContentRange()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categorize = (items: any[]) => {
    const categories: Record<string, any[]> = {
      "Päevakajaline": [],
      "Meelelahutus": [],
      "Muu": []
    };

    for (const item of items) {
      if (item.heading?.toLowerCase().includes("päev")) {
        categories["Päevakajaline"].push(item);
      } else {
        categories["Muu"].push(item);
      }
    }

    return categories;
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  const categories = categorize(items);

  return (
    <ScrollView style={{ padding: 16 }}>
      {Object.entries(categories).map(([category, list]) => (
        list.length > 0 && (
          <View key={category} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{category}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {list.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(`/player?id=${item.id}`)}
                  style={{ marginRight: 12 }}
                >
                  <Image
                    source={{ uri: item.photos?.[0]?.photoUrlOriginal }}
                    style={{ width: 120, height: 120, borderRadius: 8 }}
                  />
                  <Text style={{ width: 120, textAlign: 'center' }}>{item.heading}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )
      ))}
    </ScrollView>
  );
}
