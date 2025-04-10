import { getYoutubeCache, setYoutubeCache } from "@/utils/cache";

export async function GET() {
  try {
    const cached = getYoutubeCache();
    if (cached) {
      console.log("✅ Sirviendo desde caché");
      return new Response(JSON.stringify(cached), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = import.meta.env.YOUTUBE_API_KEY;
    const channelId = import.meta.env.YOUTUBE_CHANNEL_ID;

    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ API YouTube Error:", data);

      // Fallback a caché vieja si existe
      const fallback = getYoutubeCache(true); // modo forzado
      if (fallback) {
        return new Response(JSON.stringify(fallback), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ error: "YouTube API error", details: data }),
        { status: 500 }
      );
    }

    setYoutubeCache(data);
    console.log("✅ Nueva caché guardada");

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error general:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch YouTube data" }),
      { status: 500 }
    );
  }
}
