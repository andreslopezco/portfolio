import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SiYoutube } from "react-icons/si";
import { Card } from "@/components/ui/card";

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
    <section className="w-full mx-auto px-4 py-16 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 self-start">Últimos videos</h2>

      <Carousel className="w-[90%]">
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem
              key={video.id}
              className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default YoutubeCarousel;
