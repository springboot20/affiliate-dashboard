import { CustomErrorMessage } from "@/components/Error";
import { useOtp } from "@/hooks/useOtp";
import { useValidateTransactionPin } from "@/hooks/useValidateTransactionPin";
import { classNames } from "@/utils";
import { BackspaceIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ErrorMessage, FormikProps } from "formik";
import React, { useEffect } from "react";

type InitialValues = {
  from_account?: string;
  to_account?: string;
  account?: string;
  bank?: string;
  beneficiary?: string;
  narration: string;
  category: string;
  amount: number;
  pin: string[];
};

export const PinPadFormComponent = ({ formik }: { formik: FormikProps<InitialValues> }) => {
  const { values, setFieldValue } = formik;

  const { handleChange, handleKeyDown, inputRefs, handlePaste } = useOtp({
    _values: values.pin,
    setValues: setFieldValue,
  });

  const {
    isValid: isPinValid,
    isValidating: isValidatingPin,
    message: validationMessage,
    resetValidation,
    validatePin,
  } = useValidateTransactionPin();

  const handleBackspace = () => {
    // Find the last filled position
    const lastFilledIndex = values.pin.reduce((acc, val, index) => (val !== "" ? index : acc), -1);

    if (lastFilledIndex !== -1) {
      const updatedValues = [...values.pin];
      updatedValues[lastFilledIndex] = "";
      setFieldValue("pin", updatedValues);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handlePinButtonClick = (digit: number) => {
    // Find the first empty spot in the PIN array
    const emptyIndex = values.pin.findIndex((val) => val === "");

    if (emptyIndex !== -1) {
      handleChange(digit.toString(), emptyIndex);
    } else {
      // If all fields are filled, replace the last one and focus it
      const lastIndex = values.pin.length - 1;
      handleChange(digit.toString(), lastIndex);
    }
  };

  useEffect(() => {
    const pins = values.pin.join("");
    const accountId = values.from_account || values?.account;

    if (pins.length === 4 && accountId) {
      validatePin(pins, accountId);
    } else {
      resetValidation();
    }
  }, [values.pin, values.from_account, values?.account, validatePin, resetValidation]);

  const resetPin = () => {
    resetValidation();
    setFieldValue("pin", Array(4).fill(""));
    inputRefs.current[0]?.focus();
  };

  const isPinCompleted = values.pin.every((digit) => digit !== "") && values.pin.length === 4;

  return (
    <div className="max-w-xl mx-auto">
      <header className="py-5 text-center">
        <h3 className="text-sm font-medium capitalize text-[#152F00]">enter transaction pin</h3>
      </header>
      <div className="relative">
        <div className="flex items-center justify-center w-full gap-2.5 sm:gap-2 py-4">
          {React.Children.toArray(
            values.pin.map((_, index) => (
              <fieldset>
                <label htmlFor={`pin-${index}`} className="hidden sr-only">
                  {index}
                </label>
                <input
                  id={`pin-${index}`}
                  type="password"
                  value={values.pin[index]}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="off"
                  // pattern='\\d{1}'
                  onChange={(event) => handleChange(event.target.value, index)}
                  onKeyUp={(event) => handleKeyDown(event, index)}
                  onPaste={handlePaste}
                  className={classNames(
                    "block w-12 h-12 text-center appearance-none px-3 text font-medium rounded-md border-0 py-3 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-lg sm:leading-6 outline-none",
                    isPinCompleted && isPinValid === true
                      ? "ring-green-500 focus:ring-green-500 text-green-500"
                      : isPinCompleted && isPinValid === false
                      ? "ring-red-500 focus:ring-red-500 text-red-500"
                      : "ring-[#A1E96F] focus:ring-[#A1E96F] text-[#152F00]"
                  )}
                />
              </fieldset>
            ))
          )}
        </div>

        {/* Validation indicator */}
        <div className="absolute inset-y-0 right-10 flex items-center pr-3">
          {isValidatingPin && (
            <div className="animate-spin h-4 w-4 border-2 border-[#A1E96F] border-t-transparent rounded-full"></div>
          )}
          {!isValidatingPin && isPinValid === true && isPinCompleted && (
            <CheckCircleIcon className="h-5 w-5 text-[#A1E96F]" />
          )}
          {!isValidatingPin && isPinValid === false && isPinCompleted && (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>

      <div className="flex justify-center mb-4 min-h-[2rem]">
        {/* Show validation message from hook if available */}
        {validationMessage && isPinCompleted && (
          <div
            className={classNames(
              "text-sm text-center px-3 py-2 rounded-md border max-w-xs",
              isPinValid
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-red-600 bg-red-50 border-red-200"
            )}
          >
            {validationMessage}
          </div>
        )}

        {!validationMessage && (
          <ErrorMessage name="pin">
            {(msg) => (
              <CustomErrorMessage className="text-sm text-center text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                {msg}
              </CustomErrorMessage>
            )}
          </ErrorMessage>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {React.Children.toArray(
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            return <PinPadButtonComponent onClick={handlePinButtonClick} value={num} />;
          })
        )}

        <div className="w-full p-1 border rounded-md bg-white">
          <button
            type="button"
            onClick={resetPin}
            className="w-full py-4 flex items-center justify-center text-lg font-medium bg-[#A1E96F] text-white hover:bg-[#A1E96F] rounded active:scale-95 active:bg-[#A1E96F] transition-all h-full"
          >
            Clear
          </button>
        </div>

        <PinPadButtonComponent value={0} onClick={handlePinButtonClick} />

        <div className="w-full p-1 border rounded-md bg-white">
          <button
            type="button"
            title="backspace"
            onClick={handleBackspace}
            className="w-full py-4 flex items-center justify-center text-lg font-medium bg-[#A1E96F] text-white hover:bg-[#A1E96F] rounded active:scale-95 active:bg-[#A1E96F] transition-all h-full"
          >
            <BackspaceIcon strokeWidth={2.5} className="shrink-0 h-5" />
          </button>
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
    <div arial-label={`pin-${displayValue}`} className="w-full border rounded-md p-1 bg-white">
      <button
        title={`pin-${displayValue}`}
        onClick={() => onClick(displayValue)}
        type="button"
        className="w-full py-4 flex items-center justify-center text-lg font-medium bg-[#A1E96F] text-[#152F00] hover:bg-[#A1E96F] rounded active:scale-95 active:bg-[#A1E96F] transition-all"
      >
        {displayValue}
      </button>
    </div>
  );
};
