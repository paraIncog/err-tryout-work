export async function fetchContentRange(from = 1609669300, to = 1609669316) {
  const contentPromises = [];
  for (let i = from; i <= to; i++) {
    const url = `https://services.err.ee/api/v2/radioAppContent/getContentPageData?contentId=${i}`;
    contentPromises.push(fetch(url).then(res => res.json()).catch(() => null));
  }

  const rawResponses = await Promise.all(contentPromises);
  return rawResponses
    .map((res: any) => res?.data?.mainContent)
    .filter(Boolean)
    .map((content: any) => {
      const medias = content.medias?.length ? content.medias : content.clips?.[0]?.medias;
      if (!medias?.length) return null;

      return {
        id: content.id,
        heading: content.heading,
        lead: content.lead,
        photos: content.photos,
        audioUrl: medias[0]?.podcastUrl,
        duration: medias[0]?.duration || 240,
        createdTime: content.formatedTimes?.created,
      };
    })
    .filter(Boolean);
}
