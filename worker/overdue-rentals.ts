import { dataStore } from '../lib/data-store';

export async function checkOverdueRentals() {
  console.log('🔍 [Worker] Scanning active rentals for overdue returns...');
  const bookings = dataStore.getBookings();
  const now = new Date();
  let overdueCount = 0;

  for (const b of bookings) {
    if (b.status === 'ACTIVE_RENTAL') {
      const returnDate = new Date(b.returnDate);
      if (returnDate < now) {
        // Mark as overdue
        dataStore.updateBooking(b.id, { status: 'OVERDUE' });
        dataStore.createAuditLog('MARK_BOOKING_OVERDUE', 'BOOKING', b.id, {
          bookingNumber: b.bookingNumber,
          scheduledReturn: b.returnDate,
        });
        overdueCount++;
      }
    }
  }

  console.log(`✅ [Worker] Overdue scan complete. Found and updated ${overdueCount} overdue bookings.`);
  return overdueCount;
}

if (require.main === module) {
  checkOverdueRentals()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
