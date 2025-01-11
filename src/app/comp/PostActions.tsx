import { CardFooter } from "@/components/ui/card";
import { Heart, MessageSquare, Send, Bookmark } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { LikeDialog } from "./LikeDialog";
import { useRouter } from "next/navigation";

export const PostActions = ({
  postId,
  likes,
  comments,
  creatorID,
  description,
}: {
  creatorID: { username: string };
  likes: Array<string>;
  comments: Array<string>;
  description: string;
  postId: string;
}) => {
  const router = useRouter();
  const token = localStorage.getItem("accessToken");

  const Decoded = jwtDecode(token ?? "");
  const LikedId = Decoded.userId;
  const [likesUse, setLikesUse] = useState(likes.length);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [HandleLikePostID, setHandleLikePostID] = useState("");
  const [isUserliked, setIsUserliked] = useState<boolean>(
    likes.includes(LikedId)
  );

  const HandleLike = async () => {
    if (isUserliked === false) {
      const PostId = postId;
      const res = await fetch(
        "https://ig-backend-ix9h.onrender.com/post/like",
        {
          method: "POST",
          body: JSON.stringify({ LikedId: LikedId, PostId: PostId }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await setLikesUse((prev) => prev + 1);

      setIsUserliked(true);
    }
    if (isUserliked === true) {
      const PostId = postId;
      await fetch("https://ig-backend-ix9h.onrender.com/post/unlike", {
        method: "POST",
        body: JSON.stringify({ UnLikedItId: LikedId, gotUnLikedId: PostId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLikesUse((prev) => prev - 1);

      setIsUserliked(false);
    }
  };

  const handleDialog = () => {
    setCreateModalOpen((prev: any) => !prev);
  };
  const test = (postID: string) => {
    setHandleLikePostID(postID);
    handleDialog();
  };
  const toCommentSection = (postID: string) => {
    router.push(`/posts/comment/${postID}`);
  };
  return (
    <div>
      <CardFooter className="flex-col w-96 p-2 items-start h-48 gap-1">
        <div className="flex justify-between w-80">
          <div className=" flex w-96 justify-between">
            <div className="flex w-16 justify-between">
              <Heart
                className=" hover:text-gray-600 duration-200 "
                color={isUserliked ? "red" : "white"}
                fill={isUserliked ? "red" : "black"}
                onClick={HandleLike}
              />
              <MessageSquare
                className="text-white hover:text-gray-600 duration-200"
                onClick={() => toCommentSection(postId)}
              />
            </div>
          </div>
        </div>
        <div
          className="text-white font-sans font-semibold"
          onClick={() => test(postId)}
        >
          {likesUse} likes
        </div>
        <span className="text-white font-sans font-semibold">
          {creatorID.username}: {description}
        </span>
        <span
          className="text-gray-500 font-sans font-semibold"
          onClick={() => toCommentSection(postId)}
        >
          View all {comments.length} comments
        </span>
      </CardFooter>
      <LikeDialog
        open={createModalOpen}
        handleDialog={handleDialog}
        data={HandleLikePostID}
      />
    </div>
  );
};
