import { classNames } from '@/utils';
import { Switch } from '@headlessui/react';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { DocumentDuplicateIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUpdateProfileMutation, useGetProfileQuery } from '@/features/profile/profile.slice';
import { toast } from 'react-toastify';
import { Loader } from '@/components/Loader';
import { useProfile } from '@/context/ProfileContext';
import { useNavigate } from 'react-router-dom';

type InitialValues = {
  currency: string;
  timezone: string;
  preferred_view: 'app' | 'dashboard';
};

const preferenceSchema = yup.object({
  currency: yup.string(),
  timezone: yup.string(),
  preferred_view: yup.string().oneOf(['app', 'dashboard']),
});

type PreferredViewType = 'app' | 'dashboard';

export const Preference = () => {
  const navigate = useNavigate()
  const [receiveDigitalCurrency, setReceiveDigitalCurrency] = useState<boolean>(false);
  const [receiveMerchant, setReceiveMerchant] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [recommendation, setRecommendation] = useState<boolean>(false);

  const [profile, setProfile] = useState<{ [key: string]: string | PreferredViewType }>({});

  const { data, isLoading, isFetching } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const { refetchProfile, updatePreferredView } = useProfile();

  useEffect(() => {
    if (data) {
      setProfile(data?.data?.profile);
      setFormKey((prev) => prev + 1);
    }
  }, [data]);

  async function onSubmit(values: InitialValues) {
    console.log(values);

    const previousView = profile?.preferredView as PreferredViewType;

    try {
      const response = await updateProfile({
        timezone: values?.timezone,
        currency: values?.currency,
        preferred_view: values?.preferred_view,
      }).unwrap();

      const { message } = response;
      toast(message, { type: 'success' });

      // Update the context with the new preferred view
      updatePreferredView(values.preferred_view);

      // Refetch profile data to ensure everything is in sync
      refetchProfile();

      // If the view changed, redirect the user to the appropriate view
      if (previousView !== values.preferred_view) {
        setTimeout(() => {
          if (values.preferred_view === 'app') {
            navigate('/app/overview');
          } else {
            navigate('/dashboard/overview');
          }
        }, 500); // Small delay to allow the toast to be visible
      }

      setEditing(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update profile';
      toast(errorMessage, { type: 'error' });
    }
  }

  const initialValues: InitialValues = {
    timezone: (typeof profile?.timezone === 'string' && profile?.timezone) || '',
    currency: (typeof profile?.currency === 'string' && profile?.currency) || '',
    preferred_view: (profile?.preferred_view as PreferredViewType) || 'app',
  };

  const { values, handleSubmit, handleChange, isSubmitting, setFieldValue } = useFormik({
    onSubmit: onSubmit,
    initialValues,
    validationSchema: preferenceSchema,
    enableReinitialize: true,
  });

  console.log(profile);

  const handleEditing = () => setEditing(true);

  return (
    <div className='mt-8'>
      {isLoading || isFetching || !data ? (
        <div className='col-span-full flex items-cente h-[40vh] justify-center'>
          <Loader />
        </div>
      ) : (
        <form key={formKey} className='grid md:gap-6' onSubmit={handleSubmit}>
          <div className='flex flex-col items-stretch h-[70vh] justify-between'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <fieldset className='lg:col-span-1'>
                <label
                  htmlFor='currency'
                  className='capitalize text-xs font-normal text-affiliate-black'>
                  currency
                </label>
                <div>
                  <select
                    id='currency'
                    name='currency'
                    value={values.currency}
                    onChange={handleChange}
                    disabled={!editing}
                    className={classNames(
                      'block w-full px-3 appearance-none rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5',
                      editing ? 'border border-[#DFEAF2]' : 'disabled:bg-gray-50 border-0'
                    )}>
                    <option value='USD'>USD</option>
                    <option value='NGN'>NGN</option>
                  </select>
                </div>
              </fieldset>

              <fieldset className='lg:col-span-1'>
                <label
                  htmlFor='timezone'
                  className='capitalize text-xs font-normal text-affiliate-black'>
                  time zone
                </label>
                <div>
                  <input
                    type='text'
                    id='timezone'
                    value={values.timezone}
                    onChange={handleChange}
                    name='timezone'
                    disabled={!editing}
                    placeholder='(GMT-12:00) International Date Line West'
                    className={classNames(
                      'block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5',
                      editing ? 'border border-[#DFEAF2]' : 'disabled:bg-gray-50 border-0'
                    )}
                  />
                </div>
              </fieldset>

              <div className='mt-3 col-span-full grid grid-cols-4 gap-6 lg:gap-0'>
                <div className='col-span-full md:col-span-2'>
                  <h1 className='text-affiliate-blue capitalize font-medium text-sm'>
                    notification
                  </h1>

                  <div className='mt-4'>
                    <ul className='space-y-5'>
                      <li className='flex items-center gap-2'>
                        <Switch
                          checked={receiveDigitalCurrency}
                          onChange={() => setReceiveDigitalCurrency((prev) => !prev)}
                          disabled={!editing}
                          className={classNames(
                            'relative appearance-none flex-shrink-0 w-[50px] h-[28px] rounded-[20px] shadow-sm',
                            receiveDigitalCurrency
                              ? 'after:left-[calc(100%-28px)] bg-[#16DBCC] after:bg-white'
                              : 'after:left-0 bg-[#DFEAF2] after:bg-white border',
                            ' after:absolute after:h-[28px] after:w-[28px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition-all after:duration-150',
                            editing ? 'border border-[#DFEAF2]' : 'disabled:bg-gray-100 border-0'
                          )}></Switch>
                        <p className='text-xs text-balance font-normal text-affiliate-black'>
                          I send or receive digital currency
                        </p>
                      </li>

                      <li className='flex items-center gap-2'>
                        <Switch
                          checked={receiveMerchant}
                          onChange={() => setReceiveMerchant((prev) => !prev)}
                          disabled={!editing}
                          className={classNames(
                            'relative appearance-none flex-shrink-0 w-[50px] h-[28px] rounded-[20px] shadow-sm',
                            receiveMerchant
                              ? 'after:left-[calc(100%-28px)] bg-[#16DBCC] after:bg-white'
                              : 'after:left-0 bg-[#DFEAF2] after:bg-white border',
                            ' after:absolute after:h-[28px] after:w-[28px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition-all after:duration-150',
                            editing ? 'border border-[#DFEAF2]' : 'disabled:bg-gray-100 border-0'
                          )}></Switch>
                        <p className='text-xs text-balance font-normal text-affiliate-black'>
                          I receive merchant order
                        </p>
                      </li>

                      <li className='flex items-center gap-2'>
                        <Switch
                          checked={recommendation}
                          onChange={() => setRecommendation((prev) => !prev)}
                          disabled={!editing}
                          className={classNames(
                            'relative appearance-none flex-shrink-0 w-[50px] h-[28px] rounded-[20px] shadow-sm',
                            recommendation
                              ? 'after:left-[calc(100%-28px)] bg-[#16DBCC] after:bg-white'
                              : 'after:left-0 bg-[#DFEAF2] after:bg-white border',
                            ' after:absolute after:h-[28px] after:w-[28px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition-all after:duration-150',
                            editing ? 'border border-[#DFEAF2]' : 'disabled:bg-gray-100 border-0'
                          )}></Switch>
                        <p className='text-xs text-balance font-normal text-affiliate-black'>
                          There are recommendation for my account
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='col-span-full md:col-span-2 '>
                  <h1 className='text-affiliate-blue capitalize font-medium text-sm'>
                    App Preference
                  </h1>
                  <fieldset className='mt-4'>
                    <label
                      htmlFor='preferred_view'
                      className='block text-sm font-medium text-gray-700 mb-2 sr-only'>
                      Default View
                    </label>

                    <select
                      title='app-preference'
                      id='preferred_view'
                      name='preferred_view'
                      value={values.preferred_view}
                      onChange={(event) => {
                        setFieldValue('preferred_view', event.target.value);
                      }}
                      disabled={!editing}
                      className={classNames(
                        'block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-sm appearance-none placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5',
                        editing ? 'border border-[#DFEAF2]' : 'disabled:bg-gray-50 border-0'
                      )}>
                      <option value='app'>Banking App</option>
                      <option value='dashboard'>Financial Dashboard</option>
                    </select>

                    <p className='mt-1.5 text-xs text-gray-500'>
                      Choose which view you'd like to see when you first log in
                    </p>
                  </fieldset>
                </div>
              </div>
            </div>

            <div className='mt-4 md:col-span-full flex items-center md:justify-end'>
              {editing ? (
                <>
                  <button
                    type='button'
                    onClick={() => setEditing(false)}
                    className='py-2 w-full mr-2 sm:w-28 px-4 flex items-center justify-center gap-3 text-white bg-affiliate-red rounded text-sm font-medium capitalize'>
                    cancel
                    <XMarkIcon className='h-5 w-5 shrink-0' />
                  </button>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='py-2 w-full sm:w-24 px-4 flex items-center justify-center gap-3 text-white bg-affiliate-deep-blue rounded text-sm font-medium capitalize disabled:bg-gray-400'>
                    {isSubmitting ? 'Saving...' : 'Save'}
                    <DocumentDuplicateIcon className='h-5 w-5 shrink-0' />
                  </button>
                </>
              ) : (
                <button
                  type='button'
                  onClick={handleEditing}
                  className='py-2 w-full sm:w-24 px-4 flex items-center justify-center  gap-3 text-white bg-[#16DBCC] rounded text-sm font-medium capitalize'>
                  edit
                  <PencilSquareIcon className='h-5 w-5 shrink-0' />
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
