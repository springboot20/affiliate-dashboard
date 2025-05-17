import { useAppDispatch } from '@/app/hook';
import { Button } from '@/components/button/Button';
import { InputField } from '@/components/input/InputField';
import { useGetUserAccountsQuery } from '@/features/account/account.slice';
import { CardApiSlice, useCreateNewCardMutation } from '@/features/cards/card.slice';
import { classNames } from '@/utils';
import { Switch } from '@headlessui/react';
import { Field, Form, Formik, FormikErrors } from 'formik';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface InitialValues {
  card_number: string;
  card_name: string;
  valid_thru: string;
  type: string;
  primary_account: string;
  cvv: string;
}

const validationSchema = Yup.object().shape({
  card_name: Yup.string().required('card name is required'),
  card_number: Yup.string()
    .required('card number is required')
    .matches(/^(\d{4}\s?){4}$/, 'invalid card number format'),
  type: Yup.string().required('card type is required'),
  primary_account: Yup.string().optional(),
  cvv: Yup.string()
    .required('cvv is required')
    .matches(/^\d{3,4}$/, 'cvv must be 3 or 4 digits'),
  valid_thru: Yup.string()
    .required('expiry date is required')
    .matches(/^\d{2}\/\d{2}$/, 'invalid expiry date format (MM/YY)'),
});

export const CardForm = () => {
  const [generatingCardDetails, setGeneratingCardDetails] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [formKey, setFormKey] = useState(0);
  const [cardNumberDetails, setCardNumberDetails] = useState<any>(null);
  const [createNewCard] = useCreateNewCardMutation();
  const { data } = useGetUserAccountsQuery();

  const [generatePlatformCardOrAddPersonalCard, setGeneratePlatformCardOrAddPersonalCard] =
    useState(false);

  const userAccounts = useMemo(() => data?.data?.accounts, [data]);

  const cardTypes = [
    {
      type: 'MASTER DEBIT',
      value: 'MASTER DEBIT',
    },
    {
      type: 'MASTER CREDIT',
      value: 'MASTER CREDIT',
    },
    {
      type: 'VERVE DEBIT',
      value: 'VERVE DEBIT',
    },
    {
      type: 'VERVE CREDIT',
      value: 'VERVE CREDIT',
    },
  ];

  const handleGenerateCardNumberDetails = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setGeneratingCardDetails(true);

    try {
      const api = dispatch(CardApiSlice.endpoints.generateCardNumberDetails.initiate());
      const response = (await api).data;

      if (response?.success) {
        setTimeout(() => {
          setCardNumberDetails(response?.data);
          setGeneratingCardDetails(false);
          setFormKey((prev) => prev + 1);
        }, 2000);
      }
    } catch (error: any) {
      console.error(error)
      setGeneratingCardDetails(false);
    }
  };
  // Improved card number formatting function
  const formatCardNumber = (cardNumber?: string): string => {
    if (!cardNumber) return '';

    // Remove any non-digit characters
    const digitsOnly = cardNumber.replace(/\D/g, '');

    // Limit to maximum 16 digits
    const limitedDigits = digitsOnly.slice(0, cardNumber.length);

    // Format with spaces after every 4 digits
    const parts = [];
    for (let i = 0; i < limitedDigits.length; i += 4) {
      parts.push(limitedDigits.substring(i, i + 4));
    }

    return parts.join(' ');
  };

  // Improved expiry date formatting function
  const formatCardExpiry = (expiry?: string): string => {
    if (!expiry) return '';

    // Remove any non-digit characters
    const digitsOnly = expiry.replace(/\D/g, '');

    // Limit to maximum 4 digits
    const limitedDigits = digitsOnly.slice(0, 4);

    // Add / after the first 2 digits if there are more than 2 digits
    if (limitedDigits.length > 2) {
      return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
    }

    return limitedDigits;
  };

  const handleCardNumberFormat = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<InitialValues>>
  ) => {
    setFieldValue('card_number', formatCardNumber(event.target.value));
  };

  const handleValidThruFormat = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<InitialValues>>
  ) => {
    setFieldValue('valid_thru', formatCardExpiry(event.target.value));
  };

  const initialValues: InitialValues = {
    card_number: formatCardNumber(cardNumberDetails?.card_number) || '',
    cvv: cardNumberDetails?.cvv || '',
    valid_thru: formatCardExpiry(cardNumberDetails?.valid_thru) || '',
    card_name: '',
    type: '',
    primary_account: '',
  };

  return (
    <div className='p-6 rounded-2xl bg-white'>
      <div className='mb-2'>
        <p className='text-xs font-normal text-[#718EBF]'>
          Credit Card generally means a plastic card issued by Scheduled Commercial Banks assigned
          to a Cardholder, with a credit limit, that can be used to purchase goods and services on
          credit or obtain cash advances.
        </p>
        <div className='flex items-center gap-2 mt-2'>
          <h3 className='text-[#718EBF] text-sm font-medium'>
            {generatePlatformCardOrAddPersonalCard
              ? ' Generate Platform card'
              : ' Add Personal card'}
          </h3>
          <Switch
            checked={generatePlatformCardOrAddPersonalCard}
            onChange={() => setGeneratePlatformCardOrAddPersonalCard((prev) => !prev)}
            className={classNames(
              'relative appearance-none flex-shrink-0 w-[50px] h-[24px] rounded-[20px] shadow-sm',
              generatePlatformCardOrAddPersonalCard
                ? 'after:left-[calc(100%-24px)] bg-[#16DBCC] after:bg-white'
                : 'after:left-0 bg-[#DFEAF2] after:bg-white border',
              ' after:absolute after:h-[24px] after:w-[24px] after:rounded-full after:top-1/2 after:-translate-y-1/2 after:scale-[0.85] after:transition-all after:duration-150'
            )}></Switch>
        </div>
      </div>
      <Formik
        key={formKey}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log(values);
          try {
            const response = await createNewCard({
              ...values,
              card_number: values?.card_number.split(' ').join(''),
            }).unwrap();
            const { message } = response;
            setCardNumberDetails({});
            toast(message, { type: 'success' });

            resetForm();
          } catch (error: any) {
            const errorMessage = error?.data?.message || 'Failed to create card';
            toast(errorMessage, { type: 'error' });
          }
        }}>
        {({ setFieldValue, isSubmitting, values, errors, touched }) => {
          return (
            <Form>
              <div className='grid grid-cols-3 gap-2'>
                <div className='col-span-full md:col-span-2'>
                  <InputField label='card name' name='card_name' />
                  {errors.card_name && touched.card_name && (
                    <div className='text-red-500 text-xs mt-1'>{errors.card_name}</div>
                  )}
                </div>

                <fieldset className='col-span-full md:col-span-1 relative'>
                  <label
                    htmlFor='primary_account'
                    className='capitalize text-xs font-normal text-affiliate-black'>
                    Primary account
                  </label>
                  <select
                    id='primary_account'
                    name='primary_account'
                    value={values?.primary_account}
                    onChange={(event) => {
                      setFieldValue('primary_account', event.target.value);
                    }}
                    className='block w-full px-3 appearance-none rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5 border border-[#DFEAF2]'>
                    <option>select a default account to link to card</option>
                    {React.Children.toArray(
                      (userAccounts ?? [])?.map((acc: any) => (
                        <option
                          value={
                            acc?.account?._id
                          }>{`${acc?.account?.user?.firstname} ${acc?.account?.user?.lastname}`}</option>
                      ))
                    )}
                  </select>
                </fieldset>
                <fieldset className='col-span-full md:col-span-1 relative'>
                  <label
                    htmlFor='type'
                    className='capitalize text-xs font-normal text-affiliate-black'>
                    Card Type
                  </label>
                  <select
                    title='card-type'
                    name='type'
                    value={values?.type}
                    onChange={(event) => {
                      setFieldValue('type', event.target.value);
                    }}
                    className='block w-full px-3 rounded-lg appearance-none relative text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-2.5 border border-[#DFEAF2]'>
                    <option>select a card to continue</option>
                    {React.Children.toArray(
                      cardTypes.map((type) => <option value={type.value}>{type.type}</option>)
                    )}
                  </select>

                  {errors.type && touched.type && (
                    <div className='text-red-500 text-xs mt-1'>{errors.type}</div>
                  )}
                </fieldset>

                <div className='col-span-full md:col-span-2'>
                  <fieldset>
                    <label
                      htmlFor='card_number'
                      className='capitalize text-xs font-normal text-affiliate-black'>
                      Card Number
                    </label>
                    {generatePlatformCardOrAddPersonalCard ? (
                      <div className='flex items-center flex-wrap gap-3'>
                        <Field
                          type='text'
                          name='card_number'
                          id='card_number'
                          disabled={true}
                          maxLength={19}
                          className='block flex-1 px-3 rounded-lg text-[#718EBF] py-2 lg:py-2.5 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none bg-gray-50 border cursor-not-allowed'
                        />
                        <Button
                          onClick={handleGenerateCardNumberDetails}
                          loading={generatingCardDetails}
                          className='w-auto bg-[#16DBCC] text-white'>
                          Generate
                        </Button>
                      </div>
                    ) : (
                      <input
                        type='text'
                        name='card_number'
                        id='card_number'
                        value={values?.card_number}
                        onChange={(event) => {
                          handleCardNumberFormat(event, setFieldValue);
                        }}
                        maxLength={19}
                        className='block w-full px-3 rounded-lg text-[#718EBF] py-2 lg:py-2.5 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none border border-[#DFEAF2]'
                      />
                    )}
                    {errors.card_number && touched.card_number && (
                      <div className='text-red-500 text-xs mt-1'>{errors.card_number}</div>
                    )}
                  </fieldset>
                </div>

                <div className='w-full col-span-full grid grid-cols-3 gap-2'>
                  <div>
                    {generatePlatformCardOrAddPersonalCard ? (
                      <InputField name='cvv' label='CVV' disabled={true} />
                    ) : (
                      <InputField name='cvv' label='CVV' />
                    )}
                    {errors.cvv && touched.cvv && (
                      <div className='text-red-500 text-xs mt-1'>{errors.cvv}</div>
                    )}
                  </div>

                  <div>
                    {generatePlatformCardOrAddPersonalCard ? (
                      <InputField name='valid_thru' label='Valid Thru' disabled={true} />
                    ) : (
                      <fieldset>
                        <label
                          htmlFor='valid_thru'
                          className='capitalize text-xs font-normal text-affiliate-black'>
                          valid thru
                        </label>
                        <input
                          id='valid_thru'
                          type='text'
                          name='valid_thru'
                          value={values?.valid_thru}
                          onChange={(event) => {
                            handleValidThruFormat(event, setFieldValue);
                          }}
                          className='block w-full px-3 rounded-lg text-[#718EBF] py-2 lg:py-2.5 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none border border-[#DFEAF2]'
                        />
                      </fieldset>
                    )}
                    {errors.valid_thru && touched.valid_thru && (
                      <div className='text-red-500 text-xs mt-1'>{errors.valid_thru}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className='pt-4'>
                <Button
                  type='submit'
                  loading={isSubmitting}
                  disabled={!values.card_name || !values.type || !values.primary_account}
                  className='w-full sm:w-auto bg-affiliate-deep-blue text-white'>
                  Add Card
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
