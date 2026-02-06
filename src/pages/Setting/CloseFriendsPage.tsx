import { ChevronLeft } from "lucide-react";
import Footer from "../Footer";
export default function CloseFriendsPage() {
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto h-110 ">
        <div className="flex items-center gap-2">
          <ChevronLeft />
          <h1 className="text-xl font-semibold">Close friends</h1>
        </div>
        <h1 className="text-[14px] text-gray-500 mt-4">
          We don't send notifications when you edit your close friends list. How
          it works.
        </h1>
        <input
          type="text"
          placeholder="Search... "
          className="px-3 py-1 bg-gray-100 outline-none rounded-sm w-full mt-3"
        />

        <div className="mt-3">
          <div className="flex items-center gap-4">
            <img
              src=""
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover bg-gray-200"
            />
            <div>
              <h1 className="font-semibold text-sm leading-tight">long</h1>
              <p className="text-sm text-gray-500">@longne</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
