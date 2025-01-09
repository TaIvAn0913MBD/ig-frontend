import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
export const PostHeader = ({
  creatorID,
}: {
  creatorID: { profileIMG: string; username: string; _id: string };
}) => {
  const router = useRouter();
  const RouteToProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };
  console.log(creatorID);
  return (
    <CardHeader className="flex justify-around w-96 h-16 ">
      <div className="flex w-80 justify-between">
        <div className="flex justify-between w-32">
          <Avatar className="max-h-8 flex text-center">
            <AvatarImage src={creatorID.profileIMG} />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>

          <span
            className="text-white font-bold font-sans"
            onClick={() => RouteToProfile(creatorID._id)}
          >
            {creatorID.username}
          </span>
        </div>
        <Ellipsis className="text-white"></Ellipsis>
      </div>
    </CardHeader>
  );
};
