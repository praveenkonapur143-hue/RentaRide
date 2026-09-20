export type MaintenanceType =
  | 'ROUTINE_SERVICE'
  | 'OIL_CHANGE'
  | 'BRAKE_SERVICE'
  | 'TYRE_REPLACEMENT'
  | 'ENGINE_REPAIR'
  | 'BODYWORK'
  | 'OTHER';

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ExpiryAlert {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  brand: string;
  model: string;
  title: string;
  expiryDate: string;
  daysRemaining: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  isExpired: boolean;
}
