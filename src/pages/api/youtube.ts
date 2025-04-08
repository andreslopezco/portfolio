import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const API_KEY = import.meta.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UC3kR6DC7_0hND8MxofVntOQ";
  const MAX_RESULTS = 6;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`
  );

  if (!res.ok) {
    return new Response("Error fetching YouTube data", { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
