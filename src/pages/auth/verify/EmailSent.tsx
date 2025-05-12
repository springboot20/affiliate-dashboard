import { useAppSelector } from "@/app/hook";
import sentMail from "@/assets/image-sent.png";
import { useNavigate } from "react-router-dom";

export const EmailSentMessage = () => {
  const navigate = useNavigate();

  const {
    user: { email },
  } = useAppSelector((state) => state.auth.data);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center flex-col max-w-xl bg-white p-6 shadow-sm rounded-2xl border">
        <div className="">
          <img src={sentMail} className="h-24" alt="email sent icon" />
        </div>

        <div className="mx-auto text-center flex flex-col gap-6 mt-4">
          <div className="space-y-6">
            <h2 className="text-2xl text-gray-800 font-semibold">Please verify your email</h2>
            <p className="text-xl font-medium text-gray-700">
              You're almost there! We sent an email to <span className="text-base">{email}</span>
            </p>
          </div>

          <div>
            <p className="text-lg text-gray-800">
              Just click on the link in that email to complete your signup. If you don't see it, you
              may need to <span className="text-gray-800 font-bold">check you spam</span>
            </p>
          </div>

          <div className="mx-auto">
            <p>Still can't find the email? No problem</p>
            <button
              onClick={async () => {
                await Promise.resolve(setTimeout(() => navigate("/auth/send-email"), 2000));
              }}
              className="py-2.5 px-4 rounded-md capitalize bg-gray-800 focus:outline-none text-white mt-2"
            >
              resend verification email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
