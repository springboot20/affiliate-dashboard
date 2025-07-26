import { ErrorMessage, Field, type FormikProps } from "formik";
import type { RegisterState } from "@/types/formik/formik";
import { CustomErrorMessage } from "@/components/Error";
import { classNames } from "@/utils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const RegisterUserSecurity = ({ formik }: { formik: FormikProps<RegisterState> }) => {
  const { errors, touched } = formik;
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <fieldset className="mt-3">
        <label htmlFor="password" className="text-sm font-medium text-gray-800 dark:text-white">
          Password
        </label>
        <div className="flex flex-col">
          <div className="mt-2 relative">
            <Field
              type={show ? "text" : "password"}
              name="password"
              placeholder="enter your password..."
              autoComplete="current-password"
              className={classNames(
                "block w-full px-3 rounded-md border-0 py-2.5 sm:py-4 md:py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none",
                errors.password && touched.password ? "ring-red-600" : "focus:ring-indigo-600"
              )}
            />
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-4"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <EyeSlashIcon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-white/40" />
              ) : (
                <EyeIcon className="h-6 w-6 cursor-pointer text-gray-500 dark:text-white/40" />
              )}
            </button>
          </div>
          <ErrorMessage name="password">
            {(msg) => (
              <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                {msg}
              </CustomErrorMessage>
            )}
          </ErrorMessage>
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-800 dark:text-white"
        >
          Confirm Password
        </label>
        <div className="flex flex-col">
          <div className="mt-2 relative">
            <Field
              type={show ? "text" : "password"}
              name="confirmPassword"
              placeholder="re-enter your password..."
              autoComplete="current-password"
              className={classNames(
                "block w-full px-3 rounded-md border-0 py-2.5 sm:py-4 md:py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none",
                errors.confirmPassword && touched.confirmPassword
                  ? "ring-red-600"
                  : "focus:ring-indigo-600"
              )}
            />
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-4"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <EyeSlashIcon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-white/40" />
              ) : (
                <EyeIcon className="h-6 w-6 cursor-pointer text-gray-500 dark:text-white/40" />
              )}
            </button>
          </div>
          <ErrorMessage name="confirmPassword">
            {(msg) => (
              <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                {msg}
              </CustomErrorMessage>
            )}
          </ErrorMessage>
        </div>
      </fieldset>
    </>
  );
};
