import { useValidateTransactionPinMutation } from "@/features/transactions/transaction.slice";
import { useCallback, useRef, useState } from "react";
import { debounce } from "lodash";

interface IValidateTransactionPinState {
  isValid: boolean;
  message: string;
  isValidating: boolean;
}

export const useValidateTransactionPin = () => {
  const [validationState, setValidationState] = useState<IValidateTransactionPinState>({
    isValid: false,
    message: "",
    isValidating: false,
  });

  const isValidatingRef = useRef(false);
  const [validateTransactionPin] = useValidateTransactionPinMutation();

  const handleValidaterTransactionPin = useCallback(async (pin: string, accountId: string) => {
    if (isValidatingRef.current) return;

    isValidatingRef.current = true;
    setValidationState((prev) => ({
      ...prev,
      isValidating: true,
    }));

    try {
      const response = await validateTransactionPin({
        pin,
        accountId,
      }).unwrap();

      const { data, message } = response;

      setValidationState({
        message,
        isValid: response.success ? (data?.isValid as boolean) : false,
        isValidating: false,
      });
    } catch (error: any) {
      const message = error?.data?.message || "unable to validate account number";

      setValidationState({
        message,
        isValid: false,
        isValidating: false,
      });
    } finally {
      isValidatingRef.current = false;
    }
  }, []);

  const debouncedValidate = useCallback(debounce(handleValidaterTransactionPin, 500), [
    validateTransactionPin,
  ]);

  const validatePin = useCallback(
    (pin: string, accountId: string) => {
      if (!(pin || accountId)) {
        setValidationState((prev) => ({
          ...prev,
          isValid: false,
          message: "",
        }));
        return;
      }

      debouncedValidate.cancel();

      debouncedValidate(pin, accountId);
    },
    [debouncedValidate]
  );

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: false,
      isValidating: false,
      message: "",
    });

    debouncedValidate.cancel();
    isValidatingRef.current = false;
  }, [debouncedValidate]);

  return {
    ...validationState,
    validatePin,
    resetValidation,
  };
};
