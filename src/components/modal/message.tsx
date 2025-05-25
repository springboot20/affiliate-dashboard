import { classNames } from "@/utils";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import { Fragment } from "react";

type SendMessageModalProps = {
  open: boolean;
  close: () => void;
};

type InitialValues = {
  action: "CLOSE_ACCOUNT" | "SUSPEND_ACCOUNT" | "UNSUSPEND_ACCOUNT" | "UNCLOSE_ACCOUNT" | "NONE";
};

export const SendMessageModal: React.FC<SendMessageModalProps> = ({ open, close }) => {
  const { values, setFieldValue } = useFormik<InitialValues>({
    initialValues: {
      action: "NONE",
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

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
                <DialogPanel className="p-4 bg-white rounded-md max-w-md w-full relative">
                  <button
                    type="button"
                    onClick={() => close()}
                    className="h-10 w-10 z-20 flex items-center justify rounded-full absolute top-0 right-0"
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-5" strokeWidth={2.5} />
                  </button>

                  <DialogTitle as="h1" className="text-base font-medium text-gray-600">
                    Request message
                  </DialogTitle>

                  <form
                    className="mt-5"
                    onSubmit={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <fieldset className="mb-2">
                      <label htmlFor="action" className="text-sm font-medium mb-2 inline-block">
                        Request action {values.action !== "NONE" && "to"}
                        {values.action !== "NONE" && (
                          <span
                            className={classNames(
                              values.action.toLowerCase().startsWith("un")
                                ? "bg-green-500"
                                : "bg-red-500",
                              "px-2 py-1 !font-medium !text-xs w-max !text-white rounded-xl ml-1.5"
                            )}
                          >
                            {values.action === "CLOSE_ACCOUNT"
                              ? "close account"
                              : values.action === "UNCLOSE_ACCOUNT"
                              ? "unclose account"
                              : values.action === "SUSPEND_ACCOUNT"
                              ? "suspend account"
                              : values.action === "UNSUSPEND_ACCOUNT"
                              ? "unsuspend account"
                              : ""}
                          </span>
                        )}
                      </label>
                      <select
                        name="action"
                        id="action"
                        value={values.action}
                        onChange={(event) => {
                          setFieldValue("action", event.target.value);
                        }}
                        className="w-full outline-none focus:ring-[1.3px] focus:ring-gray-600 appearance-none px-3 py-2.5 border rounded-md block text-sm"
                      >
                        <option value="NONE">---select-request-action---</option>
                        <option value="CLOSE_ACCOUNT">close account</option>
                        <option value="SUSPEND_ACCOUNT">suspend account</option>
                        <option value="UNCLOSE_ACCOUNT">unclose account</option>
                        <option value="UNSUSPEND_ACCOUNT">unsuspend account</option>
                      </select>
                    </fieldset>

                    <fieldset>
                      <label
                        htmlFor="request_message"
                        className="text-sm font-medium mb-2 inline-block"
                      >
                        Request Message
                      </label>
                      <textarea
                        name="request_message"
                        id="request_message"
                        className="w-full outline-none focus:ring-[1.3px] focus:ring-gray-600 appearance-none p-3 border rounded-md block text-sm"
                        rows={4}
                      ></textarea>
                    </fieldset>

                    <div className="flex items-center gap-4">
                      <button
                        title="send message"
                        type="button"
                        className="mt-3 px-2 py-2.5 text-white rounded-md text-sm bg-red-500 text-center w-full capitalize"
                        onClick={() => {
                          close();
                        }}
                      >
                        cancel
                      </button>
                      <button
                        title="send message"
                        type="submit"
                        className="mt-3 px-2 py-2.5 rounded-md text-sm bg-[#A1E96F] text-center w-full capitalize text-[#152F00]"
                      >
                        send message
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
