export type VehicleType = 'HATCHBACK' | 'SEDAN' | 'SUV' | 'MPV' | 'LUXURY' | 'CAR';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
export type TransmissionType = 'AUTOMATIC' | 'MANUAL';
export type VehicleStatus = 'AVAILABLE' | 'BOOKED' | 'RENTED' | 'UNDER_MAINTENANCE' | 'ARCHIVED';

export interface VehicleFilterParams {
  type?: string;
  status?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  includeArchived?: boolean;
}

export interface FleetSummary {
  total: number;
  available: number;
  booked: number;
  rented: number;
  underMaintenance: number;
  archived: number;
}
