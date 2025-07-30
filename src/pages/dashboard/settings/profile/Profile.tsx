import { useFile } from "@/hooks/register/useFile";
import { useEffect, useRef, useState } from "react";
import { Form, Formik, Field } from "formik";
import { ProfileValues } from "@/types/formik/formik";
import { classNames } from "@/utils";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/profile/profile.slice";
import { toast } from "react-toastify";
import { Loader } from "@/components/Loader";
import { DocumentDuplicateIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const Profile = () => {
  const { handleFileChange, selectedFile, setSelectedFile } = useFile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateProfile] = useUpdateProfileMutation();
  const [profileDetail, setProfileDetail] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const { data: profile_data, isLoading, isFetching, refetch } = useGetProfileQuery();
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (profile_data) {
      setProfileDetail(profile_data?.data?.profile);
      setFormKey((prev) => prev + 1);
    }
  }, [profile_data]);

  const handleEditing = () => setEditing(true);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const initialValues: ProfileValues = {
    permanent_address: profileDetail?.permanent_address || "",
    present_address: profileDetail?.present_address || "",
    firstname: profileDetail?.user?.firstname || "",
    lastname: profileDetail?.user?.lastname || "",
    phoneNumber: profileDetail?.user?.phone_number || "",
    city: profileDetail?.city || "",
    username: profileDetail?.username || "",
    password: "", // Password is empty by default for security
    country: profileDetail?.country || "",
    email: profileDetail?.user?.email || "",
    postal_code: profileDetail?.postal_code || "",
  };

  async function onSubmit(values: ProfileValues) {
    try {
      // Create form data for file upload if a new file was selected
      let avatarData = undefined;

      if (selectedFile) {
        avatarData = selectedFile;
      }

      console.log(avatarData);

      // Submit form with all values
      const response = await updateProfile({
        ...values,
      }).unwrap();

      const { message } = response;
      toast(message, { type: "success", className: "text-xs" });

      // Reset editing state after successful submission
      setEditing(false);
      setSelectedFile(null);

      // Refresh profile data if needed - depends on your RTK setup
      // refetchProfile();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update profile";
      toast(errorMessage, { type: "error", className: "text-xs" });
    }
  }

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
      <div className="flex items-center justify-center flex-col col-span-fulllg:col-span-1 lg:justify-start">
        <div className="relative">
          {selectedFile ? (
            <div className="h-40 w-40 relative rounded-full border-2 shadow overflow-hidden">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="user avatar"
                className="h-full w-full object-cover object-center"
              />
            </div>
          ) : profileDetail?.user?.avatar ? (
            <div className="h-40 w-40 relative rounded-full border-2 shadow overflow-hidden">
              <img
                src={profileDetail?.user?.avatar?.url}
                alt="user avatar"
                className="h-full w-full object-cover object-center "
              />
            </div>
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
                // id="photo-upload"
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
              <g clipPath="url(#clip0_199_536)">
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
      <Formik
        key={formKey}
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => {
          return (
            <Form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 md:mt-8 gap-4 lg:gap-6 flex-shrink-0 w-full lg:col-span-2">
              {isLoading || isFetching ? (
                <div className="col-span-full flex items-cente h-[40vh] justify-center">
                  <Loader />
                </div>
              ) : (
                <>
                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="firstname"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      first name
                    </label>
                    <Field
                      // id="firstname"
                      type="text"
                      name="firstname"
                      placeholder="Charlene Reed"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5",
                        editing ? "border border-[#DFEAF2]" : ""
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="lastname"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      last name
                    </label>
                    <Field
                      // id="lastname"
                      type="text"
                      name="lastname"
                      placeholder="Charlene Reed"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="username"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      username
                    </label>
                    <Field
                      id="username"
                      type="text"
                      name="username"
                      autoComplete="username"
                      placeholder="Charlene Reed"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="email"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      email
                    </label>
                    <Field
                      id="email"
                      type="email"
                      name="email"
                      placeholder="charlenereed@gmail.com "
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="password"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      password
                    </label>
                    <Field
                      // id="password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="**********"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF]  py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none disabled:bg-gray-50 border-0"
                      )}
                      disabled={true}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="date-of-birth"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      date of birth
                    </label>
                    <Field
                      // id="date-of-birth"
                      type="text"
                      name="date-of-birth"
                      placeholder="25 January 1990"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF]  py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="present_address"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      present address
                    </label>
                    <Field
                      // id="present"
                      type="text"
                      name="present_address"
                      placeholder="San Jose, California, USA"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF]  py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="permanent_address"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      permanent address
                    </label>
                    <Field
                      // id="address.permanent_address"
                      type="text"
                      name="permanent_address"
                      placeholder="San Jose, California, USA"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF]  py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="city"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      city
                    </label>
                    <Field
                      // id="city"
                      type="text"
                      name="city"
                      placeholder="San Jose"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF]  py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="postal_code"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      postal code
                    </label>
                    <Field
                      // id="postal_code"
                      type="text"
                      name="postal_code"
                      placeholder="4592"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF]  py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <fieldset className="lg:col-span-1">
                    <label
                      htmlFor="country"
                      className="capitalize text-xs font-normal text-affiliate-black"
                    >
                      country
                    </label>
                    <Field
                      // id="pcountry"
                      type="text"
                      name="country"
                      placeholder="4592"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF]  py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none",
                        editing ? "border border-[#DFEAF2]" : "disabled:bg-gray-50 border-0"
                      )}
                      disabled={!editing}
                    />
                  </fieldset>

                  <div className="mt-4 md:col-span-full flex items-center md:justify-end">
                    {editing || selectedFile ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setEditing(false);
                          }}
                          className="py-2 w-full mr-2 sm:w-28 px-4 flex items-center justify-center gap-3 text-white bg-affiliate-red rounded text-sm font-medium capitalize"
                        >
                          cancel
                          <XMarkIcon className="h-5 w-5 shrink-0" />
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="py-2 w-full sm:w-24 px-4 flex items-center justify-center gap-3 text-white bg-affiliate-deep-blue rounded text-sm font-medium capitalize disabled:bg-gray-400"
                        >
                          {isSubmitting ? "Saving..." : "Save"}
                          <DocumentDuplicateIcon className="h-5 w-5 shrink-0" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEditing}
                        className="py-2 w-full sm:w-24 px-4 flex items-center justify-center  gap-3 text-white bg-[#16DBCC] rounded text-sm font-medium capitalize"
                      >
                        edit
                        <PencilSquareIcon className="h-5 w-5 shrink-0" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
