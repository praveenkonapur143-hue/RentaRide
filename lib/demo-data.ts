export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  passwordHash: string; // bcrypt hash for 'admin123' and 'staff123'
  createdAt: string;
}

export interface DemoVehicle {
  id: string;
  registrationNumber: string;
  type: 'HATCHBACK' | 'SEDAN' | 'SUV' | 'MPV' | 'LUXURY' | 'CAR';
  brand: string;
  model: string;
  year: number;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  transmission: 'AUTOMATIC' | 'MANUAL';
  seatingCapacity: number;
  dailyPrice: number;
  hourlyRate?: number;
  securityDeposit: number;
  odometerReading: number;
  status: 'AVAILABLE' | 'BOOKED' | 'RENTED' | 'UNDER_MAINTENANCE' | 'ARCHIVED';
  rating?: number;
  tripsCount?: number;
  fastagEnabled?: boolean;
  insuranceExpiryDate: string;
  registrationExpiryDate: string;
  pollutionExpiryDate: string;
  images: { id: string; url: string; caption?: string; isPrimary: boolean }[];
  documents: { id: string; name: string; documentType: string; fileUrl: string; expiryDate: string }[];
  notes?: string;
  isArchived: boolean;
  createdAt: string;
}

export interface DemoCustomer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  drivingLicenceNumber: string;
  licenceExpiryDate: string;
  governmentIdNumber: string; // Aadhaar / PAN
  idDocumentUrl?: string;
  licenceDocumentUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  notes?: string;
  isArchived: boolean;
  createdAt: string;
}

export interface DemoBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  vehicleId: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  actualReturnDate?: string;
  dailyRate: number;
  days: number;
  securityDeposit: number;
  discount: number;
  taxRate: number; // 18% GST in India
  taxAmount: number;
  totalAmount: number;
  advancePayment: number;
  balanceAmount: number;
  kmPackage?: 'standard' | 'traveler' | 'unlimited';
  protectionPlan?: 'standard' | 'peace_of_mind';
  deliveryMode?: 'HUB_PICKUP' | 'DOORSTEP_DELIVERY';
  deliveryFee?: number;
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE_RENTAL' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
  cancellationReason?: string;
  cancelledAt?: string;
  notes?: string;
  createdAt: string;
}

export interface DemoPayment {
  id: string;
  paymentNumber: string;
  bookingId: string;
  customerId: string;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'FAILED';
  transactionReference?: string;
  notes?: string;
  paymentDate: string;
  createdAt: string;
}

export interface DemoInvoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number; // 18% GST
  discountAmount: number;
  lateFees: number;
  damageFees: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  notes?: string;
  createdAt: string;
}

export interface DemoInspection {
  id: string;
  bookingId: string;
  vehicleId: string;
  type: 'CHECK_OUT' | 'RETURN';
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
  inspectionDate: string;
  notes?: string;
  photos: { id: string; photoUrl: string; caption?: string; area?: string }[];
  createdAt: string;
}

export interface DemoDamageReport {
  id: string;
  reportNumber: string;
  bookingId: string;
  vehicleId: string;
  customerId: string;
  damageType: string;
  description: string;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  estimatedCost: number;
  finalCharge: number;
  repairStatus: 'PENDING' | 'UNDER_REPAIR' | 'REPAIRED';
  responsibility: 'CUSTOMER' | 'BUSINESS' | 'THIRD_PARTY' | 'INSURANCE';
  beforePhotos?: string[];
  afterPhotos?: string[];
  notes?: string;
  createdAt: string;
}

export interface DemoMaintenance {
  id: string;
  vehicleId: string;
  maintenanceType: string;
  serviceDate: string;
  nextServiceDate: string;
  cost: number;
  odometerReading: number;
  serviceProvider: string;
  description: string;
  invoiceUrl?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface DemoBusinessSettings {
  id: string;
  businessName: string;
  tagline: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  lateFeePerHour: number;
  lateFeePerDay: number;
  defaultDeposit: number;
  rentalPolicy: string;
  cancellationPolicy: string;
  termsAndConditions: string;
  gstin?: string;
}

// Pre-hashed bcrypt for 'admin123' and 'staff123'
const ADMIN_HASH = '$2a$10$wN9r8nE83Y0eYjD7BqI0.O0J81YxZqVjHk8K6L/eT7UjUvWv0nZ4q'; // admin123
const STAFF_HASH = '$2a$10$kP7x3zE72W1eXkD6AqH9.O9I70XxYpVjHk7K5L/eT6UiUuWv9mY3p'; // staff123

export const initialUsers: DemoUser[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@rentaride.com',
    name: 'Rajesh Menon',
    role: 'ADMIN',
    phone: '+91 98101 23456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isActive: true,
    passwordHash: ADMIN_HASH,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-staff-01',
    email: 'staff@rentaride.com',
    name: 'Sunita Rao',
    role: 'STAFF',
    phone: '+91 98450 67890',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    isActive: true,
    passwordHash: STAFF_HASH,
    createdAt: '2025-01-10T00:00:00.000Z',
  },
];

export const initialVehicles: DemoVehicle[] = [
  {
    id: 'veh-01',
    registrationNumber: 'DL 01 AB 4321',
    type: 'HATCHBACK',
    brand: 'Maruti Suzuki',
    model: 'Swift ZXi+',
    year: 2024,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    seatingCapacity: 5,
    dailyPrice: 1800,
    hourlyRate: 75,
    securityDeposit: 2000,
    odometerReading: 14200,
    status: 'AVAILABLE',
    rating: 4.88,
    tripsCount: 142,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-04-15',
    registrationExpiryDate: '2027-05-20',
    pollutionExpiryDate: '2026-11-10',
    notes: 'SmartPlay Pro+ touchscreen, 24.8 km/l mileage, Cruise Control, Reverse Camera, FASTag active.',
    isArchived: false,
    createdAt: '2025-01-15T08:00:00.000Z',
    images: [
      { id: 'img-1', url: '/images/cars/swift.jpg', caption: 'Maruti Suzuki Swift ZXi+ Red Hatchback', isPrimary: true },
    ],
    documents: [
      { id: 'doc-1', name: 'Comprehensive Insurance Policy', documentType: 'Insurance', fileUrl: '/docs/swift_insurance.pdf', expiryDate: '2027-04-15' },
      { id: 'doc-2', name: 'PUC Certificate', documentType: 'Pollution', fileUrl: '/docs/swift_puc.pdf', expiryDate: '2026-11-10' }
    ]
  },
  {
    id: 'veh-02',
    registrationNumber: 'KA 05 MN 3290',
    type: 'HATCHBACK',
    brand: 'Maruti Suzuki',
    model: 'Baleno Alpha',
    year: 2024,
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    seatingCapacity: 5,
    dailyPrice: 2100,
    hourlyRate: 90,
    securityDeposit: 2500,
    odometerReading: 11500,
    status: 'AVAILABLE',
    rating: 4.89,
    tripsCount: 130,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-06-10',
    registrationExpiryDate: '2027-08-15',
    pollutionExpiryDate: '2027-08-15',
    notes: 'Head-up Display (HUD), 360 View Camera, 9-inch SmartPlay Pro+, 6 airbags, Arkamys Surround Sound.',
    isArchived: false,
    createdAt: '2025-02-01T09:00:00.000Z',
    images: [
      { id: 'img-2', url: '/images/cars/baleno.jpg', caption: 'Maruti Suzuki Baleno Alpha Premium Hatchback', isPrimary: true },
    ],
    documents: [
      { id: 'doc-baleno-1', name: 'Comprehensive Insurance Policy', documentType: 'Insurance', fileUrl: '/docs/baleno_insurance.pdf', expiryDate: '2027-06-10' }
    ]
  },
  {
    id: 'veh-03',
    registrationNumber: 'GA 03 AB 9999',
    type: 'SUV',
    brand: 'Mahindra',
    model: 'Thar LX Hard Top 4x4',
    year: 2024,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    seatingCapacity: 4,
    dailyPrice: 4500,
    hourlyRate: 190,
    securityDeposit: 5000,
    odometerReading: 12400,
    status: 'AVAILABLE',
    rating: 4.97,
    tripsCount: 215,
    fastagEnabled: true,
    insuranceExpiryDate: '2026-10-30',
    registrationExpiryDate: '2026-11-25',
    pollutionExpiryDate: '2026-10-15',
    notes: 'Iconic 4x4 off-road transfer case, convertible hard-top, all-terrain AT tyres, rugged sound bar, 226mm ground clearance.',
    isArchived: false,
    createdAt: '2025-01-20T10:00:00.000Z',
    images: [
      { id: 'img-3', url: '/images/cars/thar.jpg', caption: 'Mahindra Thar LX Hard Top 4x4 Offroader', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-04',
    registrationNumber: 'MH 12 TS 3412',
    type: 'SUV',
    brand: 'Tata',
    model: 'Nexon Fearless+ S',
    year: 2024,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 5,
    dailyPrice: 2600,
    hourlyRate: 110,
    securityDeposit: 3000,
    odometerReading: 22100,
    status: 'AVAILABLE',
    rating: 4.88,
    tripsCount: 164,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-01-18',
    registrationExpiryDate: '2027-02-28',
    pollutionExpiryDate: '2027-01-18',
    notes: '5-Star Global NCAP safety rating, JBL 9-speaker system, sequential LED DRLs, wireless charging, ventilated seats.',
    isArchived: false,
    createdAt: '2025-01-25T11:00:00.000Z',
    images: [
      { id: 'img-4', url: '/images/cars/nexon.jpg', caption: 'Tata Nexon Fearless+ S Compact SUV', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-05',
    registrationNumber: 'KA 04 MP 4455',
    type: 'MPV',
    brand: 'Toyota',
    model: 'Innova Crysta 2.4 VX',
    year: 2023,
    fuelType: 'DIESEL',
    transmission: 'MANUAL',
    seatingCapacity: 7,
    dailyPrice: 4200,
    hourlyRate: 175,
    securityDeposit: 5000,
    odometerReading: 45200,
    status: 'AVAILABLE',
    rating: 4.95,
    tripsCount: 310,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-09-01',
    registrationExpiryDate: '2027-09-15',
    pollutionExpiryDate: '2027-09-01',
    notes: 'Captain chairs, massive 7-passenger capacity, rear automatic AC, supreme highway touring comfort, bulletproof reliability.',
    isArchived: false,
    createdAt: '2025-02-10T12:00:00.000Z',
    images: [
      { id: 'img-5', url: '/images/cars/innova.jpg', caption: 'Toyota Innova Crysta 2.4 VX 7-Seater Family Tourer', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-06',
    registrationNumber: 'UP 16 BK 7007',
    type: 'SUV',
    brand: 'Mahindra',
    model: 'Scorpio-N Z8L 4x4',
    year: 2024,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 7,
    dailyPrice: 4800,
    hourlyRate: 200,
    securityDeposit: 6000,
    odometerReading: 16800,
    status: 'AVAILABLE',
    rating: 4.93,
    tripsCount: 122,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-03-22',
    registrationExpiryDate: '2027-04-30',
    pollutionExpiryDate: '2027-03-22',
    notes: 'Sony 3D Immersive audio with 12 speakers, 4XPLOR terrain modes, 7 seats, muscular road presence, shift-on-fly 4WD.',
    isArchived: false,
    createdAt: '2025-01-05T09:00:00.000Z',
    images: [
      { id: 'img-6', url: '/images/cars/scorpio.jpg', caption: 'Mahindra Scorpio-N Z8L 4x4 7-Seater SUV', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-07',
    registrationNumber: 'DL 08 EV 1024',
    type: 'HATCHBACK',
    brand: 'Tata',
    model: 'Tiago EV Tech Lux',
    year: 2024,
    fuelType: 'ELECTRIC',
    transmission: 'AUTOMATIC',
    seatingCapacity: 5,
    dailyPrice: 1900,
    hourlyRate: 80,
    securityDeposit: 2500,
    odometerReading: 9200,
    status: 'AVAILABLE',
    rating: 4.82,
    tripsCount: 89,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-11-10',
    registrationExpiryDate: '2027-12-05',
    pollutionExpiryDate: '2027-11-10',
    notes: '24 kWh IP67 battery, 315 km MIDC range, multi-mode regen, connected car telematics, fast CCS2 charging ready.',
    isArchived: false,
    createdAt: '2025-02-14T08:00:00.000Z',
    images: [
      { id: 'img-7', url: '/images/cars/tiago.jpg', caption: 'Tata Tiago EV Electric Hatchback', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-08',
    registrationNumber: 'MH 02 EQ 5566',
    type: 'SEDAN',
    brand: 'Honda',
    model: 'City ZX',
    year: 2024,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 5,
    dailyPrice: 3200,
    hourlyRate: 130,
    securityDeposit: 4000,
    odometerReading: 19400,
    status: 'AVAILABLE',
    rating: 4.91,
    tripsCount: 176,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-02-19',
    registrationExpiryDate: '2027-03-25',
    pollutionExpiryDate: '2027-02-19',
    notes: '1.5L i-VTEC engine, Honda SENSING ADAS suite, plush leather upholstery, electric sunroof, LaneWatch blind spot camera.',
    isArchived: false,
    createdAt: '2025-01-28T10:00:00.000Z',
    images: [
      { id: 'img-8', url: '/images/cars/city.jpg', caption: 'Honda City ZX i-VTEC Executive Sedan', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-09',
    registrationNumber: 'DL 03 CL 0001',
    type: 'SUV',
    brand: 'Toyota',
    model: 'Fortuner Legender 4x4',
    year: 2024,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 7,
    dailyPrice: 8500,
    hourlyRate: 350,
    securityDeposit: 15000,
    odometerReading: 24000,
    status: 'AVAILABLE',
    rating: 4.98,
    tripsCount: 145,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-05-02',
    registrationExpiryDate: '2027-06-15',
    pollutionExpiryDate: '2027-05-02',
    notes: '2.8L turbo-diesel 500Nm torque, dual-tone roof, kick-sensor powered tailgate, VIP road presence, paddle shifters.',
    isArchived: false,
    createdAt: '2025-02-25T11:00:00.000Z',
    images: [
      { id: 'img-9', url: '/images/cars/fortuner.jpg', caption: 'Toyota Fortuner Legender 4x4 Luxury SUV', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-10',
    registrationNumber: 'HR 26 DQ 8821',
    type: 'SUV',
    brand: 'Hyundai',
    model: 'Creta SX (O)',
    year: 2024,
    fuelType: 'DIESEL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 5,
    dailyPrice: 3400,
    hourlyRate: 140,
    securityDeposit: 4000,
    odometerReading: 18600,
    status: 'AVAILABLE',
    rating: 4.92,
    tripsCount: 198,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-06-10',
    registrationExpiryDate: '2027-08-15',
    pollutionExpiryDate: '2027-08-15',
    notes: 'Panoramic Sunroof, Bose 8-Speaker Audio, Ventilated Front Seats, Level 2 ADAS, dual-zone climate control.',
    isArchived: false,
    createdAt: '2025-02-01T09:00:00.000Z',
    images: [
      { id: 'img-10', url: '/images/cars/creta.png', caption: 'Hyundai Creta SX (O) Midsize SUV', isPrimary: true },
    ],
    documents: [
      { id: 'doc-3', name: 'HDFC ERGO Comprehensive Cover', documentType: 'Insurance', fileUrl: '/docs/creta_insurance.pdf', expiryDate: '2027-06-10' }
    ]
  },
  {
    id: 'veh-11',
    registrationNumber: 'DL 09 PQ 4040',
    type: 'SUV',
    brand: 'Kia',
    model: 'Seltos GTX+ Turbo',
    year: 2024,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 5,
    dailyPrice: 3500,
    hourlyRate: 145,
    securityDeposit: 4000,
    odometerReading: 15400,
    status: 'AVAILABLE',
    rating: 4.93,
    tripsCount: 168,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-08-11',
    registrationExpiryDate: '2027-09-01',
    pollutionExpiryDate: '2027-08-11',
    notes: '1.5L Turbo petrol with 7-speed DCT, dual 10.25-inch panoramic screens, ADAS Level 2, 360-degree camera.',
    isArchived: false,
    createdAt: '2025-02-18T10:00:00.000Z',
    images: [
      { id: 'img-11', url: '/images/cars/seltos.jpg', caption: 'Kia Seltos GTX+ Turbo Urban SUV', isPrimary: true }
    ],
    documents: []
  },
  {
    id: 'veh-12',
    registrationNumber: 'MH 14 GT 9988',
    type: 'SEDAN',
    brand: 'Volkswagen',
    model: 'Virtus GT Plus DSG',
    year: 2024,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC',
    seatingCapacity: 5,
    dailyPrice: 3300,
    hourlyRate: 135,
    securityDeposit: 4000,
    odometerReading: 13800,
    status: 'AVAILABLE',
    rating: 4.94,
    tripsCount: 135,
    fastagEnabled: true,
    insuranceExpiryDate: '2027-07-22',
    registrationExpiryDate: '2027-08-30',
    pollutionExpiryDate: '2027-07-22',
    notes: '1.5L TSI EVO engine with Active Cylinder Tech, 7-speed DSG, 521-litre boot, 5-Star Global NCAP safety.',
    isArchived: false,
    createdAt: '2025-01-14T09:00:00.000Z',
    images: [
      { id: 'img-12', url: '/images/cars/virtus.png', caption: 'Volkswagen Virtus GT Plus DSG Turbo Sedan', isPrimary: true }
    ],
    documents: []
  },
];

export const initialCustomers: DemoCustomer[] = [
  {
    id: 'cust-01',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    phone: '+91 98450 12399',
    address: 'B-402, Palm Meadows, Whitefield, Bengaluru, Karnataka 560066',
    dob: '1990-05-14',
    drivingLicenceNumber: 'KA-0520190089123',
    licenceExpiryDate: '2039-05-14',
    governmentIdNumber: 'XXXX-XXXX-8921',
    status: 'ACTIVE',
    notes: 'Frequent tech executive renter, highly rated, always returns sanitized with full tank.',
    isArchived: false,
    createdAt: '2025-01-10T10:00:00.000Z',
  },
  {
    id: 'cust-02',
    fullName: 'Priya Patel',
    email: 'priya.patel@example.in',
    phone: '+91 98201 44521',
    address: '14/B, Sea Face Apartments, Worli, Mumbai, Maharashtra 400018',
    dob: '1993-08-22',
    drivingLicenceNumber: 'MH-0120200045612',
    licenceExpiryDate: '2040-08-22',
    governmentIdNumber: 'XXXX-XXXX-4512',
    status: 'ACTIVE',
    notes: 'Prefers automatic SUVs for Pune and Lonavala weekend getaways. DigiLocker verified.',
    isArchived: false,
    createdAt: '2025-01-15T11:00:00.000Z',
  },
  {
    id: 'cust-03',
    fullName: 'Rahul Verma',
    email: 'rahul.verma@example.in',
    phone: '+91 98112 33445',
    address: 'Plot 88, Sector 44, Gurugram, Delhi NCR 122003',
    dob: '1987-11-03',
    drivingLicenceNumber: 'DL-0420180054321',
    licenceExpiryDate: '2037-11-03',
    governmentIdNumber: 'XXXX-XXXX-7723',
    status: 'ACTIVE',
    notes: 'Corporate account with CyberHub delivery requests. Always opts for Peace of Mind protection.',
    isArchived: false,
    createdAt: '2025-01-20T12:00:00.000Z',
  },
  {
    id: 'cust-04',
    fullName: 'Ananya Iyer',
    email: 'ananya.iyer@example.in',
    phone: '+91 94441 55667',
    address: '72/3, 4th Cross, Indiranagar, Bengaluru, Karnataka 560038',
    dob: '1995-02-18',
    drivingLicenceNumber: 'KA-0320210098765',
    licenceExpiryDate: '2041-02-18',
    governmentIdNumber: 'XXXX-XXXX-3341',
    status: 'ACTIVE',
    notes: 'Prefers EV city hatchbacks and Ather scooters for local commute.',
    isArchived: false,
    createdAt: '2025-01-25T13:00:00.000Z',
  },
  {
    id: 'cust-05',
    fullName: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.in',
    phone: '+91 98710 99887',
    address: 'Villa 12, Nirvana Country, Sector 50, Gurugram, Haryana 122018',
    dob: '1985-09-10',
    drivingLicenceNumber: 'HR-2620170067812',
    licenceExpiryDate: '2035-09-10',
    governmentIdNumber: 'XXXX-XXXX-6619',
    status: 'ACTIVE',
    notes: 'Rents luxury SUVs and Fortuner for family trips to Shimla & Jaipur.',
    isArchived: false,
    createdAt: '2025-02-01T14:00:00.000Z',
  },
  {
    id: 'cust-06',
    fullName: 'Arjun Reddy',
    email: 'arjun.reddy@example.in',
    phone: '+91 98850 77889',
    address: 'Flat 301, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
    dob: '1991-12-05',
    drivingLicenceNumber: 'TS-0920190087654',
    licenceExpiryDate: '2039-12-05',
    governmentIdNumber: 'XXXX-XXXX-9901',
    status: 'ACTIVE',
    notes: 'Off-road and adventure enthusiast. Frequently books Thar 4x4 in Goa and Coorg.',
    isArchived: false,
    createdAt: '2025-02-05T15:00:00.000Z',
  },
  {
    id: 'cust-07',
    fullName: 'Neha Gupta',
    email: 'neha.gupta@example.in',
    phone: '+91 98490 22334',
    address: 'A-108, Sky High Towers, Hitec City, Hyderabad, Telangana 500081',
    dob: '1994-06-30',
    drivingLicenceNumber: 'TS-0820220012345',
    licenceExpiryDate: '2042-06-30',
    governmentIdNumber: 'XXXX-XXXX-1188',
    status: 'ACTIVE',
    notes: 'Corporate travel coordinator.',
    isArchived: false,
    createdAt: '2025-02-10T16:00:00.000Z',
  },
  {
    id: 'cust-08',
    fullName: 'Rohan Mukherjee',
    email: 'rohan.m@example.in',
    phone: '+91 98300 44332',
    address: 'Flat 4C, Alipore Road, Kolkata, West Bengal 700027',
    dob: '1989-03-25',
    drivingLicenceNumber: 'WB-0220200065432',
    licenceExpiryDate: '2039-03-25',
    governmentIdNumber: 'XXXX-XXXX-5542',
    status: 'ACTIVE',
    notes: 'Visiting Pune and Mumbai for client meetings.',
    isArchived: false,
    createdAt: '2025-02-15T17:00:00.000Z',
  },
];

export const initialBookings: DemoBooking[] = [
  {
    id: 'bk-01',
    bookingNumber: 'RR-BK-2026-101',
    customerId: 'cust-01',
    vehicleId: 'veh-02', // Hyundai Creta
    pickupLocation: 'Bengaluru - Kempegowda Airport (BLR) T1',
    dropoffLocation: 'Bengaluru - Kempegowda Airport (BLR) T1',
    pickupDate: '2026-09-18T10:00:00.000Z',
    returnDate: '2026-09-21T18:00:00.000Z',
    dailyRate: 3400,
    days: 4,
    securityDeposit: 5000,
    discount: 500,
    taxRate: 18.0, // 18% GST
    taxAmount: 2358,
    totalAmount: 15458,
    advancePayment: 15458,
    balanceAmount: 0,
    kmPackage: 'traveler',
    protectionPlan: 'peace_of_mind',
    deliveryMode: 'HUB_PICKUP',
    deliveryFee: 0,
    status: 'ACTIVE_RENTAL',
    notes: 'Customer picked up car on schedule with Aadhaar & DL verified. Heading to Chikmagalur.',
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'bk-02',
    bookingNumber: 'RR-BK-2026-102',
    customerId: 'cust-06',
    vehicleId: 'veh-03', // Mahindra Thar 4x4
    pickupLocation: 'Goa - Mopa International Airport (GOX)',
    dropoffLocation: 'Goa - Mopa International Airport (GOX)',
    pickupDate: '2026-09-22T09:00:00.000Z',
    returnDate: '2026-09-26T18:00:00.000Z',
    dailyRate: 4500,
    days: 5,
    securityDeposit: 8000,
    discount: 1000,
    taxRate: 18.0,
    taxAmount: 3870,
    totalAmount: 25370,
    advancePayment: 10000,
    balanceAmount: 15370,
    kmPackage: 'unlimited',
    protectionPlan: 'peace_of_mind',
    deliveryMode: 'HUB_PICKUP',
    deliveryFee: 0,
    status: 'CONFIRMED',
    notes: 'Pre-booked for Goa road trip. ₹10,000 advance received via UPI (PhonePe).',
    createdAt: '2026-09-16T11:00:00.000Z',
  },
  {
    id: 'bk-03',
    bookingNumber: 'RR-BK-2026-103',
    customerId: 'cust-03',
    vehicleId: 'veh-01', // Maruti Swift
    pickupLocation: 'Delhi NCR - IGI Airport T3 Terminal',
    dropoffLocation: 'Delhi NCR - CyberHub Gurugram',
    pickupDate: '2026-09-10T09:00:00.000Z',
    returnDate: '2026-09-13T18:00:00.000Z',
    actualReturnDate: '2026-09-13T17:45:00.000Z',
    dailyRate: 1800,
    days: 4,
    securityDeposit: 3000,
    discount: 0,
    taxRate: 18.0,
    taxAmount: 1296,
    totalAmount: 8496,
    advancePayment: 8496,
    balanceAmount: 0,
    kmPackage: 'standard',
    protectionPlan: 'standard',
    deliveryMode: 'DOORSTEP_DELIVERY',
    deliveryFee: 300,
    status: 'COMPLETED',
    notes: 'Successfully returned at CyberHub. Zero damage, fuel tank full, deposit refunded.',
    createdAt: '2026-09-08T09:00:00.000Z',
  },
  {
    id: 'bk-04',
    bookingNumber: 'RR-BK-2026-104',
    customerId: 'cust-05',
    vehicleId: 'veh-09', // Toyota Fortuner Legender
    pickupLocation: 'Delhi NCR - CyberHub Gurugram',
    dropoffLocation: 'Delhi NCR - CyberHub Gurugram',
    pickupDate: '2026-09-25T08:00:00.000Z',
    returnDate: '2026-09-28T20:00:00.000Z',
    dailyRate: 8500,
    days: 4,
    securityDeposit: 20000,
    discount: 1500,
    taxRate: 18.0,
    taxAmount: 5850,
    totalAmount: 38350,
    advancePayment: 15000,
    balanceAmount: 23350,
    kmPackage: 'unlimited',
    protectionPlan: 'peace_of_mind',
    deliveryMode: 'DOORSTEP_DELIVERY',
    deliveryFee: 300,
    status: 'CONFIRMED',
    notes: 'Family trip to Ranthambore & Jaipur. Advance ₹15,000 paid via Net Banking.',
    createdAt: '2026-09-17T12:00:00.000Z',
  },
  {
    id: 'bk-05',
    bookingNumber: 'RR-BK-2026-105',
    customerId: 'cust-04',
    vehicleId: 'veh-07', // Tata Tiago EV
    pickupLocation: 'Bengaluru - Indiranagar Metro Hub',
    dropoffLocation: 'Bengaluru - Indiranagar Metro Hub',
    pickupDate: '2026-09-12T10:00:00.000Z',
    returnDate: '2026-09-14T18:00:00.000Z',
    actualReturnDate: '2026-09-14T17:30:00.000Z',
    dailyRate: 1900,
    days: 3,
    securityDeposit: 3000,
    discount: 200,
    taxRate: 18.0,
    taxAmount: 990,
    totalAmount: 6490,
    advancePayment: 6490,
    balanceAmount: 0,
    kmPackage: 'standard',
    protectionPlan: 'standard',
    deliveryMode: 'HUB_PICKUP',
    deliveryFee: 0,
    status: 'COMPLETED',
    notes: 'City EV rental. Returned with 85% charge.',
    createdAt: '2026-09-10T10:00:00.000Z',
  }
];

export const initialPayments: DemoPayment[] = [
  {
    id: 'pay-01',
    paymentNumber: 'RR-PAY-2026-001',
    bookingId: 'bk-01',
    customerId: 'cust-01',
    amount: 15458,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    transactionReference: 'UPI-HDFC-982183921029',
    notes: 'Full payment via Google Pay UPI.',
    paymentDate: '2026-09-18T09:30:00.000Z',
    createdAt: '2026-09-18T09:30:00.000Z'
  },
  {
    id: 'pay-02',
    paymentNumber: 'RR-PAY-2026-002',
    bookingId: 'bk-02',
    customerId: 'cust-06',
    amount: 10000,
    paymentMethod: 'UPI',
    paymentStatus: 'PARTIAL',
    transactionReference: 'UPI-PHONEPE-771928341019',
    notes: 'Advance booking confirmation deposit.',
    paymentDate: '2026-09-16T11:15:00.000Z',
    createdAt: '2026-09-16T11:15:00.000Z'
  },
  {
    id: 'pay-03',
    paymentNumber: 'RR-PAY-2026-003',
    bookingId: 'bk-03',
    customerId: 'cust-03',
    amount: 8496,
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    transactionReference: 'CARD-VISA-4421',
    notes: 'Full payment via HDFC Millennia Credit Card.',
    paymentDate: '2026-09-10T08:50:00.000Z',
    createdAt: '2026-09-10T08:50:00.000Z'
  },
  {
    id: 'pay-04',
    paymentNumber: 'RR-PAY-2026-004',
    bookingId: 'bk-04',
    customerId: 'cust-05',
    amount: 15000,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'PARTIAL',
    transactionReference: 'NEFT-ICIC-20260917-00912',
    notes: 'ICICI Corporate Net Banking transfer.',
    paymentDate: '2026-09-17T12:30:00.000Z',
    createdAt: '2026-09-17T12:30:00.000Z'
  }
];

export const initialInvoices: DemoInvoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-001',
    bookingId: 'bk-01',
    customerId: 'cust-01',
    issueDate: '2026-09-18T10:00:00.000Z',
    dueDate: '2026-09-18T10:00:00.000Z',
    subtotal: 13100,
    taxAmount: 2358,
    discountAmount: 500,
    lateFees: 0,
    damageFees: 0,
    totalAmount: 15458,
    paidAmount: 15458,
    balanceDue: 0,
    status: 'PAID',
    notes: 'GST Tax Invoice (SAC 9966) - Passenger transport vehicle rental.',
    createdAt: '2026-09-18T10:00:00.000Z'
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-002',
    bookingId: 'bk-02',
    customerId: 'cust-06',
    issueDate: '2026-09-16T11:00:00.000Z',
    dueDate: '2026-09-22T09:00:00.000Z',
    subtotal: 21500,
    taxAmount: 3870,
    discountAmount: 1000,
    lateFees: 0,
    damageFees: 0,
    totalAmount: 25370,
    paidAmount: 10000,
    balanceDue: 15370,
    status: 'PARTIAL',
    notes: 'Balance payable at pickup or via UPI QR code before key handover.',
    createdAt: '2026-09-16T11:00:00.000Z'
  },
  {
    id: 'inv-03',
    invoiceNumber: 'INV-2026-003',
    bookingId: 'bk-03',
    customerId: 'cust-03',
    issueDate: '2026-09-10T09:00:00.000Z',
    dueDate: '2026-09-10T09:00:00.000Z',
    subtotal: 7200,
    taxAmount: 1296,
    discountAmount: 0,
    lateFees: 0,
    damageFees: 0,
    totalAmount: 8496,
    paidAmount: 8496,
    balanceDue: 0,
    status: 'PAID',
    notes: 'Completed & settled.',
    createdAt: '2026-09-10T09:00:00.000Z'
  }
];

export const initialInspections: DemoInspection[] = [
  {
    id: 'insp-01',
    bookingId: 'bk-01',
    vehicleId: 'veh-02', // Creta
    type: 'CHECK_OUT',
    odometerReading: 18600,
    fuelLevel: '100%',
    exteriorCondition: 'EXCELLENT',
    interiorCondition: 'CLEAN',
    tyresCondition: 'GOOD',
    lightsCondition: 'WORKING',
    mirrorsCondition: 'INTACT',
    existingDamage: 'Minor 1cm hairline clear coat brush mark on left rear fender bumper corner.',
    staffName: 'Sunita Rao',
    customerSignature: 'Aarav Sharma',
    inspectionDate: '2026-09-18T10:15:00.000Z',
    notes: 'FASTag checked (₹500 active balance), clean interior, spare wheel & toolkit verified.',
    photos: [
      { id: 'ph-1', photoUrl: '/images/cars/thar.jpg', caption: 'Front 360 Exterior', area: 'FRONT' }
    ],
    createdAt: '2026-09-18T10:15:00.000Z'
  },
  {
    id: 'insp-02',
    bookingId: 'bk-03',
    vehicleId: 'veh-01', // Swift
    type: 'RETURN',
    odometerReading: 14650,
    fuelLevel: '100%',
    exteriorCondition: 'EXCELLENT',
    interiorCondition: 'CLEAN',
    tyresCondition: 'GOOD',
    lightsCondition: 'WORKING',
    mirrorsCondition: 'INTACT',
    existingDamage: 'None',
    newDamage: 'None',
    staffName: 'Sunita Rao',
    customerSignature: 'Rahul Verma',
    inspectionDate: '2026-09-13T17:45:00.000Z',
    notes: 'Pristine return. Odometer 450 km driven. All FASTag tolls reconciled.',
    photos: [],
    createdAt: '2026-09-13T17:45:00.000Z'
  }
];

export const initialDamageReports: DemoDamageReport[] = [
  {
    id: 'dmg-01',
    reportNumber: 'DMG-2026-001',
    bookingId: 'bk-03',
    vehicleId: 'veh-01',
    customerId: 'cust-03',
    damageType: 'Bumper Scuff',
    description: 'Minor parking scrape on lower front bumper lip from curb contact.',
    severity: 'MINOR',
    estimatedCost: 1800,
    finalCharge: 0,
    repairStatus: 'REPAIRED',
    responsibility: 'BUSINESS',
    notes: 'Waived under customer loyalty goodwill.',
    createdAt: '2026-09-13T18:00:00.000Z'
  }
];

export const initialMaintenance: DemoMaintenance[] = [
  {
    id: 'maint-01',
    vehicleId: 'veh-05', // Innova Crysta
    maintenanceType: 'BRAKE_SERVICE',
    serviceDate: '2026-09-18T09:00:00.000Z',
    nextServiceDate: '2027-03-18T09:00:00.000Z',
    cost: 4500,
    odometerReading: 45200,
    serviceProvider: 'Nandi Toyota Service Centre, Bengaluru',
    description: 'Front and rear brake pads replacement, brake fluid flush, and wheel alignment.',
    status: 'COMPLETED',
    createdAt: '2026-09-18T09:00:00.000Z'
  },
  {
    id: 'maint-02',
    vehicleId: 'veh-01', // Swift
    maintenanceType: 'ROUTINE_SERVICE',
    serviceDate: '2026-08-15T10:00:00.000Z',
    nextServiceDate: '2026-11-15T10:00:00.000Z',
    cost: 3200,
    odometerReading: 12000,
    serviceProvider: 'Maruti Suzuki Arena Authorized Care, Delhi',
    description: '10,000 km scheduled periodic service, engine oil synthetic replacement, filter cleaning.',
    status: 'COMPLETED',
    createdAt: '2026-08-15T10:00:00.000Z'
  }
];

export const initialSettings: DemoBusinessSettings = {
  id: 'settings-global-01',
  businessName: 'RentaRide • Self-Drive Mobility',
  tagline: 'Never Stop Living. Self-Drive Cars Across India.',
  logoUrl: '/logo.svg',
  email: 'support@rentaride.in',
  phone: '+91 1800 209 7433',
  address: 'Ground Floor, Cyber One Building, Sector 30, Gurugram, Delhi NCR 122001, India',
  currency: 'INR',
  taxRate: 18.0, // 18% GST (CGST 9% + SGST 9%)
  lateFeePerHour: 250.0,
  lateFeePerDay: 1500.0,
  defaultDeposit: 3000.0,
  gstin: '07AAAAA1234A1Z5',
  rentalPolicy: 'Renters must hold an original valid Indian Driving Licence (LMV/MCWG) or International Driving Permit (IDP) and be at least 21 years of age. Aadhaar Card / Passport verification via DigiLocker is mandatory before vehicle handover.',
  cancellationPolicy: '100% full refund for cancellations made up to 24 hours prior to scheduled trip start. Cancellations within 24 hours are subject to a nominal 1-day rental cancellation charge.',
  termsAndConditions: 'All vehicles are equipped with active FASTag electronic toll tags. FASTag toll charges will be deducted from the security deposit upon return. Speed governors are calibrated to 80 km/h or 100 km/h in accordance with MoRTH regulations. Renters are 100% liable for traffic e-challans incurred during the rental tenure.'
};
