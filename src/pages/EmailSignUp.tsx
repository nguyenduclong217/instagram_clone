import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook } from "lucide-react";
import Footer from "./Footer";
import * as z from "zod";
import { handleRegister } from "@/service/authServices";
import { useNavigate } from "react-router-dom";

type EmailSignUp = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  username: string;
};

const schema = z
  .object({
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
    confirmPassword: z.string().min(1, {
      message: "Nhập lại mật khẩu bắt buộc phải nhập",
    }),
    fullName: z
      .string()
      .min(3, {
        message: "Tên người dùng tối thiểu 3 kí tự",
      })
      .max(50, { message: "Họ và tên không quá 50 kí tự" })
      .regex(/^[A-Za-zÀ-ỹ\s]+$/, {
        message: "Họ và tên chỉ được chứa chữ cái",
      })
      .trim(),
    username: z
      .string()
      .min(3, {
        message: "Tên tối thiểu 3 kí tự",
      })
      .max(20, {
        message: "Tên người dùng tối đa 20 kí tự",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Chỉ được chứa chữ, số và dấu _",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export default function EmailSignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isValid, isSubmitting },
  } = useForm<EmailSignUp>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  console.log(isValid);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<EmailSignUp> = async (data) => {
    try {
      await handleRegister(
        data.email,
        data.username,
        data.password,
        data.confirmPassword,
        data.fullName,
      );
      navigate("/verify-email/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="my-8">
      <div className="border w-[400px]  mx-auto">
        <div className="w-[80%] mx-auto ">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
            alt=""
            className="w-40 my-10 mx-auto"
          />
          <p className="mt-3 text-center text-gray-500 w-60 mx-auto">
            Sign up to see photos and videos from your friends.
          </p>
          <Button className="flex bg-blue-600 justify-center gap-2 cursor-pointer w-[80%] mt-4 mx-auto hover:bg-blue-500">
            <Facebook className="bg-blue-700 text-white w-6 rounded-full h-6" />
            <h1 className="text-white font-semibold">Log in with Facebook</h1>
          </Button>
          <div className="relative mt-6">
            <p className="w-[80%] h-[1px] bg-gray-400 mx-auto mb-1"></p>
            <span className="px-3 text-gray-700 bg-white absolute left-1/2 -translate-x-1/2 -top-3 text-sm">
              OR
            </span>
          </div>
          <form
            className="my-6 flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex justify-center flex-col gap-2">
              <input
                type="email"
                placeholder="Mobile Number or Email"
                className="w-[80%] px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400 mx-auto"
                {...register("email")}
              />
              {errors?.email?.message && (
                <span className="text-red-600 text-sm ml-10">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex justify-center flex-col gap-2">
              <input
                type="password"
                placeholder="Password"
                className="w-[80%] px-3 py-2 border mx-auto border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                {...register("password")}
              />
              {errors?.password?.message && (
                <span className="text-red-600 text-sm ml-10">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="flex justify-center flex-col gap-2">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-[80%] px-3 py-2 border mx-auto border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                {...register("confirmPassword")}
              />
              {errors?.confirmPassword?.message && (
                <span className="text-red-600 text-sm ml-10">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <div className="flex justify-center flex-col gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="w-[80%] px-3 mx-auto py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                {...register("fullName")}
              />
              {errors?.fullName?.message && (
                <span className="text-red-600 text-sm ml-10">
                  {errors.fullName.message}
                </span>
              )}
            </div>
            <div className="flex justify-center flex-col gap-2">
              <input
                type="text"
                placeholder="Name User"
                className="w-[80%] mx-auto px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                {...register("username")}
              />
              {errors?.username?.message && (
                <span className="text-red-600 text-sm ml-10">
                  {errors.username.message}
                </span>
              )}
            </div>

            <p className="w-[80%] mx-auto text-[13px] text-center text-gray-400">
              People who use our service may have uploaded your contact
              information to Instagram.{" "}
              <span className="text-blue-500"> Learn More</span>
            </p>
            <p className="w-[80%] mx-auto text-[13px] text-center text-gray-400">
              By signing up, you agree to our{" "}
              <span className="text-blue-500">Terms , Privacy Policy</span> and
              <span className="text-blue-500">Cookies Policy</span> .
            </p>
            <Button
              disabled={!isValid || isSubmitting}
              className="text-white bg-blue-600 disabled:bg-blue-400  hover:bg-blue-500 w-[80%] mx-auto"
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>
        </div>
      </div>
      <div className="w-[400px] h-30 mx-auto border mt-9 flex flex-col justify-center items-center">
        <h1 className="mx-auto">Have an accounts?</h1>
        <button
          onClick={() => navigate(`/login`)}
          // disabled={!isValid}
          className="text-blue-600 disabled:bg-blue-300 font-semibold cursor-pointer"
        >
          Log in
        </button>
      </div>

      <Footer />
    </div>
  );
}
