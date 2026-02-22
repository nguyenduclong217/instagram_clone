import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook } from "lucide-react";
import toast from "react-hot-toast";
import * as z from "zod";

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
  password: z
    .string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự" })
    .regex(/[a-z]/, {
      message: "Mật khẩu phải có chữ thường",
    })
    .regex(/[A-Z]/, {
      message: "Mật khẩu phải có chữ hoa",
    })
    .regex(/[0-9]/, {
      message: "Mật khẩu phải có số",
    }),
});
type LoginFormValues = {
  email: string;
  password: string;
};

import Footer from "./Footer";
import { handleLogin } from "@/service/authServices";
import { useNavigate } from "react-router-dom";
import { userAuthStore } from "@/types/user.type";
// import { useAuthStore } from "@/stores/infoUser";

// import { initSocket } from "@/socket-server/socket";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await handleLogin(data.email, data.password);
      console.log(response);
      userAuthStore.getState().setUser(response.data.user);
      localStorage.setItem("access_token", response.data.tokens.accessToken);
      localStorage.setItem("refresh_token", response.data.tokens.refreshToken);
      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        void navigate("/");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="w-[900px] mx-auto h-[500px] mt-7 flex justify-between">
        <div className="w-[56%] flex">
          <img
            src="data:image/jpeg;base64,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"
            alt=""
          />
        </div>
        <div className="w-[40%]">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
            alt=""
            className="w-40 mt-12 mb-5 mx-auto"
          />

          {/* Form */}
          <form
            className="w-full flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)(e);
            }}
          >
            {/* User Name */}
            <div className="flex justify-center flex-col gap-2">
              <input
                type="text"
                placeholder="Username or email"
                className="w-[80%] px-3 py-2 border mx-auto border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                {...register("email")}
              />
              {errors.email?.message !== undefined && (
                <span className="text-red-600 text-sm ml-10">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex justify-center flex-col gap-2 ">
              <input
                type="password"
                placeholder="Password"
                className="w-[80%] px-3 py-2 border mx-auto border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400 "
                {...register("password")}
              />
              {errors.password?.message !== undefined && (
                <span className="text-red-600 text-sm ml-10">
                  {errors.password.message}
                </span>
              )}
            </div>
            <Button
              className="w-[80%] disabled:bg-blue-400 mx-auto bg-blue-400 hover:bg-blue-500"
              disabled={!isValid}
            >
              Login
            </Button>
          </form>

          <div className="relative mt-6">
            <p className="w-[80%] h-[1px] bg-gray-400 mx-auto mt-4"></p>
            <span className="px-3 text-gray-700 bg-white absolute left-1/2 -translate-x-1/2 -top-3 text-sm">
              OR
            </span>
          </div>

          <div className="mt-5">
            <div className="flex justify-center gap-2 cursor-pointer">
              <Facebook className="bg-blue-700 text-white w-6 rounded-full h-6" />
              <h1 className="text-blue-600 font-semibold">
                Log in with Facebook
              </h1>
            </div>
            <h1
              onClick={() => void navigate(`/forgot-password`)}
              className="mt-4 text-center cursor-pointer hover:underline"
            >
              Forgot password?
            </h1>
            <h1 className="text-center mt-3">
              Don't have an account?{" "}
              <span
                onClick={() => void navigate(`/accounts/emailSignup`)}
                className="text-blue-600 font-semibold cursor-pointer"
              >
                Sign up
              </span>
            </h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
