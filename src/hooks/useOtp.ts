import { useEffect, useRef } from 'react';

export const useOtp = ({
  _values,
  setValues,
}: {
  _values: Array<string>;
  setValues: (field: string, value: any) => void;
}) => {
  const length = _values.length;
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  useEffect(() => {
    window.addEventListener('load', () => {
      inputRefs.current[0]?.focus();
    });
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [..._values];

    newValues[index] = value.slice(-1);
    setValues('pin', newValues);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (event.key === 'Backspace') {
      if (!_values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Handle left arrow
    else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow
    else if (event.key === 'ArrowRight' && index < _values.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');

    if (/^\d+$/.test(pasteData) && pasteData.length <= length) {
      const digits = pasteData.split('').slice(0, length);
      const newValues = [..._values];

      digits.forEach((digit, i) => {
        if (i < _values.length) {
          newValues[i] = digit;
        }
      });
      setValues('pin', newValues);

      // Focus the next empty field or the last field
      const nextEmptyIndex = newValues.findIndex((val) => val === '');
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[_values.length - 1]?.focus();
      }
    }
  };

  return {
    _values,
    handleChange,
    handleKeyDown,
    handlePaste,
    inputRefs,
  };
};
