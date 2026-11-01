import { CategoryName, ClimateProfile, PackingItem } from '../types';

export const ALL_CATEGORIES: CategoryName[] = [
  'Documents & Boarding',
  'Apparel & Footwear',
  'Toiletries & Wellness',
  'Cabin & Electronics',
  'Destination Gear',
  'Custom Essentials',
];

export const CLIMATE_OPTIONS: {
  value: ClimateProfile;
  label: string;
  description: string;
}[] = [
  {
    value: ClimateProfile.Temperate,
    label: 'Temperate',
    description: 'Layered everyday wear & light rain shell',
  },
  {
    value: ClimateProfile.Tropical,
    label: 'Warm & Coastal',
    description: 'Breathable linens, sun protection & swimwear',
  },
  {
    value: ClimateProfile.Cold,
    label: 'Cold & Alpine',
    description: 'Thermal base layers, insulated outerwear & gloves',
  },
  {
    value: ClimateProfile.Business,
    label: 'Urban & Business',
    description: 'Tailored attire, presentation tech & transit polish',
  },
];

export interface QuickPreset {
  destination: string;
  days: number;
  climate: ClimateProfile;
}

export const DESTINATION_PRESETS: QuickPreset[] = [
  { destination: 'Kyoto, Japan', days: 7, climate: ClimateProfile.Temperate },
  { destination: 'Amalfi Coast, Italy', days: 5, climate: ClimateProfile.Tropical },
  { destination: 'Reykjavík, Iceland', days: 6, climate: ClimateProfile.Cold },
  { destination: 'Zurich, Switzerland', days: 4, climate: ClimateProfile.Business },
];

function createId(prefix: string, index: number): string {
  return `${prefix}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Generates a smart, duration-scaled packing manifest tailored to the trip's
 * length in days and selected climate profile.
 */
export function generateStarterManifest(
  days: number,
  climate: ClimateProfile
): PackingItem[] {
  const safeDays = Math.max(1, Math.min(365, Math.round(days)));
  // Cap wearable laundry cycle around 10 days (assuming laundry on longer expeditions)
  const wearableCycle = Math.min(safeDays, 10);
  const topsCount = Math.max(2, wearableCycle);
  const bottomsCount = Math.max(1, Math.ceil(wearableCycle / 2));
  const underlayersCount = Math.min(safeDays + 1, 12);
  const sleepwearCount = Math.max(1, Math.ceil(wearableCycle / 4));

  const rawItems: Omit<PackingItem, 'id' | 'packed'>[] = [
    // Documents & Boarding
    {
      name: 'Passport or Government Photo ID',
      category: 'Documents & Boarding',
      quantity: 1,
      note: 'Verify 6+ months validity',
    },
    {
      name: 'Boarding Passes & Hotel Confirmations',
      category: 'Documents & Boarding',
      quantity: 1,
      note: 'Offline copy saved',
    },
    {
      name: 'Primary Travel Card & Local Currency',
      category: 'Documents & Boarding',
      quantity: 1,
      note: 'Zero foreign-fee card',
    },
    {
      name: 'Travel Insurance & Emergency Contacts',
      category: 'Documents & Boarding',
      quantity: 1,
    },

    // Apparel & Footwear
    {
      name: 'Everyday Tops & Breathable Shirts',
      category: 'Apparel & Footwear',
      quantity: topsCount,
      note: `Scaled for ${safeDays} ${safeDays === 1 ? 'day' : 'days'}`,
    },
    {
      name: 'Trousers, Jeans or Skirts',
      category: 'Apparel & Footwear',
      quantity: bottomsCount,
    },
    {
      name: 'Undergarments & Walking Socks',
      category: 'Apparel & Footwear',
      quantity: underlayersCount,
    },
    {
      name: 'Comfortable Walking Shoes',
      category: 'Apparel & Footwear',
      quantity: 1,
      note: 'Broken-in pair',
    },
    {
      name: 'Sleepwear & Loungewear Set',
      category: 'Apparel & Footwear',
      quantity: sleepwearCount,
    },

    // Toiletries & Wellness
    {
      name: 'Toothbrush, Travel Paste & Floss',
      category: 'Toiletries & Wellness',
      quantity: 1,
    },
    {
      name: 'TSA-Compliant Liquids Pouch',
      category: 'Toiletries & Wellness',
      quantity: 1,
      note: 'Containers under 100ml',
    },
    {
      name: 'Daily Skincare & Deodorant',
      category: 'Toiletries & Wellness',
      quantity: 1,
    },
    {
      name: 'Personal Medications & First-Aid Kit',
      category: 'Toiletries & Wellness',
      quantity: Math.max(1, Math.ceil(safeDays / 7)),
      note: `${safeDays + 2} days supply`,
    },

    // Cabin & Electronics
    {
      name: 'Smartphone & Braided Charging Cable',
      category: 'Cabin & Electronics',
      quantity: 1,
    },
    {
      name: 'Universal Travel Power Adapter',
      category: 'Cabin & Electronics',
      quantity: 1,
    },
    {
      name: 'Portable Power Bank (10,000mAh)',
      category: 'Cabin & Electronics',
      quantity: 1,
      note: 'Carry-on cabin only',
    },
    {
      name: 'Noise-Canceling Headphones',
      category: 'Cabin & Electronics',
      quantity: 1,
    },
    {
      name: 'Refillable Collapsible Water Bottle',
      category: 'Cabin & Electronics',
      quantity: 1,
      note: 'Empty before security',
    },
  ];

  // Append climate-specific Destination Gear
  if (climate === ClimateProfile.Temperate) {
    rawItems.push(
      {
        name: 'Packable Wind & Rain Shell',
        category: 'Destination Gear',
        quantity: 1,
      },
      {
        name: 'Midweight Knit Sweater or Cardigan',
        category: 'Destination Gear',
        quantity: Math.max(1, Math.min(3, Math.ceil(safeDays / 3))),
      },
      {
        name: 'Compact Folding Umbrella',
        category: 'Destination Gear',
        quantity: 1,
      },
      {
        name: 'Foldable Daypack or Tote Bag',
        category: 'Destination Gear',
        quantity: 1,
      }
    );
  } else if (climate === ClimateProfile.Tropical) {
    rawItems.push(
      {
        name: 'Broad-Spectrum Reef-Safe Sunscreen SPF 50',
        category: 'Destination Gear',
        quantity: Math.max(1, Math.ceil(safeDays / 6)),
      },
      {
        name: 'Polarized Sunglasses & Sun Hat',
        category: 'Destination Gear',
        quantity: 1,
      },
      {
        name: 'Swimwear & Quick-Dry Travel Towel',
        category: 'Destination Gear',
        quantity: Math.min(3, Math.max(1, Math.ceil(safeDays / 3))),
      },
      {
        name: 'Breathable Sandals or Resort Slip-Ons',
        category: 'Destination Gear',
        quantity: 1,
      }
    );
  } else if (climate === ClimateProfile.Cold) {
    rawItems.push(
      {
        name: 'Insulated Down Parka or Weatherproof Coat',
        category: 'Destination Gear',
        quantity: 1,
      },
      {
        name: 'Merino Wool Thermal Base Layers',
        category: 'Destination Gear',
        quantity: Math.min(4, Math.max(2, Math.ceil(safeDays / 2))),
      },
      {
        name: 'Insulated Beanie, Neck Gaiter & Gloves',
        category: 'Destination Gear',
        quantity: 1,
      },
      {
        name: 'Hydrating Lip Balm & Rich Barrier Cream',
        category: 'Destination Gear',
        quantity: 1,
      }
    );
  } else if (climate === ClimateProfile.Business) {
    rawItems.push(
      {
        name: 'Tailored Blazer or Structured Suit',
        category: 'Destination Gear',
        quantity: Math.min(3, Math.max(1, Math.ceil(safeDays / 3))),
        note: 'Pack in garment sleeve',
      },
      {
        name: 'Wrinkle-Resistant Dress Shirts / Blouses',
        category: 'Destination Gear',
        quantity: Math.min(6, Math.max(2, safeDays)),
      },
      {
        name: 'Laptop, Charger & Presentation Dongle',
        category: 'Destination Gear',
        quantity: 1,
      },
      {
        name: 'Dress Shoes & Portable Garment Steamer',
        category: 'Destination Gear',
        quantity: 1,
      }
    );
  }

  return rawItems.map((item, idx) => ({
    ...item,
    id: createId('item', idx),
    packed: false,
    isCustom: false,
  }));
}
