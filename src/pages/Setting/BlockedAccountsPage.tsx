import { ChevronLeft } from "lucide-react";
import Footer from "../Footer";
export default function BlockedAccountsPage() {
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto h-110 ">
        <div className="flex items-center gap-2">
          <ChevronLeft />
          <h1 className="text-xl font-semibold">Blocked accounts</h1>
        </div>
        <p className="mt-6 text-[14px] text-gray-400">
          You can block people anytime from their profiles.
        </p>
      </div>
      <Footer />
    </div>
  );
}
