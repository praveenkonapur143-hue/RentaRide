import { PrismaClient } from '@prisma/client';
import {
  initialUsers,
  initialVehicles,
  initialCustomers,
  initialBookings,
  initialInspections,
  initialDamageReports,
  initialPayments,
  initialInvoices,
  initialMaintenance,
  initialSettings
} from '../lib/demo-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RentaRide PostgreSQL database...');

  // 1. Settings
  await prisma.businessSettings.upsert({
    where: { id: initialSettings.id },
    update: {},
    create: {
      id: initialSettings.id,
      businessName: initialSettings.businessName,
      tagline: initialSettings.tagline,
      email: initialSettings.email,
      phone: initialSettings.phone,
      address: initialSettings.address,
      currency: initialSettings.currency,
      taxRate: initialSettings.taxRate,
      lateFeePerHour: initialSettings.lateFeePerHour,
      lateFeePerDay: initialSettings.lateFeePerDay,
      defaultDeposit: initialSettings.defaultDeposit,
      rentalPolicy: initialSettings.rentalPolicy,
      cancellationPolicy: initialSettings.cancellationPolicy,
      termsAndConditions: initialSettings.termsAndConditions,
    }
  });
  console.log('✅ Settings seeded');

  // 2. Users
  for (const user of initialUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role as any,
        phone: user.phone,
        avatar: user.avatar,
        isActive: user.isActive,
      }
    });
  }
  console.log(`✅ ${initialUsers.length} Users seeded`);

  // 3. Customers
  for (const customer of initialCustomers) {
    await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        dob: customer.dob ? new Date(customer.dob) : undefined,
        drivingLicenceNumber: customer.drivingLicenceNumber,
        licenceExpiryDate: customer.licenceExpiryDate ? new Date(customer.licenceExpiryDate) : undefined,
        governmentIdNumber: customer.governmentIdNumber,
        status: customer.status as any,
        notes: customer.notes,
        isArchived: customer.isArchived,
      }
    });
  }
  console.log(`✅ ${initialCustomers.length} Customers seeded`);

  // 4. Vehicles
  for (const v of initialVehicles) {
    const vehicle = await prisma.vehicle.upsert({
      where: { registrationNumber: v.registrationNumber },
      update: {},
      create: {
        id: v.id,
        registrationNumber: v.registrationNumber,
        type: v.type as any,
        brand: v.brand,
        model: v.model,
        year: v.year,
        fuelType: v.fuelType as any,
        transmission: v.transmission as any,
        seatingCapacity: v.seatingCapacity,
        dailyPrice: v.dailyPrice,
        securityDeposit: v.securityDeposit,
        odometerReading: v.odometerReading,
        status: v.status as any,
        insuranceExpiryDate: v.insuranceExpiryDate ? new Date(v.insuranceExpiryDate) : undefined,
        registrationExpiryDate: v.registrationExpiryDate ? new Date(v.registrationExpiryDate) : undefined,
        pollutionExpiryDate: v.pollutionExpiryDate ? new Date(v.pollutionExpiryDate) : undefined,
        notes: v.notes,
        isArchived: v.isArchived,
      }
    });

    for (const img of v.images) {
      await prisma.vehicleImage.create({
        data: {
          id: img.id,
          vehicleId: vehicle.id,
          url: img.url,
          caption: img.caption,
          isPrimary: img.isPrimary,
        }
      });
    }
  }
  console.log(`✅ ${initialVehicles.length} Vehicles & images seeded`);

  // 5. Bookings & Invoices
  for (const b of initialBookings) {
    await prisma.booking.upsert({
      where: { bookingNumber: b.bookingNumber },
      update: {},
      create: {
        id: b.id,
        bookingNumber: b.bookingNumber,
        customerId: b.customerId,
        vehicleId: b.vehicleId,
        pickupLocation: b.pickupLocation,
        dropoffLocation: b.dropoffLocation,
        pickupDate: new Date(b.pickupDate),
        returnDate: new Date(b.returnDate),
        actualReturnDate: b.actualReturnDate ? new Date(b.actualReturnDate) : undefined,
        dailyRate: b.dailyRate,
        days: b.days,
        securityDeposit: b.securityDeposit,
        discount: b.discount,
        taxRate: b.taxRate,
        taxAmount: b.taxAmount,
        totalAmount: b.totalAmount,
        advancePayment: b.advancePayment,
        balanceAmount: b.balanceAmount,
        status: b.status as any,
        cancellationReason: b.cancellationReason,
        cancelledAt: b.cancelledAt ? new Date(b.cancelledAt) : undefined,
        notes: b.notes,
      }
    });
  }
  console.log(`✅ ${initialBookings.length} Bookings seeded`);

  // 6. Payments
  for (const p of initialPayments) {
    await prisma.payment.upsert({
      where: { paymentNumber: p.paymentNumber },
      update: {},
      create: {
        id: p.id,
        paymentNumber: p.paymentNumber,
        bookingId: p.bookingId,
        customerId: p.customerId,
        amount: p.amount,
        paymentMethod: p.paymentMethod as any,
        paymentStatus: p.paymentStatus as any,
        transactionReference: p.transactionReference,
        notes: p.notes,
        paymentDate: new Date(p.paymentDate),
      }
    });
  }
  console.log(`✅ ${initialPayments.length} Payments seeded`);

  // 7. Maintenance
  for (const m of initialMaintenance) {
    await prisma.maintenanceRecord.create({
      data: {
        id: m.id,
        vehicleId: m.vehicleId,
        maintenanceType: m.maintenanceType,
        serviceDate: new Date(m.serviceDate),
        nextServiceDate: m.nextServiceDate ? new Date(m.nextServiceDate) : undefined,
        cost: m.cost,
        odometerReading: m.odometerReading,
        serviceProvider: m.serviceProvider,
        description: m.description,
        status: m.status as any,
      }
    });
  }
  console.log(`✅ ${initialMaintenance.length} Maintenance records seeded`);

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
