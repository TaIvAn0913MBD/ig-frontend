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

  return (
    <CardHeader className="flex flex-row justify-between w-96 h-16 ">
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
    </CardHeader>
  );
};
