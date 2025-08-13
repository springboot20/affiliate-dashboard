import { ArrowLeftIcon, ArrowRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "../../../utils";
import { register } from "@/features/thunks/auth.thunk";
import { useAppDispatch } from "@/app/hook";
import { GoogleSignButton } from "@/components/button/Button";

import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { RegisterState } from "@/types/formik/formik";
import { registerSchema } from "@/schema/auth/register";
import { toast } from "react-toastify";
import { RegisterUserCredentials } from "./components/user-credentials";
import { RegisterUserSecurity } from "./components/user-security";
import { RegisterUserDetails } from "./components/user-details";

const initialValues: RegisterState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone_number: "",
  confirmPassword: "",
};

// Step configuration for better maintainability
const STEPS = [
  {
    id: 0,
    name: "details",
    title: "Personal Details",
    fields: ["firstname", "lastname"],
  },
  {
    id: 1,
    name: "credentials",
    title: "Account Credentials",
    fields: ["email", "phone_number"],
  },
  {
    id: 2,
    name: "security",
    title: "Security",
    fields: ["password", "confirmPassword"],
  },
];

export const Register = () => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit = async (values: RegisterState, { resetForm }: FormikHelpers<RegisterState>) => {
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...rest } = values;
      const response = await dispatch(register(rest)).unwrap();
      const { url } = response.data;
      navigate("/auth/email/email-sent-message", {
        state: {
          url,
          email: rest.email,
        },
        replace: true,
      });

      setTimeout(() => {
        toast.success("Registration completed! Please check your email for verification.");
        setStep(0);
        resetForm();
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      toast.error(error || "Registration failed. Please try again.");
      console.error("Registration error:", error);

      // Reset form state on error
      setTimeout(() => {
        setStep(0);
        setIsLoading(false);
        resetForm();
      }, 1000);
    }
  };

  const handleNextStep = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const nextStep = Math.min(step + 1, STEPS.length - 1);

    // Update state
    setStep(nextStep);
  };

  const handlePrevStep = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    const prevStep = Math.max(step - 1, 0);

    // Update state
    setStep(prevStep);
  };

  const validateCurrentStep = async (formik: FormikProps<RegisterState>, currentStep: number) => {
    const errors = await formik.validateForm();
    const currentStepFields = STEPS[currentStep].fields;

    const touchedFields = currentStepFields.reduce((acc, field) => {
      return {
        ...acc,
        [field]: true,
      };
    }, {});

    formik.setTouched({
      ...formik.touched,
      ...touchedFields,
    });

    // Check if current step has errors
    const currentStepErrors = Object.keys(errors).filter((key) => currentStepFields.includes(key));

    return currentStepErrors.length === 0;
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen p-3">
        <div className="mx-auto max-w-md">
          <UserCircleIcon className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-2 text-3xl text-center font-semibold text-gray-600">
            Sign up to create an account
          </h2>

          {/* Step indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              {STEPS.map((stepConfig, index) => (
                <div key={stepConfig.id} className="flex items-center">
                  <div
                    className={classNames(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                      index <= step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {index + 1}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={classNames(
                        "h-0.5 w-12 mx-2 transition-colors",
                        index < step ? "bg-indigo-600" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-2 text-center text-sm text-gray-500">
            Step {step + 1} of {STEPS.length}: {STEPS[step].title}
          </p>
        </div>

        <div className="shrink-0 max-w-xl w-full">
          <GoogleSignButton />

          <div className="flex items-center space-x-4 justify-center my-4">
            <hr className="border-gray-300 block border-[1.5px] w-full" />
            <span className="text-gray-700 text-lg capitalize font-medium">or</span>
            <hr className="border-gray-300 block border-[1.5px] w-full" />
          </div>
          <Formik
            validateOnMount
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              const handleNext = async (event: React.MouseEvent<HTMLButtonElement>) => {
                const isValid = await validateCurrentStep(formik, step);

                if (isValid) {
                  handleNextStep(event);
                } else {
                  toast.error("Please fill in all required fields correctly.");
                  formik.setErrors(await formik.validateForm());
                }
              };
              
              return (
                <Form className="mt-5 bg-white rounded-lg p-4 sm:p-6 max-w-xl w-full">
                  {/* Render current step component */}
                  {step === 0 && <RegisterUserDetails formik={formik} />}
                  {step === 1 && <RegisterUserCredentials formik={formik} />}
                  {step === 2 && <RegisterUserSecurity formik={formik} />}
                  {step === 3 && <RegisterUserSecurity formik={formik} />}

                  <div className="mt-4 flex items-center gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex py-3 px-3 w-full gap-3 items-center justify-center text-white bg-indigo-500 dark:bg-white/5 dark:border dark:border-white/10 text-sm font-semibold rounded-md transition focus:outline-none focus:ring-0"
                      >
                        <ArrowLeftIcon className="h-4" />
                        Previous
                      </button>
                    )}

                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex py-3 px-3 gap-3 w-full items-center justify-center text-white bg-indigo-500 dark:bg-white/5 dark:border dark:border-white/10 text-sm font-semibold rounded-md transition focus:outline-none focus:ring-0"
                      >
                        Next
                        <ArrowRightIcon className="h-4" />
                      </button>
                    ) : (
                      <button
                        disabled={!formik.isValid || isLoading}
                        type="submit"
                        className="disabled:bg-indigo-300 disabled:cursor-not-allowed block py-2.5 w-full bg-indigo-500 dark:bg-white/5 dark:border dark:border-white/10 dark:disabled:bg-white/10 rounded-md transition shadow-md"
                      >
                        {formik.isSubmitting || isLoading ? (
                          <div
                            className={classNames(
                              "p-2 rounded-3xl bg-secondary w-fit inline-flex gap-1.5 bg-black/30"
                            )}
                          >
                            <span className="animation1 mx-[0.5px] h-1 w-1 bg-white rounded-full"></span>
                            <span className="animation2 mx-[0.5px] h-1 w-1 bg-white rounded-full"></span>
                            <span className="animation3 mx-[0.5px] h-1 w-1 bg-white rounded-full"></span>
                          </div>
                        ) : (
                          <span className="text-white text-sm font-medium uppercase tracking-wider">
                            sign up
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Form progress indicator */}
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <p className="mt-8 text-center text-sm text-gray-800">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            login
          </Link>
        </p>
      </div>
    </>
  );
};
