import { useState } from 'react';
import { CreateNewAccountFormComponent } from './create-new-account';
import { PinPadFormComponent } from './pinpad-form';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { AccountInitialValues } from '@/types/formik/formik';
import { Formik } from 'formik';
import { Form } from 'react-router-dom';

export default function AccountForms() {
  const [step, setStep] = useState(0);

  const initialValues: AccountInitialValues = {
    account_number: '',
    cards: [],
    currency: '',
    type: 'NONE',
    pin: Array(4).fill(''),
  };

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const handleNextStep = (): void => {
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePrevStep = (): void => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSubmit = (values: AccountInitialValues) => {
    // Handle final form submission here
    console.log('Form submitted with values:', values);
    // Here you would typically send the data to your backend
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => {
        return (
          <Form className='py-24 lg:py-[8rem] max-w-xl mx-auto'>
            <StepIndicator _step={step} />
            <motion.div
              key={step}
              initial='hidden'
              animate='visible'
              exit='exit'
              variants={variants}
              transition={{ duration: 0.5 }}
              className='w-full'>
              {step === 0 ? (
                <CreateNewAccountFormComponent formik={formik} />
              ) : (
                <PinPadFormComponent formik={formik} />
              )}
            </motion.div>

            <div className='mt-4 flex items-center justify-between'>
              {step > 0 && (
                <button
                  type='button'
                  onClick={handlePrevStep}
                  className='flex py-3 px-3 gap-3 items-center text-[#152F00] bg-[#A1E96F] text-sm font-semibold rounded-md transition focus:outline-none focus:ring-0'>
                  <ArrowLeftIcon className='h-4' />
                  Previous
                </button>
              )}

              {step < steps.length - 1 ? (
                <div className='ml-auto'>
                  <button
                    type='button'
                    onClick={handleNextStep}
                    className='flex py-3 px-3 gap-3 items-center text-[#152F00] bg-[#A1E96F] text-sm font-semibold rounded-md transition focus:outline-none focus:ring-0'>
                    Next
                    <ArrowRightIcon className='h-4' />
                  </button>
                </div>
              ) : (
                <div className='ml-auto'>
                  <button
                    type='submit'
                    className='flex py-3 px-3 gap-3 items-center text-[#152F00] bg-[#A1E96F] text-sm font-semibold rounded-md transition focus:outline-none focus:ring-0'>
                    Submit
                    <ArrowRightIcon className='h-4' />
                  </button>
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const steps = ['new-account', 'create pin'];

const StepIndicator = ({ _step }: { _step: number }) => {
  return (
    <div className='mb-8 max-w-xl mx-auto'>
      <div className='flex justify-between items-center relative mb-1'>
        {/* Line indicators between steps */}
        <div className='absolute h-0.5 bg-gray-300 left-0 right-0 top-1/2 transform -translate-y-1/2 z-0' />

        {/* Completed line indicators */}
        <div
          className='absolute h-0.5 bg-[#A1E96F] left-0 top-1/2 transform -translate-y-1/2 z-0 transition-all duration-300'
          style={{
            width: _step === 0 ? '0%' : '100%',

            // _step === 1 ? '50%' :
          }}
        />

        {/* Step circles */}
        {steps.map((_, index) => (
          <div key={index} className='z-10'>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= _step
                  ? 'bg-[#A1E96F] text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              } transition-all duration-300`}>
              {index <= _step ? (
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Step labels */}
      <div className='flex justify-between items-center mt-2'>
        {steps.map((step, index) => (
          <div key={index} className='flex-1'>
            <motion.div
              className={`text-center text-sm font-medium ${
                index <= _step ? 'text-[#A1E96F]' : 'text-gray-400'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};
