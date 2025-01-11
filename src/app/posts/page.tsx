"use client";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";

import { LikeDialog } from "../comp/LikeDialog";

import { PostActions } from "../comp/PostActions";

import { PostContent } from "../comp/PostContent";

import { PostHeader } from "../comp/PostHeader";

import { FooterComp } from "../comp/FooterComp";

type userTypes = {
  email: string;
  password: string;
  username: string;
  profileIMG: string;
  followers: Array<string>;
  following: Array<string>;
  comments: Array<string>;
  posts: Array<string>;
  _id: string;
};
type postType = {
  _id: string;
  description: string;
  postImages: Array<string>;
  creatorID: userTypes;
  comments: Array<string>;
  likes: Array<string>;
}[];

const Page = () => {
  const [posts, setPosts] = useState<postType>([]);
  const [loading, setLoading] = useState(false);
  const getPosts = async () => {
    setLoading(true);
    const WebToken = localStorage.getItem("accessToken");
    console.log(WebToken);
    const jsonData = await fetch(
      "https://ig-backend-ix9h.onrender.com/posts/get",
      {
        headers: {
          Authorization: `Bearer ${WebToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const response = await jsonData.json();
    console.log(response);
    setPosts(response);
    if (setLoading !== undefined) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  console.log(posts);
  return (
    <FooterComp>
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
        <div className="min-h-screen min-w-screen flex flex-col justify-center items-center overflow-scroll bg-black">
          {posts?.map((post) => {
            return (
              <Card
                key={post._id}
                className="min-h-5/6 w-96 overflow-x-hidden bg-black border-white border-r-2 border-t-2 border-l-2 border-b-0  rounded-none"
              >
                <PostHeader creatorID={post.creatorID}></PostHeader>
                <PostContent postImages={post.postImages}></PostContent>
                <PostActions
                  likes={post.likes}
                  creatorID={post.creatorID}
                  comments={post.comments}
                  description={post.description}
                  postId={post._id}
                ></PostActions>
              </Card>
            );
          })}
        </div>
      )}
    </FooterComp>
  );
};
export default Page;
