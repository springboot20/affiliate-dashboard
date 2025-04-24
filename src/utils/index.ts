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