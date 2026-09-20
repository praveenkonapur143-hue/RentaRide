import { MaintenanceService } from '../modules/maintenance/service';
import { dataStore } from '../lib/data-store';

export async function checkExpiringDocuments() {
  console.log('🔍 [Worker] Scanning vehicle document expiry dates...');
  const alerts = MaintenanceService.getExpiryRadar();

  let newNotificationsCount = 0;
  for (const alert of alerts) {
    if (alert.severity === 'CRITICAL' || alert.severity === 'WARNING') {
      dataStore.createAuditLog('DOCUMENT_EXPIRY_SCAN', 'VEHICLE', alert.vehicleId, {
        title: alert.title,
        expiryDate: alert.expiryDate,
        daysRemaining: alert.daysRemaining,
      });
      newNotificationsCount++;
    }
  }

  console.log(`✅ [Worker] Scanned ${alerts.length} expiring items. Flagged ${newNotificationsCount} alerts.`);
  return alerts;
}

if (require.main === module) {
  checkExpiringDocuments()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
