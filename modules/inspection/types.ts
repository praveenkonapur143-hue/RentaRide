export type InspectionType = 'CHECK_OUT' | 'RETURN';

export interface InspectionData {
  bookingId: string;
  vehicleId: string;
  type: InspectionType;
  odometerReading: number;
  fuelLevel: string;
  exteriorCondition: string;
  interiorCondition: string;
  tyresCondition: string;
  lightsCondition: string;
  mirrorsCondition: string;
  existingDamage?: string;
  newDamage?: string;
  customerSignature?: string;
  staffName: string;
  notes?: string;
  photos?: { id: string; photoUrl: string; caption?: string; area?: string }[];
}

export interface InspectionComparison {
  odometerDiffKm: number;
  fuelStart: string;
  fuelEnd: string;
  fuelDeficitPct: number;
  fuelCharge: number;
  lateHours: number;
  lateDays: number;
  lateCharge: number;
  hasNewDamage: boolean;
}
