import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CardContent } from "@/components/ui/card";
export const PostContent = ({ postImages }: { postImages: Array<string> }) => {
  return (
    <CardContent
      className="h-96 w-96 flex justify-center items-center border-b border-x-zinc-800
             p-2 border-t bg-black mt-4"
    >
      <Carousel className="h-1/2 w-96">
        <CarouselContent>
          {postImages.map((image: string) => {
            return (
              <CarouselItem
                className=" w-80 flex justify-center items-center"
                key={image}
              >
                <img
                  src={image}
                  className="h-56 w-80  flex justify-center items-center"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </CardContent>
  );
};
