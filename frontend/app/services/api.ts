export async function fetchContentRange(from = 1609669300, to = 1609669316) {
    const response = await fetch(`http://localhost:8080/api/content/range?from=${from}&to=${to}`);
    if (!response.ok) throw new Error("Failed to fetch content");
    return response.json();
}
