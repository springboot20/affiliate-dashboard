import { Formik, Form, Field, ErrorMessage } from 'formik';
import { CustomErrorMessage } from '@/components/Error';
import React, { useState, useEffect } from 'react';
import { classNames } from '@/utils';
import { LinkIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { AccountInitialValues } from '@/types/formik/formik';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetAccountDetailsQuery,
  useUpdateAccountStatusMutation,
} from '@/features/account/account.slice';
import { toast } from 'react-toastify';

export default function EditAccount() {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();

  const [formKey, setFormKey] = useState(0);
  const [account, setAccount] = useState<{ [key: string]: any }>({});

  const [updateAccountStatus] = useUpdateAccountStatusMutation();

  const { data: accountDetails } = useGetAccountDetailsQuery(
    { accountId: accountId! },
    {
      skip: !accountId,
    }
  );

  const [linkAccountToCard, setLinkAccountToCard] = useState(false);

  const initialValues: Pick<AccountInitialValues, 'type' | 'cards' | 'currency'> & {
    status: string;
  } = {
    currency: account?.wallet?.currency || '',
    type: account?.type || 'NONE',
    status: account?.status || '',
    cards: [],
  };

  useEffect(() => {
    if (accountDetails?.data) {
      setAccount(accountDetails?.data);
      setFormKey((prev) => prev + 1);
    }
  }, [accountDetails]);

  const handleAccountUpdate = async (
    values: Pick<AccountInitialValues, 'type' | 'currency'> & { status: string }
  ) => {
    try {
      const response = await updateAccountStatus({
        accountId: accountId!,
        type: values?.type,
        status: values?.status,
      }).unwrap();

      navigate('/app/accounts');

      const { message } = response;

      toast(message, { type: 'success', className: 'text-xs' });
    } catch (error: any) {
      console.log(error);
      const message = error?.data?.message;
      toast(message, { type: 'error', className: 'text-xs' });
      navigate('/app/accounts');
    }
  };

  return (
    <div className='mt-24 lg:mt-[8rem] max-w-xl mx-auto'>
      <button
        title='back'
        type='button'
        className='flex items-center gap-3 hover:underline active:underline text-sm font-medium mb-4'
        onClick={() => navigate('/app/accounts')}>
        <ArrowLeftIcon className='size-4 shrink-0' />
        back
      </button>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleAccountUpdate}
        key={formKey}>
        {({ values, setFieldValue, isSubmitting }) => {
          return (
            <Form className='max-w-full'>
              <header>
                <h3 className='lg:text-xl font-medium capitalize text-[#152F00]'>update account</h3>
              </header>
              <div className='mt-6'>
                <fieldset className='mb-3'>
                  <label htmlFor='currency' className='text-sm capitalize mb-1.5 inline-block'>
                    currency
                  </label>

                  <Field
                    as='select'
                    name='currency'
                    className='w-full block border rounded-md px-3 py-2 appearance-none text-sm ring-1 ring-inset ring-[#A1E96F] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#A1E96F] outline-none'>
                    <option value='--select-currency--'>--select-currency--</option>
                    <option value='USD'>usd</option>
                    <option value='NGN'>ngn</option>
                  </Field>

                  <ErrorMessage name='currency'>
                    {(msg) => (
                      <CustomErrorMessage className='text-sm mt-0.5 block text-red-600'>
                        {msg}
                      </CustomErrorMessage>
                    )}
                  </ErrorMessage>
                </fieldset>

                <fieldset className='mb-3'>
                  <label htmlFor='type' className='text-sm capitalize mb-1.5 inline-block'>
                    type
                  </label>

                  <Field
                    as='select'
                    name='type'
                    className='w-full block border rounded-md px-3 py-2 appearance-none text-sm ring-1 ring-inset ring-[#A1E96F] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#A1E96F] outline-none'>
                    <option value='NONE'>None</option>
                    <option value='CURRENT'>Current</option>
                    <option value='SAVINGS'>Savings</option>
                  </Field>

                  <ErrorMessage name='type'>
                    {(msg) => (
                      <CustomErrorMessage className='text-sm mt-0.5 block text-red-600'>
                        {msg}
                      </CustomErrorMessage>
                    )}
                  </ErrorMessage>
                </fieldset>

                <fieldset className='mb-3'>
                  <label htmlFor='status' className='text-sm capitalize mb-1.5 inline-block'>
                    status
                  </label>

                  <Field
                    as='select'
                    name='status'
                    onChange={(event: any) => {
                      const value = event.target.value;

                      setFieldValue('status', value);
                    }}
                    className='w-full block border rounded-md px-3 py-2 appearance-none text-sm ring-1 ring-inset ring-[#A1E96F] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#A1E96F] outline-none'>
                    <option value='ACTIVE'>Active</option>
                    <option value='INACTIVE'>In Active</option>
                  </Field>

                  <ErrorMessage name='status'>
                    {(msg) => (
                      <CustomErrorMessage className='text-sm mt-0.5 block text-red-600'>
                        {msg}
                      </CustomErrorMessage>
                    )}
                  </ErrorMessage>
                </fieldset>

                <div className=''>
                  <div className='flex items-center gap-3'>
                    <h1>Link account to account: </h1>
                    <button
                      type='button'
                      onClick={() => setLinkAccountToCard((prev) => !prev)}
                      className='text-sm font-medium text-[#152F00] inline-flex items-center gap-2 shrink-0'
                      title={linkAccountToCard ? 'unlink account' : 'link account'}>
                      <span>{linkAccountToCard ? 'unlink account' : 'link account'}</span>
                      <LinkIcon className='h-4' />
                    </button>
                  </div>

                  {linkAccountToCard && (
                    <>
                      <fieldset className='mt-3'>
                        <label htmlFor='cards' className='text-sm capitalize mb-1.5 inline-block'>
                          cards
                        </label>
                        <div className='flex items-center gap-2'>
                          <Field
                            as='select'
                            name='cardSelector'
                            className='w-full block border rounded-md px-3 py-2 appearance-none text-sm ring-1 ring-inset ring-[#A1E96F] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#A1E96F] outline-none'>
                            <option value='--select-currency--'>--select-currency--</option>
                          </Field>
                          <button
                            title='link account to card'
                            type='button'
                            onClick={() => {
                              // Example of adding a new card
                              const newCard = (
                                document.querySelector(
                                  'select[name="cardSelector"]'
                                ) as HTMLSelectElement
                              )?.value;
                              if (newCard && newCard !== '--select-card--') {
                                setFieldValue('cards', [...(values.cards || []), newCard]);
                              }
                            }}
                            className={classNames(
                              'py-2 lg:py-2.5 px-4 rounded-md text-sm font-medium flex items-center gap-3 text-center w-auto bg-[#A1E96F] text-[#152F00] shrink-0'
                              // loading ? "flex items-center gap-3 justify-center" : "text-center",
                              // disabled || loading ? "bg-gray-400 cursor-not-allowed" : "",
                            )}>
                            <svg className='h-5 w-5 animate-spin' viewBox='3 3 18 18'>
                              <path
                                className='bg-[#152F00]'
                                d='M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z'></path>
                              <path
                                className='bg-white'
                                d='M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z'></path>
                            </svg>
                            link account
                          </button>
                        </div>
                      </fieldset>

                      <div className='flex flex-wrap gap-2 mt-2'>
                        {Array.isArray(values?.cards) &&
                          React.Children.toArray(
                            values?.cards?.map((card, index) => (
                              <span className='border bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-sm flex items-center gap-2'>
                                {card}
                                <button
                                  type='button'
                                  className='text-red-500 hover:text-red-700'
                                  onClick={() =>
                                    setFieldValue(
                                      'cards',
                                      values?.cards?.filter((_: any, i: number) => i !== index)
                                    )
                                  }>
                                  <XCircleIcon className='h-6' />
                                  <span className='sr-only'>removecard</span>
                                </button>
                              </span>
                            ))
                          )}
                      </div>

                      {values.cards && values.cards?.length > 0 && (
                        <div className='mt-2 flex flex-wrap gap-2'>
                          <p className='text-sm text-gray-700'>
                            Selected: {values.cards.join(',')}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className={classNames(
                  'py-3 px-3 w-full mt-5 text-[#152F00] bg-[#A1E96F] text-sm font-semibold rounded-md transition focus:outline-none focus:ring-0',
                  isSubmitting ? 'flex gap-3 items-center justify-center ' : 'text-center'
                )}>
                {isSubmitting ? (
                  <>
                    <svg className='h-5 w-5 animate-spin' viewBox='3 3 18 18'>
                      <path
                        className='bg-[#152F00]'
                        d='M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z'></path>
                      <path
                        className='bg-white'
                        d='M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z'></path>
                    </svg>
                    <span>updating...</span>
                  </>
                ) : (
                  'Update Account'
                )}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
