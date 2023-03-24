export interface BankAccount {
  id: string;
  accountHolderId: string;
  agency: string;
  accountNumber: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  status: BankAccountStatus;
}

/* eslint-disable no-unused-vars */
export enum BankAccountStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED',
}
