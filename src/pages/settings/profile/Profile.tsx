import { useFile } from "@/hooks/register/useFile";
import { useRef } from "react";
import { Form, Formik, Field } from "formik";
import { ProfileValues } from "@/types/formik/formik";
import { classNames } from "@/utils";

const initialValues: ProfileValues = {
  "date-of-birth": "",
  address: {
    permanent: "",
    present: "",
  },
  city: "",
  username: "",
  password: "",
  country: "",
  email: "",
  "postal-code": "",
};

export const Profile = () => {
  const { handleFileChange, selectedFile } = useFile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formData = new FormData();

  async function onSubmit(values: ProfileValues) {
    formData.append("avatar", selectedFile as Blob);
    console.log({ ...values, avatar: selectedFile });
  }

  console.log(selectedFile);

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
      <div className="flex items-center justify-center flex-col col-span-fulllg:col-span-1 lg:justify-start">
        <div className="relative">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="user avatar"
              className="h-40 w-40 relative rounded-full border-2 shadow"
            />
          ) : (
            <div className="h-40 w-40 relative rounded-full border bg-gray-300"></div>
          )}
          <div className="text-center">
            <label
              htmlFor="photo-upload"
              className="relative cursor-pointer rounded-md font-semibold"
            >
              <span className="hidden sr-only">Upload photo</span>
              <input
                type="file"
                id="photo-upload"
                name="photo-upload"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
          </div>
          <button
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            className="peer absolute bottom-4 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-affiliate-deep-blue focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="sr-only">edit profile</span>
            {/* <PencilIcon className="h-5 text-white" /> */}
            <svg
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_199_536)">
                <path
                  d="M18.8532 5.23861L17.1834 6.90843C17.0132 7.07867 16.7379 7.07867 16.5676 6.90843L12.547 2.88783C12.3768 2.71759 12.3768 2.4423 12.547 2.27206L14.2168 0.602246C14.8942 -0.0750977 15.9953 -0.0750977 16.6763 0.602246L18.8532 2.77916C19.5342 3.45651 19.5342 4.55764 18.8532 5.23861ZM11.1127 3.70644L1.60086 13.2182L0.832966 17.6192C0.727924 18.2132 1.24589 18.7275 1.83993 18.6261L6.24085 17.8546L15.7526 8.3428C15.9229 8.17256 15.9229 7.89728 15.7526 7.72703L11.732 3.70644C11.5582 3.5362 11.2829 3.5362 11.1127 3.70644ZM5.31358 12.4032C5.11436 12.204 5.11436 11.8853 5.31358 11.6861L10.8917 6.10793C11.0909 5.90871 11.4097 5.90871 11.6089 6.10793C11.8081 6.30715 11.8081 6.6259 11.6089 6.82512L6.03076 12.4032C5.83155 12.6025 5.5128 12.6025 5.31358 12.4032ZM4.00598 15.4495H5.74461V16.7643L3.40832 17.1736L2.28183 16.0471L2.69113 13.7108H4.00598V15.4495Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_199_536">
                  <rect
                    width="18.5455"
                    height="18.5455"
                    fill="white"
                    transform="translate(0.818115 0.0908203)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => {
          return (
            <Form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 md:mt-8 gap-4 lg:gap-6 flex-shrink-0 w-full lg:col-span-2">
              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="username"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  your name
                </label>
                <div>
                  <Field
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Charlene Reed"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="username"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  user name
                </label>
                <div>
                  <Field
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Charlene Reed"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2  focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="email"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  email
                </label>
                <div>
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    placeholder="charlenereed@gmail.com "
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="password"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  password
                </label>
                <div>
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="**********"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="date-of-birth"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  date of birth
                </label>
                <div>
                  <Field
                    id="date-of-birth"
                    type="text"
                    name="date-of-birth"
                    placeholder="25 January 1990"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="present"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  present address
                </label>
                <div>
                  <Field
                    id="present"
                    type="text"
                    name="address.present"
                    placeholder="San Jose, California, USA"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="permanent"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  permanent address
                </label>
                <div>
                  <Field
                    id="permanent"
                    type="text"
                    name="address.permanent"
                    placeholder="San Jose, California, USA"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="city"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  city
                </label>
                <div>
                  <Field
                    id="city"
                    type="text"
                    name="city"
                    placeholder="San Jose"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="postal-code"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  postal code
                </label>
                <div>
                  <Field
                    id="postal-code"
                    type="text"
                    name="postal-code"
                    placeholder="4592"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none"
                    )}
                  />
                </div>
              </fieldset>

              <fieldset className="lg:col-span-1">
                <label
                  htmlFor="pcountry"
                  className="capitalize text-xs font-normal text-affiliate-black"
                >
                  country
                </label>
                <div>
                  <Field
                    id="pcountry"
                    type="text"
                    name="pcountry"
                    placeholder="4592"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none"
                    )}
                  />
                </div>
              </fieldset>

              <div className="mt-8 md:col-span-full md:flex md:items-center md:justify-end">
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
  );
};
