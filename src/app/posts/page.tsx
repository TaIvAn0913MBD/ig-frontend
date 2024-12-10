"use client";
import { useRouter } from "next/navigation";
import {
  Ellipsis,
  Heart,
  MessageSquare,
  Send,
  Bookmark,
  Star,
  Users,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarRadioItem,
  MenubarRadioGroup,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarCheckboxItem,
} from "@/components/ui/menubar";
import { Input } from "@/components/ui/input";

type likeTypes = { profileImage: string; username: string; _id: string };
type commentTypes = {
  _id: string;
  authorID: string;
  comment: string;
  postID: string;
};

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
  comments: commentTypes[];
  likes: likeTypes[];
}[];

const Page = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<postType>([]);
  const getPosts = async () => {
    const jsonData = await fetch(
      "https://ig-backend-ix9h.onrender.com/posts/get"
    );
    const response = await jsonData.json();
    setPosts(response);
  };
  useEffect(() => {
    getPosts();
  }, []);
  const toCommentSection = (postID: string) => {
    router.push(`/posts/${postID}`);
  };

  console.log(posts);
  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center items-center overflow-scroll">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Instagram</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Following
              <MenubarShortcut>
                <Star />
              </MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Followers{" "}
              <MenubarShortcut>
                <Users />
              </MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <label>
          <Input placeholder="Search" />
        </label>
      </Menubar>
      {posts?.map((post) => {
        const CReatorID = post.creatorID;
        console.log(post);
        console.log(CReatorID.profileIMG);
        const postID = post._id;
        return (
          <Card
            key={post._id}
            className="min-h-5/6 w-96 overflow-x-hidden bg-black border-black border-4"
          >
            <CardHeader className="flex justify-around w-96 h-16 ">
              <div className="flex w-80 justify-between">
                <div className="flex justify-between w-32">
                  <Avatar className="max-h-8 flex text-center">
                    <AvatarImage src={CReatorID.profileIMG} />
                    <AvatarFallback>IMG</AvatarFallback>
                  </Avatar>

                  <span className="text-white font-bold font-sans">
                    {CReatorID.username}
                  </span>
                </div>
                <Ellipsis className="text-white"></Ellipsis>
              </div>
            </CardHeader>
            <CardContent
              className="h-96 w-96 flex justify-center items-center border-b-2 border-white
             p-2 border-t-2 bg-black "
            >
              <Carousel className="h-1/2 w-96 border-white">
                <CarouselContent>
                  {post.postImages.map((image) => {
                    return (
                      <CarouselItem
                        className=" w-80 flex justify-center items-center"
                        key={image}
                      >
                        <img
                          src={image}
                          className="h-56 w-80  flex justify-center items-center"
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
            <CardFooter className="flex-col w-96 p-2 items-start h-48">
              <div className="flex justify-between w-80">
                <div className=" flex w-96 justify-between">
                  <div className="flex w-24 justify-between">
                    <Heart className="text-white hover:text-gray-600 duration-200" />
                    <MessageSquare
                      className="text-white hover:text-gray-600 duration-200"
                      onClick={() => toCommentSection(postID)}
                    />
                    <Send className="text-white hover:text-gray-600 duration-200" />
                  </div>
                  <Bookmark className="text-white hover:text-gray-600 duration-200" />
                </div>
              </div>
              <span className="text-white font-sans font-semibold">
                {post.likes.length} likes
              </span>
              <span className="text-white font-sans font-semibold">
                {CReatorID.username}: {post.description}
              </span>
              <span className="text-gray-500 font-sans font-semibold">
                View all {post.comments.length} comments
              </span>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
export default Page;
