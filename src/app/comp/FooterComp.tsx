import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { jwtDecode } from "jwt-decode";
import { House } from "lucide-react";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import NewPostDialog from "./NewPostDialog";

type FollowerType = {
  username: string;
  profileIMG: string;
};
type FollowingType = {
  username: string;
  profileIMG: string;
};
type PostType = {
  _id: string;
  description: string;
  postImages: Array<string>;
};
type postType = {
  _id: string;
  email: string;
  password: string;
  username: string;
  profileIMG: string;
  followers: Array<FollowerType>;
  following: Array<FollowingType>;
  comments: Array<string>;
  posts: Array<PostType>;
};

export const FooterComp = ({ children }) => {
  const router = useRouter();
  const token = localStorage.getItem("accessToken");
  const decode = jwtDecode(token ?? "");
  const userId = decode.userId;
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [HandleLikePostID, setHandleLikePostID] = useState("");
  const HandleHome = () => {
    router.push("/posts");
  };
  const HandleRoute = () => {
    router.push(`/profile/${userId}`);
  };
  const handleDialog = () => {
    setCreateModalOpen((prev: any) => !prev);
  };
  const test = () => {
    setHandleLikePostID(userId);
    handleDialog();
  };

  return (
    <div>
      <div className="mb-5">{children}</div>
      <div className="flex w-full fixed bottom-0 left-0 right-0 justify-around h-14 items-center bg-black border-white border-t">
        <House className="text-white" onClick={HandleHome} />
        <Plus onClick={test} className="text-white" />
        <Avatar onClick={() => HandleRoute()}>
          <AvatarFallback>IMG</AvatarFallback>
          <AvatarImage></AvatarImage>
        </Avatar>
      </div>
      <NewPostDialog
        open={createModalOpen}
        handleDialog={handleDialog}
        data={HandleLikePostID}
      />
    </div>
  );
};
// export default FooterComp;
