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
    try {
      const jsonData = await fetch(
        `https://ig-backend-ix9h.onrender.com/comment/${postId}`
      );

      const response = await jsonData.json();
      const commentResponse = response.comments;
      setComments(commentResponse);
      if (response !== undefined) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
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
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
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
