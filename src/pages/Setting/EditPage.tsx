import { useState } from "react";
import Footer from "../Footer";
import { useAuthStore } from "@/stores/infoUser";

export default function EditPage() {
  const [gender, setGender] = useState("Prefer not to say");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const user = useAuthStore((s) => s.user);
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto">
        <h1 className="text-xl font-semibold mb-8">Edit profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
              <img src={user?.profilePicture} alt="" />
              {/* <span className="text-gray-500 text-xl">👤</span> */}
            </div>
            <div>
              <p className="font-semibold">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.fullName}</p>
            </div>
          </div>
          <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
            Change Picture
          </button>
        </div>

        {/* Website */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">Website</label>
          <input
            disabled
            placeholder="Website"
            className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Editing your links is only available on mobile. Visit the Instagram
            app and edit your profile to change the websites in your bio.
          </p>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">Bio</label>
          <textarea
            placeholder="Bio"
            maxLength={150}
            rows={3}
            className="w-full border rounded-lg px-4 py-2 resize-none"
          />
          <div className="text-right text-xs text-gray-400 mt-1">0 / 150</div>
        </div>

        {/* Threads badge */}
        <div className="flex items-center justify-between border rounded-xl p-4">
          <span className="font-semibold">Show Threads badge</span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        <div>
          <label className="block font-semibold mb-2">Gender</label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            <option>Prefer not to say</option>
            <option>Male</option>
            <option>Female</option>
            <option>Custom</option>
          </select>

          <p className="text-xs text-gray-500 mt-2">
            This won’t be part of your public profile.
          </p>
        </div>

        {/* Account suggestions */}
        <div className="border rounded-2xl p-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold mb-1">
              Show account suggestions on profiles
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Choose whether people can see similar account suggestions on your
              profile, and whether your account can be suggested on other
              profiles.
            </p>
          </div>

          {/* Toggle */}
          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              checked={showSuggestions}
              onChange={() => setShowSuggestions(!showSuggestions)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-500">
          Certain profile info, like your name, bio and links, is visible to
          everyone.{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            See what profile info is visible
          </span>
        </p>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            disabled
            className="bg-blue-300 text-white font-semibold px-10 py-3 rounded-xl cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
