import React from "react";
import Footer from "../Footer";
import { ChevronRight } from "lucide-react";
export default function HideStory() {
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto h-110 ">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Hide story and live</h1>
        </div>
        <div className="border rounded-2xl overflow-hidden bg-white mt-9">
          {/* Item */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer">
            <h1 className="font-semibold text-sm">Hide Story and live from</h1>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
