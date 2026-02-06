import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Footer from "../Footer";
export default function TagsPage() {
  const [tagOption, setTagOption] = useState("following");
  const [mentionOption, setMentionOption] = useState("following");

  const RadioItem = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between py-3 cursor-pointer">
      <span className="text-sm">{label}</span>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-black"
      />
    </label>
  );
  return (
    <div className="mt-17">
      <div className="w-[80%] mx-auto">
        {/* Title */}
        <h1 className="text-lg font-semibold">Tags and mentions</h1>

        {/* Who can tag you */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Who can tag you</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Choose who can tag you in their photos and videos. When people try
            to tag you, they'll see if you don't allow tags from everyone.
          </p>

          <p className="text-xs text-gray-500">
            You currently have Limited interactions turned on, which means some
            people can't tag or mention you.
          </p>

          <div className="border rounded-2xl px-4">
            <RadioItem
              label="Allow tags from everyone"
              checked={tagOption === "everyone"}
              onChange={() => setTagOption("everyone")}
            />

            <RadioItem
              label="Allow tags from people you follow"
              checked={tagOption === "following"}
              onChange={() => setTagOption("following")}
            />

            <RadioItem
              label="Don't allow tags"
              checked={tagOption === "none"}
              onChange={() => setTagOption("none")}
            />
          </div>

          {/* Manual approve */}
          <div className="border rounded-2xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
            <span className="text-sm">Manually approve tags</span>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>

        {/* Who can mention you */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Who can @mention you</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Choose who can @mention you to link your account in their stories,
            notes, comments, live videos, bio, and captions. When people try to
            @mention you, they'll see if you don't allow @mentions.
          </p>

          <div className="border rounded-2xl px-4">
            <RadioItem
              label="Allow mentions from everyone"
              checked={mentionOption === "everyone"}
              onChange={() => setMentionOption("everyone")}
            />

            <RadioItem
              label="Allow mentions from people you follow"
              checked={mentionOption === "following"}
              onChange={() => setMentionOption("following")}
            />

            <RadioItem
              label="Don't allow mentions"
              checked={mentionOption === "none"}
              onChange={() => setMentionOption("none")}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
