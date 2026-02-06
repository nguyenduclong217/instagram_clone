import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="w-full bg-white py-6 text-center text-xs text-gray-500">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
          <a href="#" className="hover:underline">
            Meta
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Blog
          </a>
          <a href="#" className="hover:underline">
            Jobs
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            API
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Locations
          </a>
          <a href="#" className="hover:underline">
            Instagram Lite
          </a>
          <a href="#" className="hover:underline">
            Meta AI
          </a>
          <a href="#" className="hover:underline">
            Threads
          </a>
          <a href="#" className="hover:underline">
            Contact Uploading & Non-Users
          </a>
          <a href="#" className="hover:underline">
            Meta Verified
          </a>
        </div>

        {/* Bottom */}
        <div className="mt-4 flex justify-center items-center gap-4">
          <button className="flex items-center gap-1 hover:underline">
            English
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 7l4.5 4.5L14.5 7" />
            </svg>
          </button>

          <span>© 2026 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
}
