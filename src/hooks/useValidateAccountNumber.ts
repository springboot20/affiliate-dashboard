import { useValidateAccountNumberMutation } from "@/features/account/account.slice";
import { useCallback, useRef, useState } from "react";
import { debounce } from "lodash";

interface IValidationState {
  isValid: boolean | null;
  isValidating: boolean;
  message: string;
}

export const useValidateAccountNumber = () => {
  const [validationState, setValidationState] = useState<IValidationState>({
    isValid: null,
    isValidating: false,
    message: "",
  });

  const [_validateAccountNumber] = useValidateAccountNumberMutation();

  const isValidatingRef = useRef(false);

  const validateAccount = async (accountNumber: string) => {
    // Skip validation if already validating
    if (isValidatingRef.current) {
      return;
    }

    isValidatingRef.current = true;
    setValidationState((prev) => ({
      ...prev,
      isValidating: true,
    }));

    // Call the mutation to validate the account number
    // and handle the response

    try {
      const response = await _validateAccountNumber(accountNumber).unwrap();

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
  };

  // Debounced validation function (waits 500ms after user stops typing)
  const debouncedValidate = useCallback(debounce(validateAccount, 500), [_validateAccountNumber]);

  const validateAccountNumber = useCallback(
    (accountNumber: string) => {
      // If the account number is empty, set isValid to null and return
      if (!accountNumber) {
        setValidationState((prev) => ({
          ...prev,
          isValid: null,
          message: "",
        }));
        return;
      }
      // Cancel any pending validation
      debouncedValidate.cancel();

      // Call debounced validation
      debouncedValidate(accountNumber);
    },
    [debouncedValidate]
  );

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: null,
      isValidating: false,
      message: "",
    });
    
    debouncedValidate.cancel();
    isValidatingRef.current = false;
  }, [debouncedValidate]);

  return {
    ...validationState,
    validateAccountNumber,
    resetValidation,
  };
};
