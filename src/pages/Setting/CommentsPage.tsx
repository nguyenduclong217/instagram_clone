import { useState } from "react";
import Footer from "../Footer";

export default function CommentsPage() {
  const [commentPermission, setCommentPermission] = useState("everyone");
  const [allowGif, setAllowGif] = useState(true);

  const Option = ({ value, label, sub }) => (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="radio"
        name="comments"
        checked={commentPermission === value}
        onChange={() => setCommentPermission(value)}
        className="mt-1 h-4 w-4 accent-black"
      />
      <div>
        <p className="text-sm">{label}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </label>
  );

  return (
    <div className="mt-17">
      {/* Title */}
      <div className="w-[80%] mx-auto h-110">
        <h1 className="text-lg font-semibold">Comments</h1>

        {/* Allow comments from */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Allow comments from</h2>

          <div className="space-y-4 pl-1">
            <Option value="everyone" label="Everyone" />
            <Option
              value="following"
              label="People you follow"
              sub="61 People"
            />
            <Option value="followers" label="Your followers" sub="25 People" />
            <Option
              value="both"
              label="People you follow and your followers"
              sub="62 People"
            />
            <Option value="off" label="Off" />
          </div>
        </div>

        {/* Allow GIF comments */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-sm font-semibold">Allow GIF comments</h2>
            <p className="text-xs text-gray-500 mt-1">
              People will be able to comment GIFs on your posts and reels.
            </p>
          </div>

          {/* Toggle */}
          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              checked={allowGif}
              onChange={() => setAllowGif(!allowGif)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
      </div>
      <Footer />
    </div>
  );
}
