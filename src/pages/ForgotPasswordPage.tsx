import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Footer from "./Footer";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleResetPassword } from "@/service/authServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email không được để trống",
    })
    .pipe(
      z.email({
        message: "Email không đúng định dạng",
      }),
    ),
});

export default function ForgotPasswordPage() {
  type ForgotPasswordPage = {
    email: string;
  };
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<ForgotPasswordPage> = async (data) => {
    try {
      await handleResetPassword(data.email);
      toast.success("Đã gửi email khôi phục mật khẩu");
    } catch (error) {
      console.log(error);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordPage>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  return (
    <div>
      <div className="border-b border-gray-300 sticky bg-white top-0 left-0 w-full">
        <div className="w-[900px] mx-auto p-2 flex items-center justify-between">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
            alt=""
            className="w-35 "
          />
          <div>
            <Button className="bg-blue-600 text-white hover:bg-blue-500 cursor-pointer">
              Log In
            </Button>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:underline hover:bg-transparent active:bg-transparent cursor-pointer"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <div className="w-100 border my-10 mx-auto">
        <form
          className="p-7  flex flex-col justify"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)(e);
          }}
        >
          <div className="rounded-full border w-fit mx-auto">
            <Lock size={100} className="p-3" />
          </div>
          <div className="mt-6">
            <h1 className="text-center font-semibold">Trouble logging in?</h1>
            <p className="mt-3 text-center text-gray-500">
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </p>
            <div className="flex justify-center mt-4 flex-col gap-2">
              <input
                type="email"
                placeholder="Username or email"
                className="w-[100%] px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                {...register("email")}
              />
              {errors.email?.message !== undefined && (
                <span className="text-red-600 text-sm ml-2">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          <Button
            disabled={!isValid}
            className="mt-3 bg-blue-600 disabled:bg-blue-500 hover:bg-blue-400"
          >
            Send Login Link
          </Button>
          <p className="text-[14px] mt-3 text-center text-blue-600">
            Can't reset your password
          </p>

          <div className="relative mt-6">
            <p className="w-[80%] h-[1px] bg-gray-400 mx-auto mb-1"></p>
            <span className="px-3 text-gray-700 bg-white absolute left-1/2 -translate-x-1/2 -top-3 text-sm">
              OR
            </span>

            {/* Create new account */}
            <p
              onClick={() => void navigate(`/accounts/emailSignup`)}
              className="font-semibold mt-3 text-center hover:underline"
            >
              Create new account
            </p>
          </div>
        </form>
        <Button
          onClick={() => void navigate(`/login`)}
          variant="ghost"
          className="mt-30 w-[100%] bg-gray-100 border-t hover:underline rounded-none"
        >
          Back to login
        </Button>
      </div>
      <Footer />
    </div>
  );
}
