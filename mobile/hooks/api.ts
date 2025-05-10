export async function fetchContentRange(from = 10, to = 30) {
  const response = await fetch(`http://<your-ip>:8080/api/content/range?from=${from}&to=${to}`);
  if (!response.ok) throw new Error("Failed to fetch content");
  return response.json();
}
