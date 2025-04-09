import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import FadeIn from "./FadeIn";

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

        const formatted = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
        }));

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
        <div className="relative px-2">
          <Carousel>
            <CarouselContent className="px-4 mx-4">
              {videos.map((video) => (
                <CarouselItem
                  key={video.id}
                  className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver video: ${video.title}`}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col py-0 gap-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                      <div className="p-4 text-base font-semibold text-muted-foreground flex-1">
                        {video.title}
                      </div>
                    </Card>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-2" />
            <CarouselNext className="absolute -right-2" />
          </Carousel>
        </div>
      </FadeIn>
    </div>
  );
};

export default YoutubeCarousel;
