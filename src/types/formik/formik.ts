export interface RegisterState {
  username: string;
  email: string;
  password: string;
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
