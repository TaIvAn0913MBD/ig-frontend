"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { use } from "react";

type authorType = {
  _id: string;
  email: string;
  password: string;
  username: string;
  profileIMG: string;
  followers: Array<string>;
  following: Array<string>;
  comments: Array<string>;
  posts: Array<string>;
};
type LikeType = {
  LikesId: string;
  PostId: string;
};
type CommentType = {
  _id: string;
  authorID: authorType;
  comment: string;
  postID: string;
  likes: LikeType[];
};

const Page = ({ params }: { params: Promise<{ postId: string }> }) => {
  const { postId } = use(params);
  const [comments, setComments] = useState<CommentType[]>([]);
  const getComments = async () => {
    try {
      const jsonData = await fetch(
        `https://ig-backend-ix9h.onrender.com/comment/${postId}`
      );

      const response = await jsonData.json();
      const commentResponse = response.comments;
      setComments(commentResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  console.log(comments);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="h-screen w-96 bg-black overflow-hidden">
        <CardHeader className="w-96 h-20 flex justify-center items-center border-b-2 border-gray-500">
          <div className="text-white text-xl font-sans font-bold">Comments</div>
        </CardHeader>
        <CardContent>
          {comments.map((comment) => {
            const authorInfo = comment.authorID;
            return (
              <div
                key={comment._id}
                className="flex flex-col my-3 border-zinc-300 border-2 p-2
              "
              >
                <div className="flex gap-4 justify-center items-center w-min">
                  <Avatar className="flex text-center">
                    <AvatarImage src={authorInfo.profileIMG} />
                    <AvatarFallback>IMG</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-sans font-semibold text-base">
                    {authorInfo.username}
                  </span>
                </div>

                <div className="text-white font-sans font-semibold text-sm mx-10">
                  ...{comment.comment}
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};
export default Page;
