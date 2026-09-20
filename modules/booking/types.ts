export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ACTIVE_RENTAL'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'OVERDUE';

export interface BookingCalculationParams {
  dailyRate: number;
  pickupDate: string | Date;
  returnDate: string | Date;
  discount?: number;
  taxRate?: number;
  securityDeposit?: number;
  advancePayment?: number;
}

export interface BookingCalculationResult {
  days: number;
  subtotal: number;
  discount: number;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  advancePayment: number;
  balanceAmount: number;
  securityDeposit: number;
}

export interface BookingFilterParams {
  status?: string;
  vehicleId?: string;
  customerId?: string;
  search?: string;
}
