import React, { useState } from "react";
import { MoveLeft, EyeOff, ChevronRight, UserRoundCheck } from "lucide-react";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function RequestsPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex">
      <div className="w-[400px] border-r h-screen relative">
        <div className="flex mt-8 items-center gap-2">
          <MoveLeft size={30} className="cursor-pointer" />
          <h1 className="text-[25px] font-semibold">Message requests</h1>
        </div>

        <div className="flex items-center gap-3 mt-3 hover:bg-gray-100 cursor-pointer p-1">
          <EyeOff className="w-18 h-14 p-3 bg-gray-100 rounded-full" />
          <h1>Hidden Request</h1>
          <ChevronRight className="ml-50" />
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
          <UserRoundCheck
            size={90}
            className="border border-black rounded-full p-3"
          />
          <h1 className="font-semibold">Message requests</h1>
          <p className=" text-gray-400 text-center w-140">
            These messages are from people you've restricted or don't follow.
            They won't know you viewed their request until you allow them to
            message you
          </p>
        </div>
      </div>
    </div>
  );
}
