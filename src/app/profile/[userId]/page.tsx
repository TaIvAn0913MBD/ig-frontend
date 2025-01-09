"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Key, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageDown, Grid3X3 } from "lucide-react";
import { use } from "react";
import { FooterComp } from "@/app/comp/FooterComp";
import FollowingDialog from "../../comp/FollowingDialog";
import FollowerDialog from "../../comp/FollowerDialog";
import EditProfilePhoto from "@/app/comp/EditProfilePhoto";

type FollowerType = {
  username: string;
  profileIMG: string;
  _id: string;
};
type FollowingType = {
  username: string;
  profileIMG: string;
};
type INPostType = {
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
  bio: string;
  followers: Array<FollowerType>;
  following: Array<FollowingType>;
  comments: Array<string>;
  posts: Array<INPostType>;
};

const Profile = ({ params }: { params: Promise<{ userId: string }> }) => {
  const router = useRouter();
  const { userId } = use(params);
  const token = localStorage.getItem("accessToken");
  const [followingStatus, setFollowingStatus] = useState<boolean>();
  const Decoded = jwtDecode(token ?? "");
  const userID = Decoded.userId;
  const [userData, setUserData] = useState<postType>();
  const [createModalFollowerOpen, setCreateModalFollowerOpen] = useState(false);
  const [createModalEditOpen, setCreateModalEditOpen] = useState(false);
  const [createModalFollowingOpen, setCreateModalFollowingOpen] =
    useState(false);
  const [reloader, setReloader] = useState(false);
  const [HandleFollowerPostID, setHandleFollowerPostID] = useState<
    string | undefined
  >("");
  const [HandleFollowingPostID, setHandleFollowingPostID] = useState<
    string | undefined
  >("");

  const GetUser = async () => {
    const JSONDATA = await fetch(
      `https://ig-backend-ix9h.onrender.com/getUsers/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await JSONDATA.json();
    console.log(res);
    setUserData(res);
    console.log(userData?.followers);

    const sigma = userData?.followers.map((user) => {
      if (user._id.includes(userID) === true) {
        console.log(userID._id);
        setFollowingStatus(false);
      } else {
        setFollowingStatus(true);
      }
    });
    console.log(followingStatus);
  };
  const FollowHim = async (id1: string | undefined) => {
    const newBody = { gotFollowedID: id1, followedHimID: userID };
    console.log(newBody);
    const res = await fetch(
      `https://ig-backend-ix9h.onrender.com/users/follow`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBody),
      }
    );
    setReloader((prev: any) => !prev);
    console.log(res.json());
    setFollowingStatus(true);
  };
  const UnFollowHim = async (id1: string | undefined) => {
    const newBody = { UnfollowedHimID: userID, gotUnfollowedID: id1 };
    const res = await fetch(
      `https://ig-backend-ix9h.onrender.com/users/unfollow`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBody),
      }
    );
    setReloader((prev: any) => !prev);
    console.log(res.json());
    setFollowingStatus(false);
  };
  const handleDialogFollower = () => {
    setCreateModalFollowerOpen((prev: any) => !prev);
  };
  const handleDialogFollowing = () => {
    setCreateModalFollowingOpen((prev: any) => !prev);
  };
  const handleDialogEdit = () => {
    setCreateModalEditOpen((prev: any) => !prev);
  };
  const testEditProfileIMG = () => {
    handleDialogEdit();
  };
  const testFollower = (postID: string | undefined) => {
    setHandleFollowerPostID(postID);
    console.log(postID);
    handleDialogFollower();
  };
  const testFollowing = (postID: string | undefined) => {
    setHandleFollowingPostID(postID);
    handleDialogFollowing();
  };

  useEffect(() => {
    GetUser();
  }, [reloader]);
  console.log(userData);
  console.log(followingStatus);
  return (
    <FooterComp>
      <Card className="border-0 min-h-screen">
        <CardHeader className="border-b border-black h-2/6 flex flex-col gap-5">
          <div className="flex gap-7 h-16 items-center">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={userData?.profileIMG}
                className="h-20 w-20"
              ></AvatarImage>
              <AvatarFallback className="h-20 w-20">IMG</AvatarFallback>
            </Avatar>
            <p className="text-lg">{userData?.username}</p>
          </div>
          <CardDescription className="text-black text-base">
            BIO: {userData?.bio}
          </CardDescription>
          <div className="flex  w-full justify-around">
            <div
              className="flex h-16 w-28 flex-wrap justify-center items-center border-2 rounded-lg border-black"
              onClick={() => testEditProfileIMG()}
            >
              Proflie Picture <ImageDown />
            </div>

            <div>
              {followingStatus ? (
                <span
                  className="text-cyan-500 border border-black p-2 bg-black rounded-md"
                  onClick={() => UnFollowHim(userData?._id)}
                >
                  Unfollow
                </span>
              ) : (
                <span
                  className="text-cyan-500 border border-black p-2 bg-black rounded-md"
                  onClick={() => FollowHim(userData?._id)}
                >
                  Follow
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="w-full h-16 flex  justify-evenly mt-3 border-b-2 border-black">
          <div className="w-1/3 flex flex-col items-center h-14 border-r border-black">
            <p>{userData?.posts.length}</p>
            <p>posts</p>
          </div>
          <div
            className="w-1/3 flex flex-col items-center h-14 border-r border-black"
            onClick={() => testFollower(userData?._id)}
          >
            <p>{userData?.followers.length}</p>
            <p>followers</p>
          </div>
          <div
            className="w-1/3 flex flex-col items-center h-14"
            onClick={() => testFollowing(userData?._id)}
          >
            <p>{userData?.following.length}</p>
            <p>following</p>
          </div>
        </CardContent>
        <CardFooter className="mt-2 flex flex-col w-full p-2">
          <div className="w-full justify-center flex gap-1 border-b border-black p-2">
            <p>Posts</p>
            <Grid3X3 />
          </div>
          <div className="mt-2 flex w-full flex-wrap gap-2 justify-center">
            {userData?.posts.map((post) => {
              return post.postImages.map((image) => {
                return <img src={image} key={image} className="w-32" />;
              });
            })}
          </div>
        </CardFooter>
        <FollowingDialog
          open={createModalFollowingOpen}
          handleDialog={handleDialogFollowing}
          data={HandleFollowingPostID}
        />
        <FollowerDialog
          open={createModalFollowerOpen}
          handleDialog={handleDialogFollower}
          data={HandleFollowerPostID}
        />
        <EditProfilePhoto
          open={createModalEditOpen}
          handleDialog={handleDialogEdit}
        />
      </Card>
    </FooterComp>
  );
};
export default Profile;
