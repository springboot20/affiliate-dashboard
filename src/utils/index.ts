export const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");
export const isBrowser = typeof window !== "undefined";

export class LocalStorage {
  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err: any) {
        console.log(err);
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

export const formatMoney = (price: number, currency: "USD" | "NGN", format: string) => {
  return new Intl.NumberFormat(format, {
    currency,
    style: "currency",
  }).format(price);
};

// Format card number with spaces after every 4 digits
export const formatCardNumber = (cardNumber?: string): string => {
  if (!cardNumber) return "";
  const digitsOnly = cardNumber.replace(/\D/g, "").slice(0, 16);
  return digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

// Format expiry date as MM/YY
export const formatCardExpiry = (expiry?: string): string => {
  if (!expiry) return "";
  const digitsOnly = expiry.replace(/\D/g, "").slice(0, 4);
  return digitsOnly.length > 2 ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}` : digitsOnly;
};

export function removeCircularReferences(obj: any) {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(obj, (_, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    })
  );
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};
