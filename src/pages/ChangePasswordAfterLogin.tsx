import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { changePassword } from "@/service/authServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Mật khẩu hiện tại bắt buộc phải nhập",
    }),
    newPassword: z
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
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Mật khẩu không khớp",
        code: "custom",
      });
    }
    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        message: "Mật khẩu mới không trùng với mật khẩu hiện tại",
        code: "custom",
      });
    }
  });

type ChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export default function ChangePasswordAfterLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ChangePassword>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ChangePassword> = async (data) => {
    try {
      await changePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmPassword,
      );
      toast.success("Đổi mật khẩu thành công");
      setTimeout(() => {
        void navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
        className="w-[380%] max-w-sm bg-black/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800"
      >
        <h2 className="text-white text-xl font-semibold text-center mb-6">
          Đặt mật khẩu mới
        </h2>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mật khẩu hiện tại"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
              {...register("currentPassword")}
            />
            {errors.currentPassword?.message !== undefined && (
              <span className="text-red-600 text-sm ml-3">
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
              {...register("newPassword")}
            />
            {errors.newPassword?.message !== undefined && (
              <span className="text-red-600 text-sm ml-3">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword?.message !== undefined && (
              <span className="text-red-600 text-sm ml-3">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="mt-6 w-full py-3 rounded-lg bg-indigo-600 disabled:bg-indigo-300 hover:bg-indigo-700 text-white font-medium transition"
        >
          Đặt lại mật khẩu
        </button>
      </form>
    </div>
  );
}
