import React from "react";
import Footer from "../Footer";
import { ChevronRight } from "lucide-react";

export default function MessagesAndStoryPage() {
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto h-110 ">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Messages and story replies</h1>
        </div>
        <p className="font-semibold text-[15px] my-10">
          How people can reach you
        </p>
        <div className="border rounded-2xl overflow-hidden bg-white">
          {/* Item */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer">
            <h1 className="font-semibold text-sm">Message controls</h1>
            <ChevronRight size={18} className="text-gray-400" />
          </div>

          <div className="h-px bg-gray-200 mx-5" />

          {/* Item */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer">
            <h1 className="font-semibold text-sm">Story relies</h1>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
        <p className="font-semibold text-[15px] my-10">
          Who can see you're online
        </p>
        <div className="border rounded-2xl overflow-hidden bg-white">
          {/* Item */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer">
            <h1 className="font-semibold text-sm">Show active status</h1>
            <ChevronRight size={18} className="text-gray-400" />
          </div>

          <div className="h-px bg-gray-200 mx-5" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
