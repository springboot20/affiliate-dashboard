import { toast } from "react-toastify";
import { classNames } from "@/utils";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { CustomErrorMessage } from "@/components/Error";
import { useNavigate } from "react-router-dom";
import { sendMail } from "@/features/thunks/auth.thunk";
import { useAppDispatch } from "@/app/hook";
import { setUserEmail } from "@/features/auth/auth.slice";

const validationSchema = yup.object({
  email: yup.string().email("invalid email format").required("email is required"),
});

type InitialValues = {
  email: string;
};

const initialValues: InitialValues = {
  email: "",
};

export const SendEmail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function onSubmit({ email }: InitialValues, { resetForm }: FormikHelpers<InitialValues>) {
    dispatch(sendMail({ email }))
      .unwrap()
      .then(async (res) => {
        dispatch(setUserEmail({ email }));
        await Promise.resolve(
          setTimeout(() => {
            navigate("/auth/email-sent-message");
            resetForm();
          }, 2000),
        );
        return res;
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen p-3">
        <div className="mx-auto max-w-md">
          <UserCircleIcon className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-2 text-xl text-center font-semibold text-gray-600">
            verify your email to continue as a verified user
          </h2>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className="mt-7 bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
              <fieldset>
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="text-sm font-medium text-gray-800 capitalize">
                    email
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
                    id="email"
                    type="text"
                    name="email"
                    placeholder="enter your email to request for email verification..."
                    className={classNames(
                      "block w-full px-3 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 outline-none",
                      errors.email && touched.email ? "ring-red-600" : "focus:ring-indigo-600",
                    )}
                  />
                </div>
              </fieldset>
              <button
                // disabled={!isSubmitting}
                type="submit"
                className="disabled:bg-indigo-300 disabled:translate-y-0 disabled:cursor-not-allowed block py-2.5 w-full mt-5 bg-indigo-500 rounded-md transform hover:-translate-y-1.5 transition shadow-md"
              >
                <span className=" text-white text-sm font-medium uppercase tracking-wider">
                  Send mail
                </span>
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
