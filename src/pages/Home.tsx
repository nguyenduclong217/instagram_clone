import { Button } from "@/components/ui/button";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAuthStore } from "@/stores/infoUser";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  ArrowRightLeft,
  Send,
  Bookmark,
  Annoyed,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import instance from "./utils/axios";
import Listpost from "./SelectionPage/Listpost";
import ListUserUnFollow from "./SelectionPage/ListUserUnFollow";
import { searchUser } from "@/service/search";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  console.log(user);
  // list user

  return (
    <div className="flex ml-20 w-[90%] h-full">
      <div className="pt-4 w-[660px]">
        {/* ListAvt User */}
        <div className="flex gap-3">
          <div>
            <div className="border-3 border-gray-500 rounded-full cursor-pointer">
              <img
                src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                className="w-20 h-20 rounded-full p-1"
                alt=""
              />
            </div>
            <h1 className="text-center text-[12px]">Mèo meoo</h1>
          </div>
        </div>

        {/* ListPost */}
        <div>
          <Listpost />
          <div className="w-[500px] mx-auto mt-10 ">
            {/* Name User Post */}
            <div className="flex items-center px-3 justify-between">
              {/* Avatar user */}
              <div className="flex items-center cursor-pointer">
                <img
                  src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                  className="w-12 h-12 rounded-full p-1"
                  alt=""
                />
                <h1 className="ml-3 font-bold text-[12px]">
                  Đừng nhắc tên tôi -
                  <span className="text-gray-400 font-normal">1ddd</span>
                </h1>
              </div>

              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal />
                    </Button>
                  </DialogTrigger>
                  <DialogContent showCloseButton={false} className="w-100">
                    <DialogHeader>
                      <DialogTitle className="font-bold text-red-600">
                        Report
                      </DialogTitle>
                      <DialogTitle className="font-bold text-red-600">
                        Unfollow
                      </DialogTitle>
                      <DialogTitle>Add to favorites</DialogTitle>
                      <DialogTitle>Go to post</DialogTitle>
                      <DialogTitle>Share to...</DialogTitle>
                      <DialogTitle>Copy link </DialogTitle>
                      <DialogTitle>Embed</DialogTitle>
                      <DialogTitle>About this accounts</DialogTitle>
                      <DialogTitle className="border-none">Cancel</DialogTitle>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Img post */}
            <img
              src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
              alt=""
              className="mt-3 rounded-sm"
            />
            <div>
              <div className="flex gap-3 mt-4 px-3 justify-between">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Heart
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                    <span>19N</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-1 cursor-pointer group">
                          <MessageCircle
                            className="transition-transform duration-200 group-hover:scale-110"
                            size={20}
                          />
                          <span>19</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[80%] h-[80%] flex">
                        <img
                          src="https://laputafarm.com/wp-content/uploads/2024/06/Cho-ngao-bo-2.jpg"
                          alt=""
                          className="w-[50%] h-[80%] my-auto"
                        />
                        <div className="w-[45%]">
                          <div className="flex items-center px-3 justify-between border-b border-b-gray-500 ">
                            {/* Avatar user */}
                            <div className="flex items-center cursor-pointer py-3 ">
                              <img
                                src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                                className="w-12 h-12 rounded-full p-1"
                                alt=""
                              />
                              <h1 className="ml-3 font-bold text-[12px]">
                                Đừng nhắc tên tôi
                              </h1>
                            </div>

                            <div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline">
                                    <MoreHorizontal />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent
                                  showCloseButton={false}
                                  className="w-100"
                                >
                                  <DialogHeader>
                                    <DialogTitle className="font-bold text-red-600">
                                      Report
                                    </DialogTitle>
                                    <DialogTitle className="font-bold text-red-600">
                                      Unfollow
                                    </DialogTitle>
                                    <DialogTitle>Add to favorites</DialogTitle>
                                    <DialogTitle>Go to post</DialogTitle>
                                    <DialogTitle>Share to...</DialogTitle>
                                    <DialogTitle>Copy link </DialogTitle>
                                    <DialogTitle>Embed</DialogTitle>
                                    <DialogTitle>
                                      About this accounts
                                    </DialogTitle>
                                    <DialogTitle className="border-none">
                                      Cancel
                                    </DialogTitle>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          {/* List Comment */}
                          <div className="ml-2 overflow-y-auto h-[57%]">
                            {/* Tag1 */}
                            <div className="flex items-center cursor-pointer mt-3">
                              <img
                                src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                                className="w-12 h-12 rounded-full p-1"
                                alt=""
                              />
                              <div className="ml-3">
                                <h1 className=" font-bold text-[12px]">
                                  Đừng nhắc tên tôi
                                </h1>
                                <div className="flex gap-2">
                                  <p className="text-[12px] text-gray-400">
                                    1W
                                  </p>
                                  <p className="text-[12px]  text-gray-400">
                                    2Like
                                  </p>
                                  <p className="text-[12px]  text-gray-400">
                                    Reply
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* Tag 2 */}
                            <div className="flex items-center cursor-pointer mt-3">
                              <img
                                src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                                className="w-12 h-12 rounded-full p-1"
                                alt=""
                              />
                              <div className="ml-3">
                                <h1 className=" font-bold text-[12px]">
                                  Đừng nhắc tên tôi
                                </h1>
                                <div className="flex gap-2">
                                  <p className="text-[12px] text-gray-400">
                                    1W
                                  </p>
                                  <p className="text-[12px]  text-gray-400">
                                    2Like
                                  </p>
                                  <p className="text-[12px]  text-gray-400">
                                    Reply
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="">
                              <div className="flex gap-3 border-t border-t-gray-400 py-2">
                                <Heart
                                  className="transition-transform duration-200 hover:scale-110"
                                  size={23}
                                />
                                <MessageCircle
                                  className="transition-transform duration-200 hover:scale-110"
                                  size={23}
                                />
                                <ArrowRightLeft
                                  className="transition-transform duration-200 hover:scale-110"
                                  size={23}
                                />
                                <Send
                                  className="transition-transform duration-200 hover:scale-110"
                                  size={23}
                                />
                                <Bookmark
                                  className="transition-transform duration-200 hover:scale-110 ml-80"
                                  size={23}
                                />
                              </div>
                              <div>
                                <h1 className="font-bold">9.526 likes</h1>
                                <p className="text-[13px] text-gray-400">
                                  May 12
                                </p>

                                <div className="flex py-3 border-t border-t-gray-400">
                                  <Annoyed />
                                  <input
                                    type="text"
                                    placeholder="Add comments.."
                                    className="outline-none ml-3  w-[80%]"
                                  />
                                  <h1>PUSH</h1>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <ArrowRightLeft
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                    <span>19</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Send
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <Bookmark
                    className="transition-transform duration-200 group-hover:scale-110"
                    size={20}
                  />
                </div>
              </div>
            </div>
            <h1 className="px-3">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </h1>
          </div>
          <div className="w-[500px] mx-auto mt-10 ">
            {/* Name User Post */}
            <div className="flex items-center px-3 justify-between">
              {/* Avatar user */}
              <div className="flex items-center cursor-pointer">
                <img
                  src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
                  className="w-12 h-12 rounded-full p-1"
                  alt=""
                />
                <h1 className="ml-3 font-bold text-[12px]">
                  Đừng nhắc tên tôi -
                  <span className="text-gray-400 font-normal">1W</span>
                </h1>
              </div>

              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal />
                    </Button>
                  </DialogTrigger>
                  <DialogContent showCloseButton={false} className="w-100">
                    <DialogHeader>
                      <DialogTitle className="font-bold text-red-600">
                        Report
                      </DialogTitle>
                      <DialogTitle className="font-bold text-red-600">
                        Unfollow
                      </DialogTitle>
                      <DialogTitle>Add to favorites</DialogTitle>
                      <DialogTitle>Go to post</DialogTitle>
                      <DialogTitle>Share to...</DialogTitle>
                      <DialogTitle>Copy link </DialogTitle>
                      <DialogTitle>Embed</DialogTitle>
                      <DialogTitle>About this accounts</DialogTitle>
                      <DialogTitle className="border-none">Cancel</DialogTitle>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Img post */}
            <img
              src="https://cafefcdn.com/zoom/700_438/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"
              alt=""
              className="mt-3 rounded-sm"
            />
            <div className="bg-white">
              <div className="flex gap-3 mt-4 px-3 justify-between">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Heart
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                    <span>19N</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <MessageCircle
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                    <span>19</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <ArrowRightLeft
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                    <span>19</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <Send
                      className="transition-transform duration-200 group-hover:scale-110"
                      size={20}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <Bookmark
                    className="transition-transform duration-200 group-hover:scale-110"
                    size={20}
                  />
                </div>
              </div>
            </div>
            <h1 className="px-3">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </h1>
          </div>
        </div>
      </div>
      <div className="pt-6 w-[360px] pl-20">
        {/* Avatar user */}

        <ListUserUnFollow />
      </div>
    </div>
  );
}
