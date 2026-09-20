import { dataStore } from '@/lib/data-store';
import { DemoInvoice, DemoPayment } from '@/lib/demo-data';
import { FinancialReport, RecordPaymentParams } from './types';

export class BillingService {
  static getAllPayments(filters?: { bookingId?: string; customerId?: string }): DemoPayment[] {
    return dataStore.getPayments(filters);
  }

  static recordPayment(params: RecordPaymentParams): DemoPayment {
    const payment = dataStore.createPayment({
      bookingId: params.bookingId,
      customerId: params.customerId,
      amount: params.amount,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'PAID',
      transactionReference: params.transactionReference,
      notes: params.notes,
    });

    dataStore.createAuditLog('RECORD_PAYMENT', 'PAYMENT', payment.id, {
      amount: params.amount,
      bookingId: params.bookingId,
      method: params.paymentMethod,
    });

    return payment;
  }

  static getInvoiceByBookingId(bookingId: string): DemoInvoice | undefined {
    return dataStore.getInvoiceByBookingId(bookingId);
  }

  static getInvoiceById(id: string): DemoInvoice | undefined {
    return dataStore.getInvoiceById(id);
  }

  static getAllInvoices(filters?: { customerId?: string; bookingId?: string }): DemoInvoice[] {
    return dataStore.getInvoices(filters);
  }

  static getFinancialSummary(): FinancialReport {
    const payments = dataStore.getPayments();
    const maintenance = dataStore.getMaintenance();
    const invoices = dataStore.getInvoices();

    const totalRevenue = payments
      .filter(p => p.paymentStatus === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);

    const maintenanceCosts = maintenance
      .reduce((sum, m) => sum + m.cost, 0);

    const refunds = payments
      .filter(p => p.paymentStatus === 'REFUNDED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalExpenses = maintenanceCosts + 25000; // includes regular hub ops & overhead
    const netProfit = Math.round((totalRevenue - totalExpenses) * 100) / 100;
    const pendingBalance = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      rentalIncome: Math.round((totalRevenue - 3000) * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      maintenanceCosts: Math.round(maintenanceCosts * 100) / 100,
      refunds: Math.round(refunds * 100) / 100,
      netProfit,
      pendingBalance: Math.round(pendingBalance * 100) / 100,
    };
  }

  static getMonthlyRevenueChartData() {
    return [
      { month: 'Apr', revenue: 420000, expenses: 140000, netProfit: 280000 },
      { month: 'May', revenue: 560000, expenses: 180000, netProfit: 380000 },
      { month: 'Jun', revenue: 710000, expenses: 220000, netProfit: 490000 },
      { month: 'Jul', revenue: 840000, expenses: 250000, netProfit: 590000 },
      { month: 'Aug', revenue: 920000, expenses: 290000, netProfit: 630000 },
      { month: 'Sep', revenue: 785000, expenses: 215000, netProfit: 570000 },
    ];
  }
}
