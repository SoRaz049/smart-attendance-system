"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { toast } from "react-toastify";
import { Image, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type StudentFormData = {
  name: string;
  idNumber: string;
  email: string;
  phone: string;
  section: string;
  course: string;
  batch: number;
  dateOfBirth: string;
  contactNo: string;
  photo: File;
  guardianName: string;
  guardianContact: string;
};

export default function StudentRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm<StudentFormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedImage(file);
      setValue("photo", file);
      clearErrors("photo");
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    console.log(data);
    // return;
    try {
      setIsSubmitting(true);
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      let imageUrl = "";

      if (!selectedImage) {
        setError("photo", { message: "Photo is required" });
        return;
      }

      if (selectedImage) {
        if (!validImageTypes.includes(selectedImage.type)) {
          toast.error(
            "Invalid image type. Only JPEG, JPG, and PNG are allowed."
          );
          return;
        }

        const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
        const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

        // Compress image
        const compressionOptions = {
          maxSizeMB: 0.3,
          useWebWorker: true,
        };

        const compressedImage = await imageCompression(
          selectedImage,
          compressionOptions
        );

        // Upload to Cloudinary
        const imageFormData = new FormData();
        imageFormData.append("file", compressedImage);
        imageFormData.append("upload_preset", cloudinaryPreset!);
        imageFormData.append("api_key", "993734845948435");

        const uploadResponse = await axios.post(cloudinaryUrl!, imageFormData);
        if (uploadResponse.status === 200) {
          imageUrl = uploadResponse.data.secure_url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Prepare payload with image URL
      const dataPayload = {
        ...data,
        photoUrl: imageUrl,
      };

      // Submit the form
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/student`,
        dataPayload,
        {
          headers: {
            apiKey: 123456789,
          },
          withCredentials: true,
        }
      );
      console.log(response);

      if (response && response.status == 201) {
        toast.success("Student registered successfully");
        reset();
        router.push("/dashboard/students");
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error registering student");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* General Info */}
      <section className="border border-[#f5f5f5] p-4 rounded-lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Info</h3>
          <div className="flex lg:flex-row flex-col gap-4 w-full ">
            <div className="w-full">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                defaultValue={"Name 2"}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="flex lg:flex-row flex-col gap-4 w-full">
            <div className="w-full">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth", {
                  required: "Date of Birth is required",
                })}
                defaultValue={"2000-01-01"}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                {...register("idNumber", {
                  required: "ID Number is required",
                })}
                defaultValue={"1234567890"}
              />
              {errors.idNumber && (
                <p className="text-red-500 text-sm">
                  {errors.idNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="border  border-[#f5f5f5] p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Course Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <Label htmlFor="course">Course</Label>
            <Select
              {...register("course", { required: "Course is required" })}
              onValueChange={(value) => {
                setValue("course", value);
                clearErrors("course");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BScCSIT">BScCSIT</SelectItem>
                <SelectItem value="BBM">BBM</SelectItem>
                <SelectItem value="BCA">BCA</SelectItem>
                <SelectItem value="BIM">BIM</SelectItem>
                <SelectItem value="BIT">BIT</SelectItem>
                <SelectItem value="BBS">BBS</SelectItem>
              </SelectContent>
            </Select>
            {errors.course && (
              <p className="text-red-500 text-sm">{errors.course.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="section">Section</Label>
            <Select
              {...register("section", { required: "Section is required" })}
              onValueChange={(value) => {
                setValue("section", value);
                clearErrors("section");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
              </SelectContent>
            </Select>
            {errors.section && (
              <p className="text-red-500 text-sm">{errors.section.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="batch">Batch</Label>
            <Input
              id="batch"
              type="number"
              {...register("batch", { required: "Batch is required" })}
              defaultValue={"2024"}
            />
            {errors.batch && (
              <p className="text-red-500 text-sm">{errors.batch.message}</p>
            )}
          </div>
        </div>
      </section>
      {/* Contacts */}
      <section className="border border-[#f5f5f5] p-4 rounded-lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contacts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                defaultValue={"test@test.com"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                defaultValue={"0712345678"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guardianName">Guardian Name</Label>
              <Input
                id="guardianName"
                {...register("guardianName", {
                  required: "Guardian Name is required",
                })}
                defaultValue={"Guardian 1"}
              />
              {errors.guardianName && (
                <p className="text-red-500 text-sm">
                  {errors.guardianName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="guardianContact">Guardian Contact</Label>
              <Input
                id="guardianContact"
                {...register("guardianContact", {
                  required: "Guardian Contact is required",
                })}
                defaultValue={"0712345678"}
              />
              {errors.guardianContact && (
                <p className="text-red-500 text-sm">
                  {errors.guardianContact.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Photo Media */}
      <section className="border border-[#f5f5f5] p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Photo Media</h3>
        <Label htmlFor="photo">Upload Student's photo</Label>
        <div className="relative mt-4">
          {imagePreview ? (
            <div className="relative group w-40">
              <img
                src={imagePreview}
                alt="Selected Product"
                className="w-full aspect-square object-cover rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center p-1"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-gray-300 rounded">
              <p className="text-sm text-gray-500 mb-2">No image selected</p>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("image-input")?.click();
                }}
                className="bg-gray-50 hover:bg-gray-100 flex items-center gap-2"
              >
                <Image size={16} />
                Upload Image
              </Button>
            </div>
          )}
        </div>
        <Input
          type="file"
          {...register("photo")}
          accept="image/*"
          id="image-input"
          className="hidden"
          onChange={handleImageUpload}
        />
        {errors.photo && (
          <p className="text-red-500 mt-2 text-xs">{errors.photo.message}</p>
        )}
      </section>

      {/* Submit Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="w-full bg-blue hover:bg-blue/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Registering
              </>
            ) : (
              "Register Student"
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm Registration</DialogTitle>
          <DialogDescription>
            Are you sure you want to register this student?
          </DialogDescription>
          <DialogClose asChild>
            <DialogFooter>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                Confirm
              </Button>
              <Button variant="secondary">Cancel</Button>
            </DialogFooter>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </form>
  );
}
