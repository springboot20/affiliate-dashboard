import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { CustomErrorMessage } from "@/components/Error";
import { classNames } from "@/utils";
import { useState } from "react";

type SendMoneyPanelComponentProps = {
  onClose: () => void;
  open: boolean;
};

type InitialValues = {
  account: string;
  bank: string;
  beneficiary: string;
  amount: string;
  narration: string;
  category: string;
};

export const SendMoneyPanelComponent = ({ open, onClose }: SendMoneyPanelComponentProps) => {
  const initialValues: InitialValues = {
    account: "",
    bank: "",
    beneficiary: "",
    amount: "",
    narration: "",
    category: "",
  };

  const MAX_NARRATION_COUNT = 150;
  const [descriptionCount, setDescriptionCount] = useState(MAX_NARRATION_COUNT);

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
                    <DialogTitle className="text-lg font-medium text-[#281d1d] capitalize">
                      send money
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

                  <Formik initialValues={initialValues} onSubmit={() => {}}>
                    {({ setFieldValue, values }) => {
                      return (
                        <Form className="mt-4">
                          <fieldset className="mb-3">
                            <label
                              htmlFor="account"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              choose account
                            </label>
                            <select
                              name="account"
                              id="account"
                              className="w-full block border rounded-md px-3 py-1.5 appearance-none text-sm"
                            >
                              <option value="--select-an-account-">---select-an-account---</option>
                            </select>
                            <ErrorMessage name="account">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="bank"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              select bank
                            </label>
                            <select
                              name="bank"
                              id="bank"
                              className="w-full block border rounded-md px-3 py-1.5 appearance-none text-sm"
                            >
                              <option value="--select-an-bank-">---select-an-account---</option>
                            </select>
                            <ErrorMessage name="bank">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="beneficiary"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              beneficiary account number
                            </label>
                            <Field
                              name="beneficiary"
                              className="w-full block border rounded-md px-3 py-1.5"
                            />

                            <ErrorMessage name="beneficiary">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="amount"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              amount
                            </label>
                            <Field
                              name="amount"
                              className="w-full block border rounded-md px-3 py-1.5"
                            />

                            <ErrorMessage name="amount">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="narration"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              narration
                            </label>
                            <div>
                              <Field
                                as="textarea"
                                name="narration"
                                row={6}
                                className="w-full block border rounded-md p-3"
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                  const value = event.target.value;

                                  if (value.length <= MAX_NARRATION_COUNT) {
                                    setFieldValue("narration", value);
                                    setDescriptionCount(MAX_NARRATION_COUNT - value.length);
                                  } else {
                                    setFieldValue("narration", value.slice(0, MAX_NARRATION_COUNT));
                                    setDescriptionCount(0);
                                  }
                                }}
                                disabled={
                                  descriptionCount === 0 &&
                                  values.narration.length === MAX_NARRATION_COUNT
                                }
                              />
                              <span
                                className={classNames(
                                  "text-right block text-sm font-normal",
                                  descriptionCount === 0 ? "text-red-500" : ""
                                )}
                              >
                                ({descriptionCount} characters remaining)
                              </span>
                            </div>

                            <ErrorMessage name="narration">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="category"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              category
                            </label>

                            <select
                              name="category"
                              id="category"
                              className="w-full block border rounded-md px-3 py-1.5 appearance-none text-sm"
                            >
                              <option value="--select-an-account-">
                                choose category of transaction
                              </option>
                            </select>

                            <ErrorMessage name="account">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <button type="submit">
                            
                          </button>
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
