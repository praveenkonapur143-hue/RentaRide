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
  initialSettings,
  DemoUser,
  DemoVehicle,
  DemoCustomer,
  DemoBooking,
  DemoPayment,
  DemoInvoice,
  DemoInspection,
  DemoDamageReport,
  DemoMaintenance,
  DemoBusinessSettings
} from './demo-data';

// Persistent in-memory data store with fallback for immediate execution
class InMemoryStore {
  private users: DemoUser[] = [...initialUsers];
  private vehicles: DemoVehicle[] = [...initialVehicles];
  private customers: DemoCustomer[] = [...initialCustomers];
  private bookings: DemoBooking[] = [...initialBookings];
  private inspections: DemoInspection[] = [...initialInspections];
  private damageReports: DemoDamageReport[] = [...initialDamageReports];
  private payments: DemoPayment[] = [...initialPayments];
  private invoices: DemoInvoice[] = [...initialInvoices];
  private maintenance: DemoMaintenance[] = [...initialMaintenance];
  private settings: DemoBusinessSettings = { ...initialSettings };
  private auditLogs: any[] = [];
  private notifications: any[] = [
    {
      id: 'notif-1',
      title: 'Booking Overdue',
      message: 'Booking RR-BK-2025-005 for vehicle Toyota Fortuner Legender is overdue by 1 day.',
      type: 'ALERT',
      isRead: false,
      link: '/dashboard/bookings/bk-05',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      title: 'Scheduled Maintenance',
      message: 'Maruti Swift ZXi+ (DL 01 AB 4321) periodic service is completed.',
      type: 'INFO',
      isRead: false,
      link: '/dashboard/maintenance',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-3',
      title: 'Pollution Certificate Expiring',
      message: 'Mahindra Thar 4x4 (GA 03 AB 9999) PUC certificate expires on 2026-10-15.',
      type: 'WARNING',
      isRead: false,
      link: '/dashboard/vehicles/veh-03',
      createdAt: new Date().toISOString(),
    }
  ];

  // Users
  getUsers() { return this.users; }
  getUserById(id: string) { return this.users.find(u => u.id === id); }
  getUserByEmail(email: string) { return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  createUser(user: Omit<DemoUser, 'id' | 'createdAt'>) {
    const newUser: DemoUser = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Vehicles
  getVehicles(filters?: { type?: string; status?: string; search?: string; includeArchived?: boolean }) {
    return this.vehicles.filter(v => {
      if (!filters?.includeArchived && v.isArchived) return false;
      if (filters?.type && filters.type !== 'ALL' && v.type !== filters.type) return false;
      if (filters?.status && filters.status !== 'ALL' && v.status !== filters.status) return false;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesBrand = v.brand.toLowerCase().includes(query);
        const matchesModel = v.model.toLowerCase().includes(query);
        const matchesReg = v.registrationNumber.toLowerCase().includes(query);
        if (!matchesBrand && !matchesModel && !matchesReg) return false;
      }
      return true;
    });
  }

  getVehicleById(id: string) {
    return this.vehicles.find(v => v.id === id);
  }

  createVehicle(data: Partial<DemoVehicle>) {
    const id = `veh-${Date.now()}`;
    const stateCodes = ['DL', 'KA', 'MH', 'HR', 'GA', 'TS'];
    const randomState = stateCodes[Math.floor(Math.random() * stateCodes.length)];
    const randomSeries = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const newVehicle: DemoVehicle = {
      id,
      registrationNumber: data.registrationNumber || `${randomState} 01 ${randomSeries} ${randomNum}`,
      type: data.type || 'CAR',
      brand: data.brand || 'Vehicle',
      model: data.model || 'Model',
      year: data.year || new Date().getFullYear(),
      fuelType: data.fuelType || 'PETROL',
      transmission: data.transmission || 'AUTOMATIC',
      seatingCapacity: data.seatingCapacity || 5,
      dailyPrice: data.dailyPrice || 2200,
      hourlyRate: data.hourlyRate || Math.round((data.dailyPrice || 2200) / 24),
      securityDeposit: data.securityDeposit || 3000,
      odometerReading: data.odometerReading || 12000,
      status: data.status || 'AVAILABLE',
      rating: data.rating || 4.85,
      tripsCount: data.tripsCount || 10,
      fastagEnabled: data.fastagEnabled !== undefined ? data.fastagEnabled : true,
      insuranceExpiryDate: data.insuranceExpiryDate || '',
      registrationExpiryDate: data.registrationExpiryDate || '',
      pollutionExpiryDate: data.pollutionExpiryDate || '',
      images: data.images?.length ? data.images : [
        { id: `img-${Date.now()}`, url: '/images/cars/swift.jpg', caption: 'Front', isPrimary: true }
      ],
      documents: data.documents || [],
      notes: data.notes || '',
      isArchived: false,
      createdAt: new Date().toISOString()
    };
    this.vehicles.unshift(newVehicle);
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<DemoVehicle>) {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;
    this.vehicles[index] = { ...this.vehicles[index], ...updates };
    return this.vehicles[index];
  }

  archiveVehicle(id: string) {
    return this.updateVehicle(id, { isArchived: true, status: 'ARCHIVED' });
  }

  // Customers
  getCustomers(filters?: { search?: string; status?: string; includeArchived?: boolean }) {
    return this.customers.filter(c => {
      if (!filters?.includeArchived && c.isArchived) return false;
      if (filters?.status && filters.status !== 'ALL' && c.status !== filters.status) return false;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesName = c.fullName.toLowerCase().includes(query);
        const matchesEmail = c.email.toLowerCase().includes(query);
        const matchesPhone = c.phone.toLowerCase().includes(query);
        const matchesDL = c.drivingLicenceNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesDL) return false;
      }
      return true;
    });
  }

  getCustomerById(id: string) {
    return this.customers.find(c => c.id === id);
  }

  createCustomer(data: Partial<DemoCustomer>) {
    const id = `cust-${Date.now()}`;
    const stateCodes = ['KA', 'DL', 'MH', 'TS', 'HR'];
    const randomState = stateCodes[Math.floor(Math.random() * stateCodes.length)];
    const randomDL = `${randomState}-0${Math.floor(1 + Math.random() * 9)}2024${Math.floor(100000 + Math.random() * 900000)}`;

    const newCustomer: DemoCustomer = {
      id,
      fullName: data.fullName || 'Customer',
      email: data.email || `customer${Date.now()}@example.in`,
      phone: data.phone || `+91 ${Math.floor(98000 + Math.random() * 19999)} ${Math.floor(10000 + Math.random() * 89999)}`,
      address: data.address || 'Bengaluru, Karnataka',
      dob: data.dob || '1995-01-01',
      drivingLicenceNumber: data.drivingLicenceNumber || randomDL,
      licenceExpiryDate: data.licenceExpiryDate || '2040-01-01',
      governmentIdNumber: data.governmentIdNumber || `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      idDocumentUrl: data.idDocumentUrl,
      licenceDocumentUrl: data.licenceDocumentUrl,
      status: data.status || 'ACTIVE',
      notes: data.notes || '',
      isArchived: false,
      createdAt: new Date().toISOString()
    };
    this.customers.unshift(newCustomer);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<DemoCustomer>) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.customers[index] = { ...this.customers[index], ...updates };
    return this.customers[index];
  }

  // Bookings
  getBookings(filters?: { status?: string; vehicleId?: string; customerId?: string; search?: string }) {
    return this.bookings.filter(b => {
      if (filters?.status && filters.status !== 'ALL' && b.status !== filters.status) return false;
      if (filters?.vehicleId && b.vehicleId !== filters.vehicleId) return false;
      if (filters?.customerId && b.customerId !== filters.customerId) return false;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesNumber = b.bookingNumber.toLowerCase().includes(query);
        const customer = this.getCustomerById(b.customerId);
        const matchesCustomer = customer?.fullName.toLowerCase().includes(query);
        if (!matchesNumber && !matchesCustomer) return false;
      }
      return true;
    });
  }

  getBookingById(id: string) {
    return this.bookings.find(b => b.id === id);
  }

  /**
   * Double-booking prevention algorithm:
   * Checks whether the vehicle already has an overlapping CONFIRMED or ACTIVE_RENTAL booking.
   */
  checkVehicleAvailability(vehicleId: string, pickupDateStr: string, returnDateStr: string, excludeBookingId?: string): { available: boolean; conflict?: DemoBooking } {
    const reqPickup = new Date(pickupDateStr).getTime();
    const reqReturn = new Date(returnDateStr).getTime();

    const conflicts = this.bookings.filter(b => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.vehicleId !== vehicleId) return false;
      // Only active or confirmed bookings block availability
      if (b.status !== 'CONFIRMED' && b.status !== 'ACTIVE_RENTAL') return false;

      const bookedPickup = new Date(b.pickupDate).getTime();
      const bookedReturn = new Date(b.returnDate).getTime();

      // Overlap condition: reqPickup < bookedReturn && reqReturn > bookedPickup
      return (reqPickup < bookedReturn && reqReturn > bookedPickup);
    });

    if (conflicts.length > 0) {
      return { available: false, conflict: conflicts[0] };
    }
    return { available: true };
  }

  createBooking(data: Partial<DemoBooking>) {
    const id = `bk-${Date.now()}`;
    const bookingNumber = `RR-BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const initialAdvance = data.advancePayment || 0;

    const newBooking: DemoBooking = {
      id,
      bookingNumber,
      customerId: data.customerId!,
      vehicleId: data.vehicleId!,
      pickupLocation: data.pickupLocation || 'Bengaluru - Kempegowda Airport (BLR) T1',
      dropoffLocation: data.dropoffLocation || data.pickupLocation || 'Bengaluru - Kempegowda Airport (BLR) T1',
      pickupDate: data.pickupDate!,
      returnDate: data.returnDate!,
      dailyRate: data.dailyRate || 2200,
      days: data.days || 1,
      securityDeposit: data.securityDeposit || 3000,
      discount: data.discount || 0,
      taxRate: data.taxRate || 18,
      taxAmount: data.taxAmount || 0,
      totalAmount: data.totalAmount || 0,
      advancePayment: 0,
      balanceAmount: data.totalAmount || 0,
      kmPackage: data.kmPackage || 'standard',
      protectionPlan: data.protectionPlan || 'standard',
      deliveryMode: data.deliveryMode || 'HUB_PICKUP',
      deliveryFee: data.deliveryFee || 0,
      status: data.status || 'CONFIRMED',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    this.bookings.unshift(newBooking);

    // If advance payment made, record payment which correctly sets advancePayment and balanceAmount
    if (initialAdvance > 0) {
      this.createPayment({
        bookingId: newBooking.id,
        customerId: newBooking.customerId,
        amount: initialAdvance,
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        notes: 'Advance payment received via UPI'
      });
    }

    // Auto-create Invoice
    const invoiceId = `inv-${Date.now()}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const subtotal = newBooking.dailyRate * newBooking.days;
    const inv: DemoInvoice = {
      id: invoiceId,
      invoiceNumber,
      bookingId: newBooking.id,
      customerId: newBooking.customerId,
      issueDate: new Date().toISOString(),
      dueDate: newBooking.pickupDate,
      subtotal,
      taxAmount: newBooking.taxAmount,
      discountAmount: newBooking.discount,
      lateFees: 0,
      damageFees: 0,
      totalAmount: newBooking.totalAmount,
      paidAmount: newBooking.advancePayment,
      balanceDue: newBooking.balanceAmount,
      status: newBooking.balanceAmount <= 0 ? 'PAID' : (newBooking.advancePayment > 0 ? 'PARTIAL' : 'PENDING'),
      notes: 'Generated upon booking confirmation',
      createdAt: new Date().toISOString()
    };
    this.invoices.unshift(inv);

    // Update vehicle status
    if (newBooking.status === 'CONFIRMED') {
      this.updateVehicle(newBooking.vehicleId, { status: 'BOOKED' });
    } else if (newBooking.status === 'ACTIVE_RENTAL') {
      this.updateVehicle(newBooking.vehicleId, { status: 'RENTED' });
    }

    return newBooking;
  }

  updateBooking(id: string, updates: Partial<DemoBooking>) {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.bookings[index] = { ...this.bookings[index], ...updates };
    return this.bookings[index];
  }

  // Inspections
  getInspections(filters?: { bookingId?: string; vehicleId?: string }) {
    return this.inspections.filter(i => {
      if (filters?.bookingId && i.bookingId !== filters.bookingId) return false;
      if (filters?.vehicleId && i.vehicleId !== filters.vehicleId) return false;
      return true;
    });
  }

  createInspection(data: Partial<DemoInspection>) {
    const id = `insp-${Date.now()}`;
    const newInspection: DemoInspection = {
      id,
      bookingId: data.bookingId!,
      vehicleId: data.vehicleId!,
      type: data.type || 'CHECK_OUT',
      odometerReading: data.odometerReading || 0,
      fuelLevel: data.fuelLevel || '100%',
      exteriorCondition: data.exteriorCondition || 'GOOD',
      interiorCondition: data.interiorCondition || 'CLEAN',
      tyresCondition: data.tyresCondition || 'GOOD',
      lightsCondition: data.lightsCondition || 'FUNCTIONAL',
      mirrorsCondition: data.mirrorsCondition || 'INTACT',
      existingDamage: data.existingDamage || '',
      newDamage: data.newDamage || '',
      customerSignature: data.customerSignature || '',
      staffName: data.staffName || 'Staff Member',
      inspectionDate: new Date().toISOString(),
      notes: data.notes || '',
      photos: data.photos || [],
      createdAt: new Date().toISOString()
    };
    this.inspections.unshift(newInspection);
    return newInspection;
  }

  // Damage Reports
  getDamageReports(filters?: { bookingId?: string; vehicleId?: string; customerId?: string }) {
    return this.damageReports.filter(d => {
      if (filters?.bookingId && d.bookingId !== filters.bookingId) return false;
      if (filters?.vehicleId && d.vehicleId !== filters.vehicleId) return false;
      if (filters?.customerId && d.customerId !== filters.customerId) return false;
      return true;
    });
  }

  createDamageReport(data: Partial<DemoDamageReport>) {
    const id = `dmg-${Date.now()}`;
    const reportNumber = `DMG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newDamage: DemoDamageReport = {
      id,
      reportNumber,
      bookingId: data.bookingId!,
      vehicleId: data.vehicleId!,
      customerId: data.customerId!,
      damageType: data.damageType || 'SCRATCH',
      description: data.description || 'Reported damage',
      severity: data.severity || 'MINOR',
      estimatedCost: data.estimatedCost || 0,
      finalCharge: data.finalCharge || 0,
      repairStatus: data.repairStatus || 'PENDING',
      responsibility: data.responsibility || 'CUSTOMER',
      beforePhotos: data.beforePhotos || [],
      afterPhotos: data.afterPhotos || [],
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };
    this.damageReports.unshift(newDamage);

    // If final charge, adjust invoice damage fees
    if (newDamage.finalCharge > 0) {
      const inv = this.invoices.find(i => i.bookingId === newDamage.bookingId);
      if (inv) {
        inv.damageFees += newDamage.finalCharge;
        inv.totalAmount += newDamage.finalCharge;
        inv.balanceDue += newDamage.finalCharge;
        inv.status = inv.balanceDue > 0 ? 'PARTIAL' : 'PAID';
      }
    }
    return newDamage;
  }

  // Payments
  getPayments(filters?: { bookingId?: string; customerId?: string }) {
    return this.payments.filter(p => {
      if (filters?.bookingId && p.bookingId !== filters.bookingId) return false;
      if (filters?.customerId && p.customerId !== filters.customerId) return false;
      return true;
    });
  }

  createPayment(data: Partial<DemoPayment>) {
    const id = `pay-${Date.now()}`;
    const paymentNumber = `PAY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newPayment: DemoPayment = {
      id,
      paymentNumber,
      bookingId: data.bookingId!,
      customerId: data.customerId!,
      amount: data.amount || 0,
      paymentMethod: data.paymentMethod || 'CARD',
      paymentStatus: data.paymentStatus || 'PAID',
      transactionReference: data.transactionReference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: data.notes || '',
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    this.payments.unshift(newPayment);

    // Update corresponding booking & invoice balance
    const booking = this.bookings.find(b => b.id === newPayment.bookingId);
    if (booking) {
      booking.advancePayment += newPayment.amount;
      booking.balanceAmount = Math.max(0, booking.totalAmount - booking.advancePayment);
    }
    const inv = this.invoices.find(i => i.bookingId === newPayment.bookingId);
    if (inv) {
      inv.paidAmount += newPayment.amount;
      inv.balanceDue = Math.max(0, inv.totalAmount - inv.paidAmount);
      inv.status = inv.balanceDue <= 0 ? 'PAID' : (inv.paidAmount > 0 ? 'PARTIAL' : 'PENDING');
    }

    return newPayment;
  }

  // Invoices
  getInvoices(filters?: { customerId?: string; bookingId?: string }) {
    return this.invoices.filter(i => {
      if (filters?.customerId && i.customerId !== filters.customerId) return false;
      if (filters?.bookingId && i.bookingId !== filters.bookingId) return false;
      return true;
    });
  }

  getInvoiceById(id: string) {
    return this.invoices.find(i => i.id === id);
  }

  getInvoiceByBookingId(bookingId: string) {
    return this.invoices.find(i => i.bookingId === bookingId);
  }

  // Maintenance
  getMaintenance(filters?: { vehicleId?: string; status?: string }) {
    return this.maintenance.filter(m => {
      if (filters?.vehicleId && m.vehicleId !== filters.vehicleId) return false;
      if (filters?.status && m.status !== filters.status) return false;
      return true;
    });
  }

  createMaintenance(data: Partial<DemoMaintenance>) {
    const id = `maint-${Date.now()}`;
    const newMaint: DemoMaintenance = {
      id,
      vehicleId: data.vehicleId!,
      maintenanceType: data.maintenanceType || 'ROUTINE_SERVICE',
      serviceDate: data.serviceDate || new Date().toISOString(),
      nextServiceDate: data.nextServiceDate || '',
      cost: data.cost || 0,
      odometerReading: data.odometerReading || 0,
      serviceProvider: data.serviceProvider || 'Bay Area Fleet Care',
      description: data.description || 'Maintenance service',
      invoiceUrl: data.invoiceUrl,
      status: data.status || 'COMPLETED',
      createdAt: new Date().toISOString()
    };
    this.maintenance.unshift(newMaint);

    // If status is in progress, mark vehicle as under maintenance
    if (newMaint.status === 'IN_PROGRESS') {
      this.updateVehicle(newMaint.vehicleId, { status: 'UNDER_MAINTENANCE' });
    } else if (newMaint.status === 'COMPLETED') {
      const v = this.getVehicleById(newMaint.vehicleId);
      if (v && v.status === 'UNDER_MAINTENANCE') {
        this.updateVehicle(newMaint.vehicleId, { status: 'AVAILABLE' });
      }
    }

    return newMaint;
  }

  // Settings
  getSettings() {
    return this.settings;
  }

  updateSettings(updates: Partial<DemoBusinessSettings>) {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  // Notifications
  getNotifications() {
    return this.notifications;
  }

  markNotificationAsRead(id: string) {
    const n = this.notifications.find(item => item.id === id);
    if (n) n.isRead = true;
    return n;
  }

  // Audit Logs
  createAuditLog(action: string, entityType: string, entityId: string, details?: any, userId?: string) {
    const log = {
      id: `audit-${Date.now()}`,
      action,
      entityType,
      entityId,
      details: details ? JSON.stringify(details) : null,
      userId,
      createdAt: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    return log;
  }

  getAuditLogs() {
    return this.auditLogs;
  }
}

// Global singleton instance
const globalForDataStore = globalThis as unknown as { rentarideStore: InMemoryStore };
export const dataStore = globalForDataStore.rentarideStore || new InMemoryStore();
if (process.env.NODE_ENV !== 'production') {
  globalForDataStore.rentarideStore = dataStore;
}
