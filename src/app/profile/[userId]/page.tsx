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
    console.log(res);
    setUserData(res);
    console.log(userData?.followers);
    console.log(res?._id, userID, "asdf");

    if (res?._id === userID) {
      setFollowYourSelf(true);
      console.log(userData?._id);
      console.log(userID);
      console.log(followYourSelf);
    } else {
      setFollowYourSelf(false);
    }

    res.followers.map((user: FollowerType) => {
      console.log(ligma);
      if (user._id === userID) {
        setLigma([...ligma, true]);
        setFollowingStatus(true);
      } else {
        setLigma([...ligma, false]);
        setFollowingStatus(false);
      }
    });
    // if (ligma.includes(true) === true) {
    //   setFollowingStatus(true);
    // } else {
    //   setFollowingStatus(false);
    // }
    if (res !== undefined) {
      setLoading(false);
    }
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
  console.log({ followYourSelf });
  console.log(userData);
  console.log(followingStatus);

  console.log(ligma);

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
              <p className="text-white"> {userData?.followers.length}</p>
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
      )}
    </FooterComp>
  );
};
export default Profile;
