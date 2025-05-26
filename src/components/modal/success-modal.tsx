import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

type SuccessModalProps = {
  message: string | null;
  open: boolean;
  close: () => void;
};

export const SuccessModalComponent: React.FC<SuccessModalProps> = ({ open, message, close }) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog open={open} onClose={close} className="relative z-30">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="flex h-screen items-center justify-center">
                <DialogPanel className="p-4 bg-white rounded-md max-w-md w-full relative min-h-44">
                  <div className="max-w-full h-full">
                    <div className="flex h-7 items-center justify-end">
                      <button
                        type="button"
                        onClick={() => close()}
                        className="h-10 w-10 z-20 flex items-center justify-center rounded-full"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-5" strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center ">
                      <div className="h-16 w-16 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                          <circle className="circle" cx="50" cy="50" r="40" />
                          <path className="checkmark" d="M30,50 L45,65 L70,35" />

                          <circle id="particle1" className="particle" cx="50" cy="50" r="2" />
                          <circle id="particle2" className="particle" cx="50" cy="50" r="2" />
                          <circle id="particle3" className="particle" cx="50" cy="50" r="2" />
                          <circle id="particle4" className="particle" cx="50" cy="50" r="1.5" />
                          <circle id="particle5" className="particle" cx="50" cy="50" r="1.5" />
                          <circle id="particle6" className="particle" cx="50" cy="50" r="1.5" />
                        </svg>
                      </div>

                      <p className="mt-4 font-normal text-green-500">{message}</p>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
