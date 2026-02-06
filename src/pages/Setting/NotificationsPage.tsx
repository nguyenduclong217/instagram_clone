import React from "react";
import { ChevronRight } from "lucide-react";
import Footer from "../Footer";

export default function NotificationsPage() {
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto h-110">
        <h1 className="text-xl font-semibold mb-8">Notifications</h1>
        <div className="border rounded-2xl overflow-hidden bg-white">
          {/* Item */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer">
            <h1 className="font-semibold text-sm">Push notifications</h1>
            <ChevronRight size={18} className="text-gray-400" />
          </div>

          <div className="h-px bg-gray-200 mx-5" />

          {/* Item */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer">
            <h1 className="font-semibold text-sm">Email notifications</h1>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
