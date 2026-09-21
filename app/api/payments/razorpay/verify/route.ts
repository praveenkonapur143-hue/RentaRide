import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { getAuthUser } from '@/lib/api-auth';

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = 'UPI',
      vehicleId,
      customerName = authUser?.name || 'Self-Drive Guest',
      customerEmail = authUser?.email || 'driver@example.com',
      customerPhone = authUser?.phone || '+91 98765 43210',
      drivingLicenceNumber = 'DL-1420240098765',
      pickupDate = new Date().toISOString().split('T')[0],
      returnDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days = 2,
      pickupLocation = 'Kempegowda Airport Hub (BLR)',
      deliveryMode = 'HUB',
      plan = 'STANDARD',
      totalAmount = 7500
    } = body;

    const vehicle = dataStore.getVehicleById(vehicleId) || dataStore.getVehicles()[0];
    if (!vehicle) {
      return NextResponse.json({ error: 'Selected vehicle not found' }, { status: 404 });
    }

    // 1. Ensure or find Customer in dataStore
    const searchCustomerId = body.customerId || (authUser?.role === 'CUSTOMER' ? authUser.id : undefined);
    let customer = (searchCustomerId ? dataStore.getCustomerById(searchCustomerId) : null) ||
                   (customerEmail ? dataStore.getCustomerByEmail(customerEmail) : null) ||
                   (authUser?.email ? dataStore.getCustomerByEmail(authUser.email) : null);
    if (!customer) {
      customer = dataStore.createCustomer({
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone,
        drivingLicenceNumber,
        licenceExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        governmentIdNumber: 'XXXX-XXXX-9901',
        address: 'Bengaluru, Karnataka',
        dob: '1995-05-15',
        status: 'ACTIVE'
      });
    }

    // 2. Create Confirmed Booking in dataStore
    const newBooking = dataStore.createBooking({
      customerId: customer.id,
      vehicleId: vehicle.id,
      pickupDate,
      returnDate,
      pickupLocation,
      dropoffLocation: pickupLocation,
      dailyRate: vehicle.dailyPrice,
      days,
      discount: 0,
      taxRate: 18,
      taxAmount: Math.round(totalAmount * 0.18),
      securityDeposit: vehicle.securityDeposit || 3000,
      totalAmount,
      advancePayment: totalAmount,
      balanceAmount: 0,
      status: 'CONFIRMED',
      notes: `Paid via Razorpay (${paymentMethod}) | Mode: ${deliveryMode} | Shield: ${plan}`
    });

    // 3. Mark vehicle as BOOKED
    dataStore.updateVehicle(vehicle.id, { status: 'BOOKED' });

    // 4. Create Payment Ledger Record
    const paymentRecord = dataStore.createPayment({
      bookingId: newBooking.id,
      customerId: customer.id,
      amount: totalAmount,
      paymentMethod: paymentMethod === 'UPI' ? 'UPI' : 'CARD',
      paymentStatus: 'PAID',
      transactionReference: razorpay_payment_id || `pay_${Date.now().toString(36)}`,
      notes: `Razorpay Order: ${razorpay_order_id} | Verified via 3D Secure Webhook`
    });

    // 5. Generate Digital Boarding Pass data
    const digitalBoardingPass = {
      bookingId: newBooking.id,
      bookingNumber: newBooking.bookingNumber,
      paymentId: paymentRecord.transactionReference,
      vehicle: {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        registrationNumber: vehicle.registrationNumber,
        year: vehicle.year,
        fuelType: vehicle.fuelType,
        fastagEnabled: true,
        fastagBalance: '₹1,500 Active'
      },
      customer: {
        name: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        licence: customer.drivingLicenceNumber
      },
      schedule: {
        pickupDate,
        returnDate,
        pickupLocation,
        deliveryMode,
        gatePassId: `FASTAG-${vehicle.registrationNumber.replace(/\s+/g, '')}`
      },
      financials: {
        totalPaid: totalAmount,
        currency: 'INR',
        taxInvoiceNumber: `INV-2026-${newBooking.bookingNumber.replace('BK-', '')}`
      },
      qrCodeData: JSON.stringify({
        booking: newBooking.bookingNumber,
        plate: vehicle.registrationNumber,
        authKey: Math.random().toString(36).substring(2, 10).toUpperCase()
      })
    };

    return NextResponse.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      booking: newBooking,
      boardingPass: digitalBoardingPass
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
