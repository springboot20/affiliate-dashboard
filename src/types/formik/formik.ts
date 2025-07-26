export interface RegisterState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number?: string;
}

export interface LoginState {
  email: string;
  password: string;
}

export type ProfileValues = {
  firstname: string;
  username: string;
  email: string;
  lastname: string;
  phoneNumber: string;
  password: string;
  city: string;
  country: string;
  postal_code: string;
  present_address: string;
  permanent_address: string;
};

export type AccountInitialValues = {
  type: "NONE" | "CURRENT" | "SAVINGS";
  currency: string;
  cards?: string[];
  pin: string[];
};
