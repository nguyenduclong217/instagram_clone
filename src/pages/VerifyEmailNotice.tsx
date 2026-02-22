import { handleResendEmail, handleVerifyEmail } from "@/service/authServices";
import { useResendStore } from "@/service/resend";
import { useRegisterStore } from "@/stores/authStore";
import { Mail } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

type FormValues = {
  token: string;
};

export default function VerifyEmailNotice() {
  const email = useRegisterStore.getState().email;
  const { cooldown, isDisabled, startCooldown, tick } = useResendStore();


  const handleResend = async (email: string) => {
    try {
      await handleResendEmail(email);
      startCooldown(20);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isDisabled) return;

    const timer = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [isDisabled, tick]);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  // console.log(email);
  // console.log(token);
  useEffect(() => {
    if (token === undefined) return;

    const verify = async () => {
      try {
        await handleVerifyEmail(token);
        toast.success("Email verified successfully");
        setTimeout(() => navigate("/login"), 2000);
      } catch {
        toast.error("Xác nhận email thất bại");
      }
    };

    verify();
  }, [token, navigate]);

  const { handleSubmit } = useForm<FormValues>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)(e);
        }}
        className="max-w-md w-full bg-white shadow-md rounded-2xl p-8 text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Mail size={40} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-3">Xác nhận email của bạn</h1>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          Chúng tôi đã gửi một email xác nhận đến địa chỉ email của bạn. Vui
          lòng kiểm tra hộp thư (và cả mục spam) để hoàn tất đăng ký.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              if (email === null) return;
              void handleResend(email);
            }}
            disabled={isDisabled}
            className="w-full py-2  rounded-lg bg-blue-500 disabled:bg-blue-400 text-white hover:bg-blue-600 transition"
          >
            {isDisabled ? `Gửi lại sau ${cooldown}s` : "Gửi lại email"}
          </button>

          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Quay lại trang đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
