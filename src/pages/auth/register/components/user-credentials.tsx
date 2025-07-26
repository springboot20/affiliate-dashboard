import { ErrorMessage, Field, type FormikProps } from "formik";
import type { RegisterState } from "@/types/formik/formik";
import { classNames } from "@/utils";
import { CustomErrorMessage } from "@/components/Error";

export const RegisterUserCredentials = ({ formik }: { formik: FormikProps<RegisterState> }) => {
  const { errors, touched } = formik;

  return (
    <>
      <fieldset>
        <div className="flex items-center justify-between">
          <label
            htmlFor="phone_number"
            className="text-sm font-medium text-gray-800 dark:text-white shrink-0"
          >
            Phone Number
          </label>
          <ErrorMessage name="phone_number">
            {(msg) => (
              <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                {msg}
              </CustomErrorMessage>
            )}
          </ErrorMessage>
        </div>
        <div className="mt-2">
          <Field
            type="text"
            name="phone_number"
            placeholder="enter your phone number..."
            className={classNames(
              "block w-full px-3 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-white/5 dark:ring-white/10 dark:disabled:bg-white/10 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none",
              errors.phone_number && touched.phone_number ? "ring-red-600" : "focus:ring-indigo-600"
            )}
          />
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <div className="flex items-center justify-between">
          <label htmlFor="email" className="text-sm font-medium text-gray-800 dark:text-white">
            Email Address
          </label>
          <ErrorMessage name="email">
            {(msg) => (
              <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                {msg}
              </CustomErrorMessage>
            )}
          </ErrorMessage>
        </div>
        <div className="mt-2">
          <Field
            type="email"
            placeholder="enter your email..."
            name="email"
            autoComplete="username"
            className={classNames(
              "block w-full px-3 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-white/5 dark:ring-white/10 dark:disabled:bg-white/10 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none",
              errors.email && touched.email ? "ring-red-600" : "focus:ring-indigo-600"
            )}
          />
        </div>
      </fieldset>
    </>
  );
};
