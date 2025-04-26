import { classNames } from "@/utils";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

type InitialValues = {
  "current-password": string;
  "new-password": string;
};

let passwordRule = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{6,}$/;

const initialValues: InitialValues = {
  "current-password": "",
  "new-password": "",
};

const preferenceSchema = yup.object({
  "current-password": yup.string(),
  "new-password": yup.string().matches(passwordRule, {
    message:
      "password must be at least 6 long in length and it is expected to contain digits, letter",
  }),
});

async function onSubmit(values: InitialValues) {
  console.log(values)
}

export const Security = () => {
  const [active, setActive] = useState<boolean>(false);

  const handleActive = () => {
    setActive((prev) => !prev);
  };
  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        <h1 className="text-affiliate-blue capitalize font-medium text-sm">notification</h1>
        <ul>
          <li className="flex items-center gap-4">
            <Switch
              checked={active}
              onChange={handleActive}
              className={classNames(
                "relative appearance-none flex-shrink-0 w-[50px] h-[28px] rounded-[20px] shadow-sm",
                active
                  ? "after:left-[calc(100%-28px)] bg-[#16DBCC] after:bg-white"
                  : "after:left-0 bg-[#DFEAF2] after:bg-white border",
                " after:absolute after:h-[28px] after:w-[28px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition",
              )}
            ></Switch>
            <p className="text-xs font-normal text-affiliate-black">
              Enable or disable two factor authentication
            </p>
          </li>
        </ul>
      </div>
      <div className="space-y-3">
        <h1 className="text-affiliate-blue capitalize font-medium text-sm">change password</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={preferenceSchema}
        >
          {() => {
            return (
              <Form className="space-y-4">
                <fieldset>
                  <label
                    htmlFor="current-password"
                    className="capitalize text-xs font-normal text-affiliate-black"
                  >
                    current password
                  </label>
                  <div>
                    <Field
                      type="password"
                      id="current-password"
                      name="current-password"
                      placeholder="**********"
                      autoComplete={"current-password"}
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3",
                      )}
                    />
                  </div>
                </fieldset>

                <fieldset>
                  <label
                    htmlFor="new-password"
                    className="capitalize text-xs font-normal text-affiliate-black"
                  >
                    new password
                  </label>
                  <div>
                    <Field
                      type="password"
                      id="new-password"
                      name="new-password"
                      placeholder="*********"
                      autoComplete={"current-password"}
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3",
                      )}
                    />
                  </div>
                </fieldset>

                <div className="mt-8 w-full md:flex md:items-center md:justify-end">
                  <button
                    type="submit"
                    className="py-2 w-full sm:w-32 px-4 text-center text-white bg-affiliate-deep-blue rounded-lg text-base font-medium capitalize"
                  >
                    save
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
