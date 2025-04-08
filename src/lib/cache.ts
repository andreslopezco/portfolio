import fs from "fs";
import path from "path";

const CACHE_PATH = path.resolve("src/data/youtube-cache.json");
const ONE_DAY = 1000 * 60 * 60 * 24;

export function getYoutubeCache(force = false) {
  if (!fs.existsSync(CACHE_PATH)) return null;

  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    const isFresh = Date.now() - parsed.timestamp < ONE_DAY;

    return isFresh || force ? parsed.data : null;
  } catch (err) {
    console.error("❌ Error leyendo caché:", err);
    return null;
  }
}

export function setYoutubeCache(data: any) {
  const payload = {
    timestamp: Date.now(),
    data,
  };

  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ Error escribiendo caché:", err);
  }
}
