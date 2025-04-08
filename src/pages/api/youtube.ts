import type { APIContext } from "astro";
import { getCachedYoutubeData, setCachedYoutubeData } from "@/lib/cache";

const YOUTUBE_API_KEY = import.meta.env.YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.YOUTUBE_CHANNEL_ID;

export async function GET({ request }: APIContext) {
  const cached = getCachedYoutubeData();
  if (cached) {
    return new Response(JSON.stringify(cached), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=6`
  );

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch YouTube data" }),
      {
        status: 500,
      }
    );
  }

  const data = await res.json();
  setCachedYoutubeData(data);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
