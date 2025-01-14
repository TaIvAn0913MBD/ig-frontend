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
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
const EditProfilePhoto = ({ open, handleDialog }: any) => {
  const [images, setImages] = useState<FileList | null>(null);
  const token = localStorage.getItem("accessToken");
  const decode = jwtDecode(token ?? "");
  const userId = decode.userId;

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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
  const EditTheProfileIMG = async () => {
    try {
      const body = {
        _id: userId,
        profileIMG: uploadedImages[0],
      };
      console.log({ body });
      const jsonData = await fetch(
        `https://ig-backend-ix9h.onrender.com/user/edit/profileIMG`,
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

  return (
    <Dialog open={open} onOpenChange={handleDialog}>
      <DialogContent className="sm:max-w-[425px] min-h-96 bg-black">
        <DialogHeader className="h-7">
          <DialogTitle className="text-white">Edit</DialogTitle>
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
            className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 file:cursor-pointer text-white hover:file:bg-blue-100"
          />
          <div className="w-96 flex justify-around">
            <button onClick={uploadImages} className="text-white">
              Upload
            </button>
            <button onClick={EditTheProfileIMG} className="text-white">
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
export default EditProfilePhoto;
