import { dataStore } from '@/lib/data-store';
import { DemoMaintenance } from '@/lib/demo-data';
import { ExpiryAlert } from './types';

export class MaintenanceService {
  static getAllMaintenance(filters?: { vehicleId?: string; status?: string }): DemoMaintenance[] {
    return dataStore.getMaintenance(filters);
  }

  static createMaintenance(data: Partial<DemoMaintenance>): DemoMaintenance {
    const record = dataStore.createMaintenance(data);
    dataStore.createAuditLog('CREATE_MAINTENANCE', 'MAINTENANCE', record.id, {
      vehicleId: data.vehicleId,
      type: data.maintenanceType,
      cost: data.cost,
    });
    return record;
  }

  /**
   * Generates expiry and maintenance alerts for vehicles.
   */
  static getExpiryRadar(): ExpiryAlert[] {
    const vehicles = dataStore.getVehicles({ includeArchived: false });
    const now = new Date();
    const alerts: ExpiryAlert[] = [];

    vehicles.forEach(v => {
      // 1. Insurance
      if (v.insuranceExpiryDate) {
        const exp = new Date(v.insuranceExpiryDate);
        const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 60) {
          alerts.push({
            id: `alert-ins-${v.id}`,
            vehicleId: v.id,
            registrationNumber: v.registrationNumber,
            brand: v.brand,
            model: v.model,
            title: 'Insurance Policy Expiry',
            expiryDate: v.insuranceExpiryDate,
            daysRemaining: diffDays,
            severity: diffDays < 0 ? 'CRITICAL' : (diffDays <= 15 ? 'WARNING' : 'INFO'),
            isExpired: diffDays < 0,
          });
        }
      }

      // 2. Pollution Certificate
      if (v.pollutionExpiryDate) {
        const exp = new Date(v.pollutionExpiryDate);
        const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 45) {
          alerts.push({
            id: `alert-puc-${v.id}`,
            vehicleId: v.id,
            registrationNumber: v.registrationNumber,
            brand: v.brand,
            model: v.model,
            title: 'Pollution Certificate Expiry',
            expiryDate: v.pollutionExpiryDate,
            daysRemaining: diffDays,
            severity: diffDays < 0 ? 'CRITICAL' : (diffDays <= 10 ? 'WARNING' : 'INFO'),
            isExpired: diffDays < 0,
          });
        }
      }

      // 3. Registration Expiry
      if (v.registrationExpiryDate) {
        const exp = new Date(v.registrationExpiryDate);
        const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 60) {
          alerts.push({
            id: `alert-reg-${v.id}`,
            vehicleId: v.id,
            registrationNumber: v.registrationNumber,
            brand: v.brand,
            model: v.model,
            title: 'Vehicle Registration Expiry',
            expiryDate: v.registrationExpiryDate,
            daysRemaining: diffDays,
            severity: diffDays < 0 ? 'CRITICAL' : (diffDays <= 15 ? 'WARNING' : 'INFO'),
            isExpired: diffDays < 0,
          });
        }
      }
    });

    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }
}
