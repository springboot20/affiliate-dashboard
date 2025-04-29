export const classNames = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(" ");
export const isBrowser = typeof window !== "undefined";

export class LocalStorage {
  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  static set(key: string, value: any) {
    if (!isBrowser) return;

    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

export const formatMoney = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(price);
};


// Format card number with spaces after every 4 digits
 export const formatCardNumber = (cardNumber?: string): string => {
    if (!cardNumber) return "";
    const digitsOnly = cardNumber.replace(/\D/g, "").slice(0, 16);
    return digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  // Format expiry date as MM/YY
export  const formatCardExpiry = (expiry?: string): string => {
    if (!expiry) return "";
    const digitsOnly = expiry.replace(/\D/g, "").slice(0, 4);
    return digitsOnly.length > 2
      ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
      : digitsOnly;
  };