"use client";
import { Input } from "@/components/ui/input";
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
const NewPostDialog = ({ open, handleDialog, data }: any) => {
  const [images, setImages] = useState<FileList | null>(null);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [descriptionValue, setDescriptionValue] = useState<string>("");

  const uploadImages = async () => {
    if (!images) return;

    const uploadPromises = Array.from(images).map(async (image) => {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "Taivan");
      formData.append("cloud_name", "daepguvpo");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/daepguvpo/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      return result.secure_url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    setUploadedImages(uploadedUrls.filter((url) => url !== null) as string[]);
  };
  const PostThePost = async () => {
    try {
      const body = {
        description: descriptionValue,
        postImages: uploadedImages,
        creatorID: data,
      };
      console.log({ body });
      const jsonData = await fetch(
        `https://ig-backend-ix9h.onrender.com/post/create`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //
      const response = await jsonData.json();
      handleDialog();
    } catch (error) {
      console.log(error);
    }
  };
  const HandleDescription = (e: { target: { value: string } }) => {
    setDescriptionValue(e.target.value);
  };
  return (
    <Dialog open={open} onOpenChange={handleDialog}>
      <DialogContent className="sm:max-w-[425px] min-h-1/3 bg-black">
        <DialogHeader className="h-7">
          <DialogTitle className="text-white">New Post</DialogTitle>
        </DialogHeader>
        <div className="max-w-lg mx-auto p-4 space-y-4">
          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setImages(files);
              }
            }}
            className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100"
          />
          <Input
            value={descriptionValue}
            onChange={HandleDescription}
            placeholder="Description"
            className="border-neutral-500 w-64 text-sm text-white"
          />
          <div className="w-96 flex justify-around">
            <button onClick={uploadImages} className="text-white">
              {" "}
              Upload
            </button>
            <button onClick={() => PostThePost()} className="text-white">
              post
            </button>
          </div>

          <div className="mt-4 text-center">
            <p></p>
            {uploadedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className="max-w-full h-[250px] object-contain rounded-lg shadow-lg"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default NewPostDialog;
