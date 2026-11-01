export enum ClimateProfile {
  Temperate = 'temperate',
  Tropical = 'tropical',
  Cold = 'cold',
  Business = 'business',
}

export enum FilterStatus {
  All = 'all',
  Remaining = 'remaining',
  Packed = 'packed',
}

export type CategoryName =
  | 'Documents & Boarding'
  | 'Apparel & Footwear'
  | 'Toiletries & Wellness'
  | 'Cabin & Electronics'
  | 'Destination Gear'
  | 'Custom Essentials';

export interface TripDetails {
  destination: string;
  days: number;
  climate: ClimateProfile;
  departureDate?: string;
  createdAt: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: CategoryName;
  quantity: number;
  note?: string;
  packed: boolean;
  isCustom?: boolean;
}

export interface PersistedVoyageState {
  trip: TripDetails | null;
  items: PackingItem[];
}
