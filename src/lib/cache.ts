import fs from "fs";
import path from "path";

const CACHE_FILE = path.resolve("src/data/youtube-cache.json");
const CACHE_EXPIRATION = 1000 * 60 * 60 * 12;

export function getCachedYoutubeData() {
  if (!fs.existsSync(CACHE_FILE)) return null;

  const raw = fs.readFileSync(CACHE_FILE, "utf-8");
  const parsed = JSON.parse(raw);

  const isFresh = Date.now() - parsed.timestamp < CACHE_EXPIRATION;

  return isFresh ? parsed.data : null;
}

export function setCachedYoutubeData(data: any) {
  const payload = {
    timestamp: Date.now(),
    data,
  };

  fs.writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2), "utf-8");
}
