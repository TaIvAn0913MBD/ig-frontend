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
import { LogOut } from "lucide-react";
import { FooterComp } from "@/app/comp/FooterComp";
import FollowingDialog from "../../comp/FollowingDialog";
import FollowerDialog from "../../comp/FollowerDialog";
import EditProfilePhoto from "@/app/comp/EditProfilePhoto";
import { isGeneratorFunction } from "util/types";

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
  const [followingStatus, setFollowingStatus] = useState<boolean>(false);
  const Decoded = jwtDecode(token ?? "");
  const userID = Decoded.userId;
  const [userData, setUserData] = useState<postType>();
  const [createModalFollowerOpen, setCreateModalFollowerOpen] = useState(false);
  const [createModalEditOpen, setCreateModalEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createModalFollowingOpen, setCreateModalFollowingOpen] =
    useState(false);
  const [reloader, setReloader] = useState(false);
  const [HandleFollowerPostID, setHandleFollowerPostID] = useState<
    string | undefined
  >("");
  const [HandleFollowingPostID, setHandleFollowingPostID] = useState<
    string | undefined
  >("");
  const [ligma, setLigma] = useState<Array<boolean>>([]);
  const [followYourSelf, setFollowYourSelf] = useState<boolean>(true);
  const [followerCount, setFollowerCount] = useState(
    userData?.followers.length
  );

  const GetUser = async () => {
    setLoading(true);
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

    setUserData(res);

    if (res?._id === userID) {
      setFollowYourSelf(true);
    } else {
      setFollowYourSelf(false);
    }

    res.followers.map((user: FollowerType) => {
      if (user._id === userID) {
        setLigma([...ligma, true]);
        setFollowingStatus(true);
      } else {
        setLigma([...ligma, false]);
        setFollowingStatus(false);
      }
    });

    if (res !== undefined && res !== null) {
      setLoading(false);
    }
    setFollowerCount(res.followers.length);
  };
  const SignOut = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };
  const FollowHim = async (id1: string | undefined) => {
    const newBody = { gotFollowedID: id1, followedHimID: userID };

    const res = await fetch(
      `https://ig-backend-ix9h.onrender.com/users/follow`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBody),
      }
    );
    setFollowerCount((prev: any) => prev + 1);
    setReloader((prev: any) => !prev);

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
    setFollowerCount((prev: any) => prev - 1);

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

    handleDialogFollower();
  };
  const testFollowing = (postID: string | undefined) => {
    setHandleFollowingPostID(postID);
    handleDialogFollowing();
  };

  useEffect(() => {
    GetUser();
  }, []);

  return (
    <FooterComp>
      {loading ? (
        <div
          role="status"
          className="bg-black w-screen h-[1200px] flex justify-center items-center"
        >
          <div className="flex flex-row gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 animate-bounce"></div>
            <div className="w-6 h-6 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-6 h-6 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </div>
      ) : (
        <Card className="border-0 min-h-screen bg-black">
          <CardHeader className="border-b border-black h-2/6 flex flex-col gap-5">
            <div className="flex gap-7 h-16 items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={userData?.profileIMG}
                  className="h-20 w-20"
                ></AvatarImage>
                <AvatarFallback className="h-20 w-20">IMG</AvatarFallback>
              </Avatar>
              <p className="text-lg text-white">{userData?.username}</p>
            </div>
            <CardDescription className="text-white text-base">
              BIO: {userData?.bio}
            </CardDescription>
            <LogOut onClick={SignOut} className="text-white" />
            <div className="flex  w-full justify-around">
              {followYourSelf ? (
                <div
                  className="flex h-16 w-28 flex-wrap justify-center text-white items-center border-2 rounded-lg border-white"
                  onClick={() => testEditProfileIMG()}
                >
                  Proflie Picture <ImageDown />
                </div>
              ) : (
                <div></div>
              )}

              {followYourSelf ? (
                <div></div>
              ) : (
                <div>
                  {followingStatus ? (
                    <span
                      className="text-cyan-500 border border-white p-2 bg-white rounded-md"
                      onClick={() => UnFollowHim(userData?._id)}
                    >
                      Unfollow
                    </span>
                  ) : (
                    <span
                      className="text-cyan-500 border border-white p-2 bg-white rounded-md"
                      onClick={() => FollowHim(userData?._id)}
                    >
                      Follow
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="w-full h-16 flex  justify-evenly mt-3 border-b-2 border-white border-t-2 pt-2">
            <div className="w-1/3 flex flex-col items-center h-12 border-r border-white">
              <p className="text-white">{userData?.posts.length}</p>
              <p className="text-white">posts</p>
            </div>
            <div
              className="w-1/3 flex flex-col items-center h-12 border-r border-white"
              onClick={() => testFollower(userData?._id)}
            >
              <p className="text-white"> {followerCount}</p>
              <p className="text-white">followers</p>
            </div>
            <div
              className="w-1/3 flex flex-col items-center h-12"
              onClick={() => testFollowing(userData?._id)}
            >
              <p className="text-white">{userData?.following.length}</p>
              <p className="text-white">following</p>
            </div>
          </CardContent>
          <CardFooter className="mt-2 flex flex-col w-full p-2">
            <div className="w-full justify-center flex gap-1 border-b border-white p-2">
              <p className="text-white">Posts</p>
              <Grid3X3 className="text-white" />
            </div>
            <div className="mt-2 flex w-full flex-wrap gap-2 justify-center">
              {userData?.posts.map((post, index) => {
                const image = post.postImages[0];

                return (
                  <img
                    src={image}
                    key={index}
                    className="w-32 border-white border"
                  />
                );
              })}
              ;
            </div>
          </CardFooter>
          <FollowingDialog
            open={createModalFollowingOpen}
            close={setCreateModalFollowingOpen}
            handleDialog={handleDialogFollowing}
            data={HandleFollowingPostID}
          />
          <FollowerDialog
            open={createModalFollowerOpen}
            close={setCreateModalFollowerOpen}
            handleDialog={handleDialogFollower}
            data={HandleFollowerPostID}
          />
          <EditProfilePhoto
            open={createModalEditOpen}
            close={setCreateModalEditOpen}
            handleDialog={handleDialogEdit}
          />
        </Card>
      )}
    </FooterComp>
  );
};
export default Profile;
