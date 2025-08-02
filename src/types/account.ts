import { User } from "./auth/auth";

export type AccountType = {
  user: User;
  _id: string;
  status: string;
  account_number: string;
  type: string;
  cards: any[];
  [key: string]: any;
  wallet: {
    [key: string]: any;
  };
};

interface TransactionDetail {
  gateway: string;
  receiverAccountNumber: string;
  senderAccountNumber: string;
  _id: string;
}

export interface TransactionProps {
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: string;
  type: string;
  detail: TransactionDetail;
  createdAt: string;
  transactionStatus: string;
}
