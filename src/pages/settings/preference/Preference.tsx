import { classNames } from "@/utils";
import { Switch } from "@headlessui/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

type InitialValues = {
  currency: string;
  "time-zone": string;
};

const initialValues: InitialValues = {
  "time-zone": "",
  currency: "",
};

const preferenceSchema = yup.object({
  currency: yup.string(),
  "time-zone": yup.string(),
});

export const Preference = () => {
  const [receiveDigitalCurrency, setReceiveDigitalCurrency] = useState<boolean>(false);
  const [receiveMerchant, setReceiveMerchant] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<boolean>(false);

  const { values, handleSubmit, handleChange } = useFormik({
    onSubmit: onSubmit,
    initialValues,
    validationSchema: preferenceSchema,
  });

  async function onSubmit(values: InitialValues) {
    console.log(values);
  }

  return (
    <div className="mt-8">
      <form className="grid md:gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-stretch h-[70vh] justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="lg:col-span-1">
              <label
                htmlFor="currency"
                className="capitalize text-xs font-normal text-affiliate-black"
              >
                currency
              </label>
              <div>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  value={values.currency}
                  onChange={handleChange}
                  placeholder="USD"
                  className={classNames(
                    "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3"
                  )}
                />
              </div>
            </fieldset>

            <fieldset className="lg:col-span-1">
              <label
                htmlFor="time-zone"
                className="capitalize text-xs font-normal text-affiliate-black"
              >
                time zone
              </label>
              <div>
                <input
                  type="text"
                  id="time-zone"
                  value={values["time-zone"]}
                  onChange={handleChange}
                  name="time-zone"
                  placeholder="(GMT-12:00) International Date Line West"
                  className={classNames(
                    "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3"
                  )}
                />
              </div>
            </fieldset>

            <div className="mt-3 col-span-full">
              <h1 className="text-affiliate-blue capitalize font-medium text-sm">notification</h1>
              <div className="mt-4">
                <ul className="space-y-5">
                  <li className="flex items-center gap-2">
                    <Switch
                      checked={receiveDigitalCurrency}
                      onChange={() => setReceiveDigitalCurrency((prev) => !prev)}
                      className={classNames(
                        "relative appearance-none flex-shrink-0 w-[50px] h-[28px] rounded-[20px] shadow-sm",
                        receiveDigitalCurrency
                          ? "after:left-[calc(100%-28px)] bg-[#16DBCC] after:bg-white"
                          : "after:left-0 bg-[#DFEAF2] after:bg-white border",
                        " after:absolute after:h-[28px] after:w-[28px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition-all after:duration-150"
                      )}
                    ></Switch>
                    <p className="text-xs text-balance font-normal text-affiliate-black">
                      I send or receive digital currency
                    </p>
                  </li>

                  <li className="flex items-center gap-2">
                    <Switch
                      checked={receiveMerchant}
                      onChange={() => setReceiveMerchant((prev) => !prev)}
                      className={classNames(
                        "relative appearance-none flex-shrink-0 w-[50px] h-[28px] rounded-[20px] shadow-sm",
                        receiveMerchant
                          ? "after:left-[calc(100%-28px)] bg-[#16DBCC] after:bg-white"
                          : "after:left-0 bg-[#DFEAF2] after:bg-white border",
                        " after:absolute after:h-[28px] after:w-[28px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition-all after:duration-150"
                      )}
                    ></Switch>
                    <p className="text-xs text-balance font-normal text-affiliate-black">
                      I receive merchant order
                    </p>
                  </li>

                  <li className="flex items-center gap-2">
                    <Switch
                      checked={recommendation}
                      onChange={() => setRecommendation((prev) => !prev)}
                      className={classNames(
                        "relative appearance-none flex-shrink-0 w-[50px] h-[28px] rounded-[20px] shadow-sm",
                        recommendation
                          ? "after:left-[calc(100%-28px)] bg-[#16DBCC] after:bg-white"
                          : "after:left-0 bg-[#DFEAF2] after:bg-white border",
                        " after:absolute after:h-[28px] after:w-[28px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition-all after:duration-150"
                      )}
                    ></Switch>
                    <p className="text-xs text-balance font-normal text-affiliate-black">
                      There are recommendation for my account
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full md:flex md:items-center md:justify-end self-end">
            <button
              type="submit"
              className="py-2 w-full sm:w-32 px-4 text-center text-white bg-affiliate-deep-blue rounded-lg text-base font-medium capitalize"
            >
              save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
