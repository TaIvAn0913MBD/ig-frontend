"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const FollowingDialog = ({ open, handleDialog, data }: any) => {
  const [likes, setLikes] = useState([]);

  const getLikes = async () => {
    const jsonData = await fetch(
      `https://ig-backend-ix9h.onrender.com/getUsers/${data}`
    );
    const response = await jsonData.json();
    setLikes(response.following);
  };
  useEffect(() => {
    getLikes();
  }, [data]);
  return (
    <Dialog open={open} onOpenChange={handleDialog}>
      <DialogContent className="sm:max-w-[425px] min-h-96">
        <DialogHeader className="h-7">
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <div className="h-80 w-full flex flex-col justify-start overflow-y-scroll">
          {likes?.map(
            (like: { _id: string; profileIMG: string; username: string }) => {
              return (
                <div className="border-black border-2 m-3 p-3" key={like._id}>
                  <span
                    key={like._id}
                    className="flex gap-2 flex-col items-start
                "
                  >
                    <Avatar>
                      <AvatarImage src={like.profileIMG} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>{like.username}</p>
                  </span>
                </div>
              );
            }
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default FollowingDialog;
