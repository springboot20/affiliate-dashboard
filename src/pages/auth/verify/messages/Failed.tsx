import { EnvelopeIcon } from "@heroicons/react/24/outline";

export const EmailVerificationErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div>
      <div>
        <span className="flex items-center justify-center">
          <EnvelopeIcon className="h-14 fill-affiliate-green" aria-hidden={true} />
        </span>
      </div>
      <div className="">
        <p className="text-gray-700 text-xl">{message}</p>
      </div>
    </div>
  );
};