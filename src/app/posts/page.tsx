"use client";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";

import { LikeDialog } from "../comp/LikeDialog";

import { PostActions } from "../comp/PostActions";

import { PostContent } from "../comp/PostContent";

import { PostHeader } from "../comp/PostHeader";

type userTypes = {
  email: string;
  password: string;
  username: string;
  profileIMG: string;
  followers: Array<string>;
  following: Array<string>;
  comments: Array<string>;
  posts: Array<string>;
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
  const getPosts = async () => {
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
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center items-center overflow-scroll">
      {posts?.map((post) => {
        return (
          <Card
            key={post._id}
            className="min-h-5/6 w-96 overflow-x-hidden bg-black border-black border-4"
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

      {/* <LikeDialog
        open={createModalOpen}
        handleDialog={handleDialog}
        data={HandleLikePostID}
      /> */}
    </div>
  );
};
export default Page;
