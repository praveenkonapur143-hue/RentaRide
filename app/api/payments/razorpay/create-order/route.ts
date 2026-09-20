import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleId, days = 1, plan = 'STANDARD', deliveryMode = 'HUB' } = body;

    const vehicle = dataStore.getVehicleById(vehicleId) || dataStore.getVehicles()[0];
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const baseRental = vehicle.dailyPrice * days;
    const planFee = plan === 'PEACE_OF_MIND' ? 350 * days : 0;
    const deliveryFee = deliveryMode === 'DOORSTEP' ? 300 : 0;
    const subtotal = baseRental + planFee + deliveryFee;
    const gstAmount = Math.round(subtotal * 0.18);
    const securityDeposit = vehicle.securityDeposit || 3000;
    const totalPayable = subtotal + gstAmount + securityDeposit;

    // Authentic Razorpay Order structure (Amount in Paise: INR * 100)
    const razorpayOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrderId,
        entity: 'order',
        amount: totalPayable * 100, // in paise
        amount_paid: 0,
        amount_due: totalPayable * 100,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        status: 'created',
        attempts: 0,
        notes: {
          vehicleId: vehicle.id,
          vehicleName: `${vehicle.brand} ${vehicle.model}`,
          registrationNumber: vehicle.registrationNumber,
          days,
          plan,
          deliveryMode,
        },
        breakdown: {
          baseRental,
          planFee,
          deliveryFee,
          subtotal,
          cgst: Math.round(gstAmount / 2),
          sgst: Math.round(gstAmount / 2),
          gstTotal: gstAmount,
          securityDeposit,
          totalPayable
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment order' },
      { status: 500 }
    );
  }
}
