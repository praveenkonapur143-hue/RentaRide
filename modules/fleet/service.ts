import { dataStore } from '@/lib/data-store';
import { DemoVehicle } from '@/lib/demo-data';
import { FleetSummary, VehicleFilterParams, VehicleStatus } from './types';

export class FleetService {
  static getAllVehicles(filters?: VehicleFilterParams): DemoVehicle[] {
    let vehicles = dataStore.getVehicles({
      type: filters?.type,
      status: filters?.status,
      search: filters?.search,
      includeArchived: filters?.includeArchived,
    });

    if (filters?.minPrice !== undefined) {
      vehicles = vehicles.filter(v => v.dailyPrice >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      vehicles = vehicles.filter(v => v.dailyPrice <= filters.maxPrice!);
    }
    if (filters?.fuelType && filters.fuelType !== 'ALL') {
      vehicles = vehicles.filter(v => v.fuelType === filters.fuelType);
    }
    if (filters?.transmission && filters.transmission !== 'ALL') {
      vehicles = vehicles.filter(v => v.transmission === filters.transmission);
    }
    if (filters?.seats) {
      vehicles = vehicles.filter(v => v.seatingCapacity >= filters.seats!);
    }

    return vehicles;
  }

  static getVehicleById(id: string): DemoVehicle | undefined {
    return dataStore.getVehicleById(id);
  }

  static createVehicle(data: Partial<DemoVehicle>): DemoVehicle {
    return dataStore.createVehicle(data);
  }

  static updateVehicle(id: string, updates: Partial<DemoVehicle>): DemoVehicle | null {
    return dataStore.updateVehicle(id, updates);
  }

  static updateStatus(id: string, status: VehicleStatus): DemoVehicle | null {
    return dataStore.updateVehicle(id, { status });
  }

  static archiveVehicle(id: string): DemoVehicle | null {
    return dataStore.archiveVehicle(id);
  }

  static getFleetSummary(): FleetSummary {
    const all = dataStore.getVehicles({ includeArchived: true });
    return {
      total: all.filter(v => !v.isArchived).length,
      available: all.filter(v => v.status === 'AVAILABLE' && !v.isArchived).length,
      booked: all.filter(v => v.status === 'BOOKED' && !v.isArchived).length,
      rented: all.filter(v => v.status === 'RENTED' && !v.isArchived).length,
      underMaintenance: all.filter(v => v.status === 'UNDER_MAINTENANCE' && !v.isArchived).length,
      archived: all.filter(v => v.isArchived).length,
    };
  }

  static getExpiringDocuments(daysThreshold: number = 30) {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    const vehicles = dataStore.getVehicles({ includeArchived: false });
    const alerts: { vehicleId: string; registrationNumber: string; brand: string; model: string; docType: string; expiryDate: string; isExpired: boolean }[] = [];

    for (const v of vehicles) {
      if (v.insuranceExpiryDate) {
        const d = new Date(v.insuranceExpiryDate);
        if (d <= thresholdDate) {
          alerts.push({
            vehicleId: v.id,
            registrationNumber: v.registrationNumber,
            brand: v.brand,
            model: v.model,
            docType: 'Insurance',
            expiryDate: v.insuranceExpiryDate,
            isExpired: d < now,
          });
        }
      }
      if (v.registrationExpiryDate) {
        const d = new Date(v.registrationExpiryDate);
        if (d <= thresholdDate) {
          alerts.push({
            vehicleId: v.id,
            registrationNumber: v.registrationNumber,
            brand: v.brand,
            model: v.model,
            docType: 'Registration',
            expiryDate: v.registrationExpiryDate,
            isExpired: d < now,
          });
        }
      }
      if (v.pollutionExpiryDate) {
        const d = new Date(v.pollutionExpiryDate);
        if (d <= thresholdDate) {
          alerts.push({
            vehicleId: v.id,
            registrationNumber: v.registrationNumber,
            brand: v.brand,
            model: v.model,
            docType: 'Pollution Certificate',
            expiryDate: v.pollutionExpiryDate,
            isExpired: d < now,
          });
        }
      }
    }

    return alerts;
  }
}
