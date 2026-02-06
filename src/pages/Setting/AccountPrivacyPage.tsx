import React from "react";
import Footer from "../Footer";

export default function AccountPrivacyPage() {
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto h-100">
        <h1 className="text-xl font-semibold mb-8">Account privacy</h1>
        <div className="flex items-center justify-between border rounded-xl p-4">
          <span className="font-semibold">Private account</span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        <p className="text-[12px] mt-3 text-gray-400">
          When your account is public, your profile and posts can be seen by
          anyone, on or off Instagram, even if they don't have an Instagram
          account.
        </p>
        <p className="text-[12px] mt-3 text-gray-400">
          When your account is private, only the followers you approve can see
          what you share, including your photos or videos on hashtag and
          location pages, and your followers and following lists. Certain info
          on your profile, like your profile picture and username, is visible to
          everyone on and off Instagram.{" "}
          <span className="text-blue-800">Learn more</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}
