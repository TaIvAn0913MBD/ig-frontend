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
      className="h-96 w-96 flex justify-center items-center border-b-2 border-white
             p-2 border-t-2 bg-black "
    >
      <Carousel className="h-1/2 w-96 border-white">
        <CarouselContent>
          {postImages.map((image: string) => {
            console.log(image);
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
