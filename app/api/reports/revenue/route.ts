import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '@/modules/billing/service';
import { requireAuth } from '@/lib/api-auth';
import { dataStore } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, ['ADMIN', 'STAFF']);
  if (!auth.authorized) return auth.response;

  const summary = BillingService.getFinancialSummary();
  const monthlyChart = BillingService.getMonthlyRevenueChartData();
  const payments = dataStore.getPayments();

  // Payment method distribution
  const methodCounts: Record<string, number> = {};
  payments.forEach(p => {
    methodCounts[p.paymentMethod] = (methodCounts[p.paymentMethod] || 0) + p.amount;
  });

  const paymentBreakdown = Object.entries(methodCounts).map(([method, amount]) => ({
    method,
    amount: Math.round(amount * 100) / 100,
  }));

  return NextResponse.json({
    summary,
    monthlyChart,
    paymentBreakdown,
  });
}
