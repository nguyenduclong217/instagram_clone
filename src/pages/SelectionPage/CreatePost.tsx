import React, { useState, useRef } from "react";
import { Images, SquarePlay } from "lucide-react";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
// import * as z from "zod";
// import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { createPost } from "@/service/postServices";
import toast from "react-hot-toast";
// import { zodResolver } from "@hookform/resolvers/zod";

// const schema = z.object({
//   file: z.instanceof(File, { message: "Vui lòng chọn ảnh hoặc video" }),

//   caption: z.string().max(2200, "Caption tối đa 2200 ký tự").optional(),
// });
// type Post = z.infer<typeof schema>;
export default function CreatePost() {
  //   const {
  //     register,
  //     handleSubmit,
  //     setValue,
  //     formState: { errors, isValid },
  //   } = useForm<Post>({
  //     resolver: zodResolver(schema),
  //     mode: "onChange",
  //   });

  //   const onSubmit: SubmitHandler<Post> = async (data) => {
  //     console.log(data);
  //   };
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const previewUrl = file ? URL.createObjectURL(file) : null;

  const fileRef = useRef(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!file) {
      toast.error("Vui lòng chọn ảnh hoặc video");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    try {
      await createPost(accessToken, formData);
      toast.success("Đăng bài thành công 🎉");
      resetForm();
    } catch {
      toast.error("Đăng bài thất bại");
    }
  };
  const resetForm = () => {
    setFile(null);
    setCaption("");
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="px-3 py-2 hover:bg-gray-100 rounded flex justify-between">
            <span>Post</span>
            <Images />
          </button>
        </DialogTrigger>
        <DialogContent className="w-150 h-120">
          {!file ? (
            <div className="m-2 flex flex-col rounded-xl bg-white shadow-md">
              <h1 className="p-4 text-center text-lg font-semibold">
                Tạo bài viết
              </h1>
              <hr />

              <div className="flex flex-col items-center justify-center gap-4 py-16 h-full">
                <div className="flex gap-10 text-gray-400">
                  <Images
                    size={70}
                    className="hover:text-black transition-colors"
                  />
                  <SquarePlay
                    size={70}
                    className="hover:text-black transition-colors"
                  />
                </div>

                <h1 className="text-base font-medium text-gray-700">
                  Tải ảnh và video vào đây
                </h1>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  //   {...register("profilePicture")}
                  ref={fileRef}
                  onChange={handleFileChange}
                />

                <Button
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 rounded-lg px-6 py-2 text-sm font-semibold"
                >
                  Chọn từ máy tính
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full w-full">
              {/* PREVIEW */}
              <form
                // onSubmit={handleSubmit(onSubmit)}
                className="w-full bg-black flex items-center justify-center max-h-[400px]"
              >
                {file.type.startsWith("image") ? (
                  <img
                    src={previewUrl!}
                    alt="preview"
                    className="max-h-[400px] w-full object-contain"
                  />
                ) : (
                  <video
                    src={previewUrl!}
                    controls
                    className="max-h-[400px] w-full"
                  />
                )}
              </form>

              <div className="flex flex-col gap-3 p-4 border-t">
                <div>
                  <input
                    placeholder="Viết chú thích..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="resize-none w-[80%] px-2 py-3 text-sm outline-none"
                  />
                  <Button className="ml-4 w-20" onClick={() => resetForm()}>
                    Hủy
                  </Button>
                </div>

                <Button onClick={handleSubmit} className="self-end px-6">
                  Đăng bài
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
