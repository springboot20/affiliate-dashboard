import { User } from "./auth/auth";

export type AccountType=  {
  account : {
    user: User;
    _id: string;
    status: string;
    account_number: string;
    type: string;
    cards: any[];
    [key:string]: any
  },
  wallet: {
    [key: string]: any
  }
}