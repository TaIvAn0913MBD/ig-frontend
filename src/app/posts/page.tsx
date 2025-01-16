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

    setPosts(response);
    if (setLoading !== undefined) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <FooterComp>
      {loading ? (
        <div
          role="status"
          className="bg-black w-screen h-[1200px] justify-center items-center flex"
        >
          <div className="flex flex-row gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 animate-bounce"></div>
            <div className="w-6 h-6 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-6 h-6 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <span className="sr-only text-white">Loading...</span>
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
