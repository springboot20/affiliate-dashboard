import { useOtp } from '@/hooks/useOtp';
import { AccountInitialValues } from '@/types/formik/formik';
import { BackspaceIcon } from '@heroicons/react/24/outline';
import { FormikProps } from 'formik';
import React from 'react';

export const PinPadFormComponent = ({ formik }: { formik: FormikProps<AccountInitialValues> }) => {
  const { values, setFieldValue } = formik;

  const { handleChange, handleKeyDown, inputRefs, handlePaste } = useOtp({
    _values: values.pin,
    setValues: setFieldValue,
  });

  const handleBackspace = () => {
    // Find the last filled position
    const lastFilledIndex = values.pin.reduce((acc, val, index) => (val !== '' ? index : acc), -1);

    if (lastFilledIndex !== -1) {
      const updatedValues = [...values.pin];
      updatedValues[lastFilledIndex] = '';
      setFieldValue('pin', updatedValues);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handlePinButtonClick = (digit: number) => {
    // Find the first empty spot in the PIN array
    const emptyIndex = values.pin.findIndex((val) => val === '');

    if (emptyIndex !== -1) {
      handleChange(digit.toString(), emptyIndex);
    } else {
      // If all fields are filled, replace the last one and focus it
      const lastIndex = values.pin.length - 1;
      handleChange(digit.toString(), lastIndex);
    }
  };

  const resetPin = () => {
    setFieldValue('pin', Array(4).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className='max-w-xl mx-auto'>
      <header>
        <h3 className='lg:text-xl font-medium capitalize text-[#152F00]'>
          create new transaction pin
        </h3>
      </header>
      <div className=''>
        <div className='flex items-center justify-center w-full sm:space-x-2 py-4'>
          {React.Children.toArray(
            values.pin.map((_, index) => (
              <fieldset>
                <label htmlFor={`pin-${index}`} className='hidden sr-only'>
                  {index}
                </label>
                <input
                  id={`pin-${index}`}
                  type='text'
                  value={values.pin[index]}
                  maxLength={1}
                  inputMode='numeric'
                  autoComplete='off'
                  // pattern='\\d{1}'
                  onChange={(event) => handleChange(event.target.value, index)}
                  onKeyUp={(event) => handleKeyDown(event, index)}
                  onPaste={handlePaste}
                  className='block w-12 h-12 text-center appearance-none px-3 text font-medium rounded-md border-0 py-3 text-[#152F00] shadow-sm ring-1 ring-inset ring-[#A1E96F] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#A1E96F] sm:text-lg sm:leading-6 outline-none'
                />
              </fieldset>
            ))
          )}
        </div>
        <div className='grid grid-cols-3 gap-2 mt-4'>
          {React.Children.toArray(
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
              return <PinPadButtonComponent onClick={handlePinButtonClick} value={num} />;
            })
          )}

          <div className='w-full p-1 border rounded-md bg-white'>
            <button
              type='button'
              onClick={resetPin}
              className='w-full py-4 flex items-center justify-center text-lg font-medium bg-[#A1E96F] text-white hover:bg-[#A1E96F] rounded active:scale-95 active:bg-[#A1E96F] transition-all h-full'>
              Clear
            </button>
          </div>

          <PinPadButtonComponent value={0} onClick={handlePinButtonClick} />

          <div className='w-full p-1 border rounded-md bg-white'>
            <button
              type='button'
              title='backspace'
              onClick={handleBackspace}
              className='w-full py-4 flex items-center justify-center text-lg font-medium bg-[#A1E96F] text-white hover:bg-[#A1E96F] rounded active:scale-95 active:bg-[#A1E96F] transition-all h-full'>
              <BackspaceIcon strokeWidth={2.5} className='shrink-0 h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type PinPadButtonComponentProps = {
  value: number;
  onClick: (displayValue: number) => void;
};

const PinPadButtonComponent: React.FC<PinPadButtonComponentProps> = ({ value, onClick }) => {
  // Handle value 0 separately since it's at position 10 in the grid
  const displayValue = value === 0 ? 0 : value;

  return (
    <div arial-label={`pin-${displayValue}`} className='w-full border rounded-md p-1 bg-white'>
      <button
        title={`pin-${displayValue}`}
        onClick={() => onClick(displayValue)}
        type='button'
        className='w-full py-4 flex items-center justify-center text-lg font-medium bg-[#A1E96F] text-[#152F00] hover:bg-[#A1E96F] rounded active:scale-95 active:bg-[#A1E96F] transition-all'>
        {displayValue}
      </button>
    </div>
  );
};
