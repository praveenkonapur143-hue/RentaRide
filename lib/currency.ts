/**
 * Indian Rupee (INR) currency and localization utilities
 * Formats numbers into the Indian Numbering System (e.g. ₹1,800, ₹25,000, ₹1,20,000)
 */

export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatINRWithDecimals(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export interface KmPackage {
  id: 'standard' | 'traveler' | 'unlimited';
  name: string;
  kmsPerDay: number; // 0 means unlimited
  extraKmRate: number; // in INR
  pricePerDayAddon: number; // in INR
  badge: string;
  description: string;
}

export const KM_PACKAGES: KmPackage[] = [
  {
    id: 'standard',
    name: 'Commute (120 km/day)',
    kmsPerDay: 120,
    extraKmRate: 9,
    pricePerDayAddon: 0,
    badge: 'Most Popular',
    description: 'Ideal for city drives and short local commutes. Extra kms at ₹9/km.',
  },
  {
    id: 'traveler',
    name: 'Traveler (300 km/day)',
    kmsPerDay: 300,
    extraKmRate: 8,
    pricePerDayAddon: 450,
    badge: 'Weekend Choice',
    description: 'Perfect for weekend trips & nearby hill station getaways. Extra kms at ₹8/km.',
  },
  {
    id: 'unlimited',
    name: 'Unlimited Kilometres',
    kmsPerDay: 0,
    extraKmRate: 0,
    pricePerDayAddon: 850,
    badge: 'Zero KM Limits',
    description: 'Drive as much as you want without any kilometre tracking or extra charges.',
  },
];

export interface ProtectionPlan {
  id: 'standard' | 'peace_of_mind';
  name: string;
  pricePerDay: number; // in INR
  damageLiabilityCap: number; // in INR
  description: string;
  badge: string;
}

export const PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'standard',
    name: 'Standard Protection',
    pricePerDay: 0,
    damageLiabilityCap: 5000,
    description: 'Maximum financial liability capped at ₹5,000 for accidental damage.',
    badge: 'Included',
  },
  {
    id: 'peace_of_mind',
    name: 'Peace of Mind Cover (RentaRide Shield)',
    pricePerDay: 299,
    damageLiabilityCap: 0,
    description: 'Zero damage liability for all accidental exterior and mechanical repairs.',
    badge: '100% Worry-Free',
  },
];

export const POPULAR_INDIAN_HUBS = [
  { city: 'Bengaluru', hubs: ['Kempegowda Airport (BLR) T1/T2', 'Indiranagar Metro Hub', 'Koramangala 4th Block', 'Whitefield ITPL'] },
  { city: 'Delhi NCR', hubs: ['IGI Airport T3 Terminal', 'CyberHub Gurugram', 'Connaught Place Outer Circle', 'Noida Sector 18'] },
  { city: 'Mumbai', hubs: ['CSMI Airport T2 Hub', 'Bandra Kurla Complex (BKC)', 'Andheri East Metro', 'Vashi Navi Mumbai'] },
  { city: 'Goa', hubs: ['Mopa International Airport (GOX)', 'Dabolim Airport (GOI)', 'Panaji Central Hub', 'Baga Calangute Link Road'] },
  { city: 'Hyderabad', hubs: ['Rajiv Gandhi Int. Airport (RGIA)', 'Hitec City Cyber Towers', 'Gachibowli Financial District', 'Banjara Hills'] },
  { city: 'Pune', hubs: ['Pune International Airport', 'Viman Nagar Hub', 'Hinjewadi Phase 1 IT Park', 'Koregaon Park'] },
  { city: 'Jaipur', hubs: ['Jaipur Int. Airport Sanganer', 'MI Road Central', 'Vaishali Nagar Hub'] },
  { city: 'Kochi', hubs: ['Cochin International Airport (COK)', 'Kadavanthra Central', 'Edappally Metro'] },
];
