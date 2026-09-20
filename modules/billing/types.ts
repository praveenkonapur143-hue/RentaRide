export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface RecordPaymentParams {
  bookingId: string;
  customerId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  notes?: string;
}

export interface FinancialReport {
  totalRevenue: number;
  rentalIncome: number;
  totalExpenses: number;
  maintenanceCosts: number;
  refunds: number;
  netProfit: number;
  pendingBalance: number;
}
