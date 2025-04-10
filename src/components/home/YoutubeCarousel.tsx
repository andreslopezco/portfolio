import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import FadeIn from "@/components/react/FadeIn";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

const YoutubeCarousel = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/youtube");
        const data = await res.json();

        if (!data.items || !Array.isArray(data.items)) {
          console.error("Invalid YouTube API response:", data);
          return;
        }

        const formatted = data.items
          .map((item: any) => {
            // Handle different response formats
            const id =
              item.id?.videoId ||
              (item.id?.channelId
                ? item.id.channelId
                : typeof item.id === "string"
                ? item.id
                : "");

            const thumbnailUrl =
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.default?.url ||
              "/logo.webp";

            return {
              id: id,
              title: item.snippet?.title || "Untitled",
              thumbnail: thumbnailUrl,
            };
          })
          .filter((video: Video) => video.id); // Filter out items without IDs

        setVideos(formatted);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  if (videos.length === 0) return null;

  return (
    <div className="w-full" aria-label="Carrusel de videos de YouTube">
      <FadeIn>
        <h2 className="text-3xl font-bold mb-6">Últimos videos</h2>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="relative">
          <Carousel className="w-full">
            <div className="relative">
              <CarouselContent className="w-[80%] md:w-[85%] lg:w-[90%] mx-auto gap-4">
                {videos.map((video) => (
                  <CarouselItem
                    key={video.id}
                    className="basis-full md:basis-1/2 lg:basis-1/3 p-0"
                  >
                    <a
                      href={
                        video.id.includes("UC")
                          ? `https://www.youtube.com/channel/${video.id}`
                          : `https://www.youtube.com/watch?v=${video.id}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver ${
                        video.id.includes("UC") ? "canal" : "video"
                      }: ${video.title}`}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col py-0 gap-0">
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-48 object-cover rounded-t-xl"
                            onError={(e) => {
                              // Fallback for failed image loads
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = "/logo.webp"; // Use logo as fallback
                            }}
                            loading="lazy"
                          />
                          {video.id.includes("UC") && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <span className="text-white text-sm px-2 py-1 bg-black/50 rounded">
                                Canal de YouTube
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 text-base font-semibold text-muted-foreground flex-1">
                          {video.title}
                        </div>
                      </Card>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Overlay navigation buttons */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 z-10">
                <CarouselPrevious className="bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black border border-gray-200 dark:border-gray-800 size-8" />
              </div>
              <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                <CarouselNext className="bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black border border-gray-200 dark:border-gray-800 size-8" />
              </div>
            </div>
          </Carousel>
        </div>
      </FadeIn>
    </div>
  );
};

export default YoutubeCarousel;
