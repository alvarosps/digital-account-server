export interface BankAccount {
  id: number;
  accountHolderId: number;
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
