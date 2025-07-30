import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik, FormikHelpers } from "formik";
import { classNames } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { useGetUserAccountsQuery } from "@/features/account/account.slice";
import * as yup from "yup";
import { AddMoneyDetailForm } from "./components/add-money-detail-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PinPadFormComponent } from "./components/pinpad-form";
import { motion } from "framer-motion";
import { ConfirmationDetails } from "./components/confirmation-detail";
import { TransactionDetailReminderModalComponent } from "../modal/reminder-modal";
import { useDepositTransactionMutation } from "@/features/transactions/transaction.slice";

type AddMoneyPanelComponentProps = {
  onClose: () => void;
  open: boolean;
};

type InitialValues = {
  from_account?: string;
  to_account?: string;
  amount: number;
  narration: string;
  category: string;
  pin: string[];
};

export const AddMoneyPanelComponent = ({ open, onClose }: AddMoneyPanelComponentProps) => {
  const { data: accounts } = useGetUserAccountsQuery();
  const navigate = useNavigate();
  const [openReminder, setOpenReminder] = useState(false);
  const [depositTransaction] = useDepositTransactionMutation();

  const initialValues: InitialValues = {
    from_account: "",
    to_account: "",
    amount: 0,
    narration: "",
    category: "",
    pin: Array(4).fill(""),
  };

  const MAX_NARRATION_COUNT = 150;

  const getInitialStepFromUrl = (): number => {
    const urlParams = new URLSearchParams(location.search);
    const stepParam = urlParams.get("step");
    // Convert to number, validate between 1-3, default to 1 if invalid
    const step = parseInt(stepParam || "1", 10);
    return isNaN(step) || step < 1 || step > 2 ? 0 : step - 1; // Convert to 0-based index
  };

  const getInitialTabFromUrl = (): string => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");
    // Validate tab value, default to "address" if invalid
    return ["transaction-details", "confirmation-details", "transaction-pin"].includes(
      tabParam || ""
    )
      ? tabParam!
      : "transaction-details";
  };

  const [step, setStep] = useState(getInitialStepFromUrl() || 0);
  const [tab, setTab] = useState(getInitialTabFromUrl() || "transaction-details");

  // Helper function to update URL
  const updateUrl = useCallback(
    (stepValue: number, tabValue: string): void => {
      // Convert from 0-based index to 1-based for URL
      const stepForUrl = Math.min(Math.max(1, stepValue + 1), 3);
      navigate(`/app/overview/?step=${stepForUrl}&tab=${tabValue}`, { replace: true });
    },
    [navigate]
  );

  // Update URL when step or tabView changes - with extra safety checks
  useEffect(() => {
    if (open) {
      updateUrl(step, tab);
    }
  }, [step, tab, updateUrl, open]);

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const handleDepositTransaction = async (
    values: InitialValues,
    { resetForm }: FormikHelpers<InitialValues>
  ) => {
    try {
      const response = await depositTransaction({
        amount: values?.amount,
        description: values?.narration,
        to_account: values?.to_account,
        from_account: values?.from_account,
      }).unwrap();

      const { message } = response;
      toast.success(message, { className: "text-xs" });

      setTimeout(() => {
        navigate("/app/overview");
        onClose();
        resetForm();
      }, 1000);
    } catch (error: any) {
      setTimeout(() => {
        resetForm();
        setStep(0);
        setTab("transaction-details");
      }, 1000);
      const message = error?.data?.message;
      toast.error(message, { className: "text-xs" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setStep(0);
        setTab("transaction-details");
        navigate("/app/overview");
      }}
      className="relative z-40"
    >
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform overflow-x-hidden transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700">
              <div className="flex h-full flex-col bg-white shadow-xl overflow-y-auto">
                <div className="flex-1 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-medium text-[#222222] capitalize">
                      add money
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          setStep(0);
                          setTab("transaction-details");
                          navigate("/app/overview");
                        }}
                        className="h-10 w-10 z-20 flex items-center justify-center absolute right-4 top-4 rounded-full bg-gray-100"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={yup.object({
                      from_account: yup.string().required("account is required"),
                      to_account: yup
                        .string()
                        .required("destination account is required")
                        .notOneOf([yup.ref("from_account")], "Cannot transfer to the same account"),
                      amount: yup
                        .number()
                        .positive("Amount must be a positive number")
                        .required("Amount is required"),
                      narration: yup
                        .string()
                        .max(
                          MAX_NARRATION_COUNT,
                          `Description cannot exceed ${MAX_NARRATION_COUNT} characters`
                        )
                        .required("Description is required"),
                      category: yup.string().required("Category is required"),
                      pin: yup
                        .array()
                        .of(yup.string().required())
                        .test("pin-complete", "PIN must be 4 digits", function (value) {
                          if (!value) return false;
                          // Check if all 4 PIN fields are filled and contain only digits
                          return (
                            value.length === 4 &&
                            value.every((digit) => digit && /^\d$/.test(digit))
                          );
                        })
                        .required("PIN is required"),
                    })}
                    onSubmit={handleDepositTransaction}
                  >
                    {(formik) => {
                      const buttonType = step === 0 || step === 1 ? "button" : "submit";
                      const buttonText =
                        step === 0 ? "next" : step === 1 ? "continue" : "add money";

                      const handleButtonClick = async (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        event.preventDefault();
                        if (step === 0) {
                          const errors = await formik.validateForm();

                          formik.setTouched({
                            from_account: true,
                            to_account: true,
                            amount: true,
                            narration: true,
                            category: true,
                          });

                          const step0Fields = [
                            "from_account",
                            "to_account",
                            "amount",
                            "narration",
                            "category",
                          ];
                          const step0Errors = Object.keys(errors).filter((key) =>
                            step0Fields.includes(key)
                          );

                          if (step0Errors.length === 0) {
                            setStep(1);
                            setTab("transaction-pin");
                          } else {
                            toast("Input fields cannot be empty.", { type: "error" });
                            formik.setErrors(errors);
                          }
                        } else if (step === 1) {
                          setOpenReminder(true);
                        } else {
                          const errors = await formik.validateForm();
                          formik.setTouched({
                            ...formik.touched,
                            pin: true,
                          });

                          if (Object.keys(errors).length === 0) {
                            formik.handleSubmit();
                            onClose();
                          } else {
                            toast("Please enter a valid 4-digit PIN.", { type: "error" });
                            formik.setErrors(errors);
                          }
                        }
                      };

                      const handleBackButtonClick = (
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        event.preventDefault();
                        if (step === 1) {
                          setStep(0);
                          setTab("transaction-details");
                        } else if (step === 2) {
                          setStep(1);
                          setTab("confirmation-details");
                        } else {
                          onClose();
                          navigate("/app/overview");
                        }
                      };
                      return (
                        <>
                          <TransactionDetailReminderModalComponent
                            open={openReminder}
                            close={() => {
                              setOpenReminder(false);
                            }}
                            setStep={setStep}
                            setTab={setTab}
                            values={formik.values}
                          />
                          <Form className="mt-4">
                            <motion.div
                              key={step}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={variants}
                              transition={{ duration: 0.5 }}
                              className="w-full"
                            >
                              {step === 0 ? (
                                <AddMoneyDetailForm accounts={accounts} formik={formik} />
                              ) : step === 2 ? (
                                <PinPadFormComponent formik={formik} />
                              ) : null}
                            </motion.div>

                            {step === 1 && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  y: 200,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 10,
                                }}
                                transition={{ duration: 0.5 }}
                                className="w-full"
                              >
                                <ConfirmationDetails values={formik.values} />
                              </motion.div>
                            )}

                            <div className="mt-6 flex items-center space-x-3">
                              <button
                                type="button"
                                onClick={handleBackButtonClick}
                                className="text-sm font-medium text-[#A1E96F] capitalize shrink-0 w-auto flex-grow px-2 py-2.5 rounded text-center bg-[#F7F7F7] border border-[#A1E96F] hover:bg-[#A1E96F] hover:text-white"
                              >
                                {step === 0 ? "cancel" : "back"}
                              </button>
                              <button
                                type={buttonType}
                                title={buttonType}
                                onClick={buttonType === "button" ? handleButtonClick : undefined}
                                disabled={formik.isSubmitting}
                                className={classNames(
                                  "capitalize font-medium text-sm w-auto flex-grow px-2 py-2.5 rounded text-center bg-[#A1E96F] text-[#152F00]",
                                  "flex items-center justify-center"
                                )}
                              >
                                {buttonText}
                              </button>
                            </div>
                          </Form>
                        </>
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
