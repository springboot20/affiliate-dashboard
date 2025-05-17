import { classNames } from '@/utils';
import { Switch } from '@headlessui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import { DocumentDuplicateIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

type InitialValues = {
  currency: string;
  'time-zone': string;
  prefered_view: 'app' | 'dashboard';
};

const preferenceSchema = yup.object({
  currency: yup.string(),
  'time-zone': yup.string(),
});

export const Preference = () => {
  const [receiveDigitalCurrency, setReceiveDigitalCurrency] = useState<boolean>(false);
  const [receiveMerchant, setReceiveMerchant] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<boolean>(false);

  async function onSubmit(values: InitialValues) {
    console.log(values);
  }

  const initialValues: InitialValues = {
    'time-zone': '',
    currency: '',
    prefered_view: 'app',
  };

  const { values, handleSubmit, handleChange, isSubmitting } = useFormik({
    onSubmit: onSubmit,
    initialValues,
    validationSchema: preferenceSchema,
  });

  const handleEditing = () => setEditing(true);

  return (
    <div className='mt-8'>
      <form className='grid md:gap-6' onSubmit={handleSubmit}>
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
                htmlFor='time-zone'
                className='capitalize text-xs font-normal text-affiliate-black'>
                time zone
              </label>
              <div>
                <input
                  type='text'
                  id='time-zone'
                  value={values['time-zone']}
                  onChange={handleChange}
                  name='time-zone'
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
                <h1 className='text-affiliate-blue capitalize font-medium text-sm'>notification</h1>

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
                    id='prefered_view'
                    name='prefered_view'
                    value={values.prefered_view}
                    onChange={handleChange}
                    disabled={!editing}
                    className={classNames(
                      'block w-full px-3 rounded-lg text-[#718EBF] border border-[#DFEAF2] py-2 focus:ring-2 focus:ring-inset text-sm appearance-none placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5',
                      editing ? 'border border-[#DFEAF2]' : 'disabled:bg-gray-50 border-0'
                    )}>
                    <option value='app'>Banking App</option>
                    <option value='dashboard'>Financial Dashboard</option>
                  </select>

                  <p className='mt-1 text-sm text-gray-500'>
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
    </div>
  );
};
