import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";

type AddMoneyPanelComponentProps = {
  onClose: () => void;
  open: boolean;
};

type InitialValues = {};

export const AddMoneyPanelComponent = ({ open, onClose }: AddMoneyPanelComponentProps) => {
  const initialValues: InitialValues = {};

  return (
    <Dialog open={open} onClose={onClose} className="relative z-40">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700">
              <div className="flex h-full flex-col bg-white shadow-xl">
                <div className="flex-1 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-medium text-[#222222] capitalize">
                      add money
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => onClose()}
                        className="h-10 w-10 z-20 flex items-center justify-center absolute right-4 top-4 rounded-full bg-gray-100"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>

                <Formik initialValues={initialValues} onSubmit={() => {}}>
                  {() => {
                    return (
                      <Form>
                        <fieldset>
                          <label htmlFor="account">choose account</label>
                          <select>
                            <option value="--select-an-account-">---select-an-account</option>
                          </select>
                        </fieldset>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
