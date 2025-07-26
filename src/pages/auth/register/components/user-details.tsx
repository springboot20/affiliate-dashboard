import { ErrorMessage, Field, type FormikProps } from "formik";
import type { RegisterState } from "@/types/formik/formik";
import { CustomErrorMessage } from "@/components/Error";
import { classNames } from "@/utils";

export const RegisterUserDetails = ({ formik }: { formik: FormikProps<RegisterState> }) => {
  const { errors, touched } = formik;

  return (
    <>
      <fieldset>
        <div className="flex items-center justify-between">
          <label htmlFor="firstname" className="text-sm font-medium text-gray-800 dark:text-white">
            Firstname
          </label>
          <ErrorMessage name="firstname">
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
            name="firstname"
            placeholder="enter your firstname..."
            className={classNames(
              "block w-full px-3 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-white/5 dark:ring-white/10 dark:disabled:bg-white/10 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none",
              errors.firstname && touched.firstname ? "ring-red-600" : "focus:ring-indigo-600"
            )}
          />
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <div className="flex items-center justify-between">
          <label htmlFor="lastname" className="text-sm font-medium text-gray-800 dark:text-white">
            Lastname
          </label>
          <ErrorMessage name="lastname">
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
            name="lastname"
            placeholder="enter your lastname..."
            className={classNames(
              "block w-full px-3 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:bg-white/5 dark:ring-white/10 dark:disabled:bg-white/10 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none",
              errors.lastname && touched.lastname ? "ring-red-600" : "focus:ring-indigo-600"
            )}
          />
        </div>
      </fieldset>
    </>
  );
};
