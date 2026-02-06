import { MoveLeft, EyeOff } from "lucide-react";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function HiddenPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex">
      <div className="w-[400px] border-r h-screen relative">
        <div className="flex mt-8 items-center gap-2">
          <MoveLeft size={30} className="cursor-pointer" />
          <h1 className="text-[25px] font-semibold">Hidden requests</h1>
        </div>

        <p className="mt-3 w-90 text-gray-400">
          Chats will appear here after you send or receive a message
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="text-red-600 w-full rounded-2 border-t p-3 absolute bottom-0 cursor-pointer">
              Delete all 0
            </button>
          </DialogTrigger>
          <DialogContent className="w-120 gap-0" showCloseButton={false}>
            <div className="p-4 flex justify-center items-center flex-col">
              <h1 className="text-[20px]">Delete messages?</h1>
              <p className="text-[16px] text-gray-400">
                These 0 messages will be deleted
              </p>
            </div>
            <DialogTitle
              className="border-t font-semibold text-red-500"
              onClick={() => setOpen(false)}
            >
              Delete
            </DialogTitle>
            <DialogTitle className="border-none" onClick={() => setOpen(false)}>
              Close
            </DialogTitle>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-[70%] ">
        <div className="w-160 flex flex-col justify-center items-center gap-3 h-screen w-full">
          <EyeOff size={90} className="border border-black rounded-full p-3" />
          <h1 className="font-semibold">Hidden requests</h1>
          <p className=" text-gray-400 text-center w-140">
            These are message requests that may be offensive or unwanted.
          </p>
        </div>
      </div>
    </div>
  );
}
