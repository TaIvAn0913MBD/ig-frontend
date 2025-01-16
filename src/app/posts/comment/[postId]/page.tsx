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
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { FooterComp } from "@/app/comp/FooterComp";

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
  const router = useRouter();
  const token = localStorage.getItem("accessToken");
  const [reloader, setReloader] = useState(false);
  const [loading, setLoading] = useState(false);
  const Decoded = jwtDecode(token ?? "");
  const userID = Decoded.userId;
  const { postId } = use(params);
  const [inputValue, setInputValue] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const getComments = async () => {
    setLoading(true);

    const jsonData = await fetch(
      `https://ig-backend-ix9h.onrender.com/comment/${postId}`
    );

    const response = await jsonData.json();
    const commentResponse = response.comments;
    setComments(commentResponse);
    if (response !== undefined) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, [reloader]);
  const HandleInputValue = (e: { target: { value: string } }) => {
    if (e.target.value !== "") {
      setInputValue(e.target.value);
    } else {
      alert("The comment is empty. Please write something");
    }
  };
  const CreateComment = async () => {
    if (inputValue !== "") {
      const jsonData = await fetch(
        "https://ig-backend-ix9h.onrender.com/post/comment",
        {
          method: "POST",
          body: JSON.stringify({
            authorID: userID,
            postID: postId,
            comment: inputValue,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setReloader((prev: any) => !prev);
      setInputValue("");
    } else {
      alert("The comment is empty. Please write something");
    }
  };
  const HandleBack = () => {
    router.push("/posts");
  };
  return (
    <FooterComp>
      <div className="h-screen w-screen flex justify-center items-center bg-black">
        {loading ? (
          <div role="status">
            <div className="flex flex-row gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
              <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
            </div>

            <span className="sr-only text-white">Loading...</span>
          </div>
        ) : (
          <Card className="h-5/6 w-96 bg-black overflow-hidden">
            <CardHeader className="w-96 h-20 flex justify-center items-center border-b-2 border-gray-500">
              <div className="text-white text-xl font-sans font-bold">
                Comments
              </div>
            </CardHeader>

            <div className="flex flex-col justify-between h-5/6 mt-5 items-center">
              <CardContent className="overflow-y-scroll w-full h-full ">
                {comments.map((comment) => {
                  const authorInfo = comment.authorID;
                  return (
                    <div
                      key={comment._id}
                      className="flex flex-col w-full my-3 border-zinc-300 border-2 p-2 flex-wrap
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

                      <p className="whitespace-pre-wrap text-white w-80 text-wrap">
                        {comment.comment}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 w-80">
                  <Input
                    className="text-white w-72"
                    value={inputValue}
                    onChange={HandleInputValue}
                  />
                  <Button
                    className="bg-white hover:bg-lime-500 duration-300"
                    onClick={CreateComment}
                  >
                    <ArrowRight className="text-black h-4 hover:h-8 duration-700" />
                  </Button>
                </div>
              </CardFooter>
              <Button
                className="bg-white hover:bg-slate-400 duration-300 w-5/6 text-black"
                onClick={HandleBack}
              >
                Go Back
              </Button>
            </div>
          </Card>
        )}
      </div>
    </FooterComp>
  );
};
export default Page;
