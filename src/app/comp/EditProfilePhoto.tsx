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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialog}>
      <DialogContent className="sm:max-w-[425px] min-h-96">
        <DialogHeader className="h-7">
          <DialogTitle>Edit</DialogTitle>
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

          <button onClick={uploadImages}>Upload</button>
          <button onClick={EditTheProfileIMG}>post</button>

          <div className="mt-4 text-center">
            <p></p>
            {uploadedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className="max-w-full h-[300px] rounded-lg shadow-lg"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default EditProfilePhoto;
