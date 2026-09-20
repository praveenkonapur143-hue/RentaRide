export interface ValidationResult<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export function validateVehicleInput(data: any): ValidationResult<any> {
  if (!data.brand || typeof data.brand !== 'string' || data.brand.trim() === '') {
    return { success: false, error: 'Brand is required' };
  }
  if (!data.model || typeof data.model !== 'string' || data.model.trim() === '') {
    return { success: false, error: 'Model is required' };
  }
  if (!data.registrationNumber || typeof data.registrationNumber !== 'string' || data.registrationNumber.trim() === '') {
    return { success: false, error: 'Registration number is required' };
  }
  const year = parseInt(data.year);
  if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 2) {
    return { success: false, error: 'A valid manufacturing year is required' };
  }
  const dailyPrice = parseFloat(data.dailyPrice);
  if (isNaN(dailyPrice) || dailyPrice <= 0) {
    return { success: false, error: 'Daily price must be a positive number' };
  }
  return {
    success: true,
    data: {
      ...data,
      brand: data.brand.trim(),
      model: data.model.trim(),
      registrationNumber: data.registrationNumber.trim().toUpperCase(),
      year,
      dailyPrice,
      securityDeposit: parseFloat(data.securityDeposit) || 200,
      odometerReading: parseInt(data.odometerReading) || 0,
      seatingCapacity: parseInt(data.seatingCapacity) || 5,
    }
  };
}

export function validateCustomerInput(data: any): ValidationResult<any> {
  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim() === '') {
    return { success: false, error: 'Full name is required' };
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    return { success: false, error: 'Valid email address is required' };
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 7) {
    return { success: false, error: 'Valid phone number is required' };
  }
  if (!data.drivingLicenceNumber || typeof data.drivingLicenceNumber !== 'string' || data.drivingLicenceNumber.trim() === '') {
    return { success: false, error: 'Driving licence number is required' };
  }
  return {
    success: true,
    data: {
      ...data,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      drivingLicenceNumber: data.drivingLicenceNumber.trim().toUpperCase(),
    }
  };
}

export function validateBookingInput(data: any): ValidationResult<any> {
  if (!data.customerId) {
    return { success: false, error: 'Customer is required' };
  }
  if (!data.vehicleId) {
    return { success: false, error: 'Vehicle is required' };
  }
  if (!data.pickupDate) {
    return { success: false, error: 'Pickup date is required' };
  }
  if (!data.returnDate) {
    return { success: false, error: 'Return date is required' };
  }
  const pickup = new Date(data.pickupDate);
  const dropoff = new Date(data.returnDate);
  if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
    return { success: false, error: 'Invalid pickup or return date' };
  }
  if (dropoff <= pickup) {
    return { success: false, error: 'Return date must be after pickup date' };
  }
  return {
    success: true,
    data: {
      ...data,
      pickupDate: pickup,
      returnDate: dropoff,
      discount: parseFloat(data.discount) || 0,
      advancePayment: parseFloat(data.advancePayment) || 0,
    }
  };
}

export function validateInspectionInput(data: any): ValidationResult<any> {
  if (!data.bookingId) {
    return { success: false, error: 'Booking ID is required' };
  }
  if (!data.type || !['CHECK_OUT', 'RETURN'].includes(data.type)) {
    return { success: false, error: 'Valid inspection type (CHECK_OUT or RETURN) is required' };
  }
  const odometer = parseInt(data.odometerReading);
  if (isNaN(odometer) || odometer < 0) {
    return { success: false, error: 'Valid odometer reading is required' };
  }
  if (!data.staffName || data.staffName.trim() === '') {
    return { success: false, error: 'Staff member name is required' };
  }
  return {
    success: true,
    data: {
      ...data,
      odometerReading: odometer,
      fuelLevel: data.fuelLevel || '100%',
      exteriorCondition: data.exteriorCondition || 'GOOD',
      interiorCondition: data.interiorCondition || 'CLEAN',
      tyresCondition: data.tyresCondition || 'GOOD',
      lightsCondition: data.lightsCondition || 'FUNCTIONAL',
      mirrorsCondition: data.mirrorsCondition || 'INTACT',
    }
  };
}

export function validatePaymentInput(data: any): ValidationResult<any> {
  if (!data.bookingId) {
    return { success: false, error: 'Booking ID is required' };
  }
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: 'Amount must be greater than zero' };
  }
  if (!data.paymentMethod) {
    return { success: false, error: 'Payment method is required' };
  }
  return {
    success: true,
    data: {
      ...data,
      amount,
      paymentMethod: data.paymentMethod,
    }
  };
}
