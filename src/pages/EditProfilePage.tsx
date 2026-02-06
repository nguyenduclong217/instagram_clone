import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  MessageCircle,
  Heart,
  User,
  Infinity,
  UserRound,
  ShieldCheck,
  NotepadText,
  Bell,
  Lock,
  CircleStar,
  Ban,
  CircleSlash2,
  Send,
  AtSign,
  Repeat,
  //   MessageCircle,
  UserRoundX,
  ALargeSmall,
  BellOff,
  Images,
  HeartOff,
  Crown,
  ArrowDownToLine,
  PersonStanding,
  Languages,
  Laptop,
  House,
  SquareKanban,
  CircleCheck,
  CircleQuestionMark,
  //   ShieldCheck,
  CircleStop,
} from "lucide-react";
import { useState } from "react";
export default function EditProfilePage() {
  return (
    <div className="w-81">
      <Sidebar collapsible="icon" className="ml-21 w-90">
        <SidebarContent className="px-4 w-[92%] mx-auto mt-3">
          <SidebarMenu>
            <h1 className="text-center py-4 font-semibold text-[25px]">
              Settings
            </h1>

            <div className="w-[95%] mx-auto p-3 flex flex-col gap-2 border rounded-sm">
              <div className="flex gap-2">
                <Infinity className="text-blue-600" size={30} />
                <h1>Meta</h1>
              </div>
              <h1 className="font-semibold text-[20px]">Account Center</h1>
              <p className="text-[12px] text-gray-400">
                Manage your connected experiences and account settings across
                Meta technologies
              </p>
              <div className="flex gap-2">
                <UserRound size={17} className="text-gray-400" />
                <h1 className="text-[13px] text-gray-400">Personal details</h1>
              </div>
              <div className="flex gap-2">
                <ShieldCheck size={17} className="text-gray-400" />
                <h1 className="text-[13px] text-gray-400">
                  Password and security
                </h1>
              </div>
              <div className="flex gap-2">
                <NotepadText size={17} className="text-gray-400" />
                <h1 className="text-[13px] text-gray-400">Ad preferences</h1>
              </div>
            </div>
            {/* Home */}
            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              How to use Instagram
            </h1>
            <SidebarMenuItem>
              <NavLink to="/accounts/edit" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <User
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100`}
                    >
                      Edit profile
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            {/* Reels */}
            <SidebarMenuItem>
              <NavLink to="/accounts/notifications" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Bell
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Notification
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              Who can see your content
            </h1>

            {/* Search */}
            <SidebarMenuItem>
              <NavLink to="/accounts/account_privacy" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Lock
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Account privacy
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/accounts/close_friends" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <CircleStar
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Close Friend
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/accounts/blocked_accounts" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Ban
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Blocked
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/accounts/hide_story_and_live" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <CircleSlash2
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Hide story
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              How others can interact with you
            </h1>
            <SidebarMenuItem>
              <NavLink
                to="/accounts/messages_and_story_replies"
                className="block"
              >
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Send
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Message and story relies
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/accounts/tags_and_mentions" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <AtSign
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Tags and mentions
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/accounts/comments" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <MessageCircle
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Comment
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Repeat
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Share and reuse
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <UserRoundX
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Restricted accounts
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <ALargeSmall
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Restricted accounts
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              What you see
            </h1>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <BellOff
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Muted account
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Images
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Content preferences
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <HeartOff
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Like and share counts
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Crown
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Subscriptions
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              Your app and media
            </h1>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <ArrowDownToLine
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Archiving and downloading
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <PersonStanding
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Accessibility
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Languages
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Language
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/" className="block">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center w-7">
                      <Laptop
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-group-hover:opacity-100`}
                    >
                      Website permission
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              Family Center
            </h1>
            {/* Explore */}
            <SidebarMenuItem>
              <NavLink to="/explore">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <House
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100`}
                    >
                      Supervision for Teens Account
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              For professionals
            </h1>

            <SidebarMenuItem>
              <NavLink to="/explore">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <SquareKanban
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100`}
                    >
                      Account type and tools
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <h1 className="text-gray-500 text-[12px] ml-4 font-semibold">
              More info and support
            </h1>

            <SidebarMenuItem>
              <NavLink to="/explore">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <CircleStop
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100`}
                    >
                      Help
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/explore">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <ShieldCheck
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100`}
                    >
                      Privacy Center
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <NavLink to="/explore">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <CircleQuestionMark
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100`}
                    >
                      Help
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NavLink to="/explore">
                {({ isActive }) => (
                  <SidebarMenuButton
                    className={isActive ? "bg-muted font-semibold" : ""}
                  >
                    <div className="flex items-center justify-center">
                      <User
                        className={`size-7 ${isActive ? "text-black" : "text-gray-700"}`}
                      />
                    </div>
                    <span
                      className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100`}
                    >
                      Account Status
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            {/* Message */}

            {/* More */}
            <div className="mt-1">
              {/* <SidebarMenuItem>
                <SidebarMenuButton>
                  <div className="flex items-center justify-center">
                    <Menu className="size-7" />
                  </div>
                  <span
                    className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                  >
                    More
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}

              {/* <SidebarMenuItem>
                <SidebarMenuButton>
                  <div className="flex items-center justify-center">
                    <LayoutDashboard className="size-7" />
                  </div>

                  <span
                    className={`ml-3 whitespace-nowrap transition-opacity duration-200 opacity-0group-hover:opacity-100${openCreate ? "opacity-100" : ""}`}
                  >
                    Also from meta
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </div>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
