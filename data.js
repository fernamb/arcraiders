const BENCHES = [
  {
    id: 'explosive',
    name: 'Explosive Station',
    levels: [
      { level: 1, items: [
        { name: 'Chemicals', qty: 50, inv: 100 },
        { name: 'ARC Alloy', qty: 6, inv: 12 },
      ]},
      { level: 2, items: [
        { name: 'Synthesized Fuel', qty: 3, inv: 6 },
        { name: 'Crude Explosives', qty: 5, inv: 10 },
        { name: 'Pop Trigger', qty: 5, inv: 6 },
      ]},
      { level: 3, items: [
        { name: 'Laboratory Reagents', qty: 3, inv: 2 },
        { name: 'Explosive Compound', qty: 5, inv: 10 },
        { name: 'Rocketeer Driver', qty: 3, inv: 7 },
      ]},
    ],
  },
  {
    id: 'gear',
    name: 'Gear Bench',
    levels: [
      { level: 1, items: [
        { name: 'Plastic Parts', qty: 25, inv: 50 },
        { name: 'Fabric', qty: 30, inv: 60 },
      ]},
      { level: 2, items: [
        { name: 'Power Cable', qty: 3, inv: 6 },
        { name: 'Electrical Components', qty: 5, inv: 10 },
        { name: 'Hornet Driver', qty: 5, inv: 10 },
      ]},
      { level: 3, items: [
        { name: 'Industrial Battery', qty: 3, inv: 1 },
        { name: 'Advanced Electrical Components', qty: 5, inv: 10 },
        { name: 'Bastion Cell', qty: 6, inv: 12 },
      ]},
    ],
  },
  {
    id: 'gunsmith',
    name: 'Gunsmith',
    levels: [
      { level: 1, items: [
        { name: 'Metal Parts', qty: 20, inv: 40 },
        { name: 'Rubber Parts', qty: 30, inv: 60 },
      ]},
      { level: 2, items: [
        { name: 'Rusted Tools', qty: 3, inv: 6 },
        { name: 'Mechanical Components', qty: 5, inv: 10 },
        { name: 'Wasp Driver', qty: 8, inv: 18 },
      ]},
      { level: 3, items: [
        { name: 'Rusted Gear', qty: 3, inv: 5 },
        { name: 'Advanced Mechanical Components', qty: 5, inv: 10 },
        { name: 'Sentinel Firing Core', qty: 4 },
      ]},
    ],
  },
  {
    id: 'medical',
    name: 'Medical Lab',
    levels: [
      { level: 1, items: [
        { name: 'Fabric', qty: 50, inv: 100 },
        { name: 'ARC Alloy', qty: 6, inv: 12 },
      ]},
      { level: 2, items: [
        { name: 'Cracked Bioscanner', qty: 2, inv: 1 },
        { name: 'Durable Cloth', qty: 5, inv: 10 },
        { name: 'Tick Pod', qty: 8, inv: 3 },
      ]},
      { level: 3, items: [
        { name: 'Rusted Shut Medical Kit', qty: 3, inv: 3 },
        { name: 'Antiseptic', qty: 8, inv: 17 },
        { name: 'Surveyor Vault', qty: 5, inv: 10 },
      ]},
    ],
  },
  {
    id: 'refiner',
    name: 'Refiner',
    levels: [
      { level: 1, items: [
        { name: 'Metal Parts', qty: 60, inv: 120 },
        { name: 'ARC Powercell', qty: 5 },
      ]},
      { level: 2, items: [
        { name: 'Toaster', qty: 3, inv: 6 },
        { name: 'ARC Motion Core', qty: 5, inv: 10 },
        { name: 'Fireball Burner', qty: 8, inv: 5 },
      ]},
      { level: 3, items: [
        { name: 'Motor', qty: 3, inv: 1 },
        { name: 'ARC Circuitry', qty: 10, inv: 20 },
        { name: 'Bombardier Cell', qty: 6, inv: 12 },
      ]},
    ],
  },
  {
    id: 'utility',
    name: 'Utility Station',
    levels: [
      { level: 1, items: [
        { name: 'Plastic Parts', qty: 50, inv: 100 },
        { name: 'ARC Alloy', qty: 6, inv: 12 },
      ]},
      { level: 2, items: [
        { name: 'Damaged Heat Sink', qty: 2, inv: 3 },
        { name: 'Electrical Components', qty: 5, inv: 10 },
        { name: 'Snitch Scanner', qty: 6, inv: 11 },
      ]},
      { level: 3, items: [
        { name: 'Fried Motherboard', qty: 3, inv: 5 },
        { name: 'Advanced Electrical Components', qty: 5, inv: 6 },
        { name: 'Leaper Pulse Unit', qty: 4, inv: 7 },
      ]},
    ],
  },
];

const SCRAPPY = [
  {
    level: 1,
    name: 'Fledgling',
    items: [],
    note: 'No upgrade required – starting level.',
  },
  {
    level: 2,
    name: 'Forager',
    items: [
      { name: 'Dog Collar', qty: 1 },
    ],
  },
  {
    level: 3,
    name: 'Scavenger',
    items: [
      { name: 'Lemon', qty: 3 },
      { name: 'Apricot', qty: 3 },
    ],
  },
  {
    level: 4,
    name: 'Treasure Hunter',
    items: [
      { name: 'Prickly Pear', qty: 6 },
      { name: 'Olives', qty: 6 },
      { name: 'Cat Bed', qty: 1 },
    ],
  },
  {
    level: 5,
    name: 'Master Hoarder',
    items: [
      { name: 'Mushroom', qty: 12 },
      { name: 'Apricot', qty: 12 },
      { name: 'Very Comfortable Pillow', qty: 3 },
    ],
  },
];

const BLUEPRINTS = [
  {
    category: 'Weapons',
    items: [
      { name: 'Anvil' },
      { name: 'Aphelion' },
      { name: 'Bettina' },
      { name: 'Bobcat' },
      { name: 'Burletta' },
      { name: 'Deadline' },
      { name: 'Equalizer' },
      { name: 'Hullcracker' },
      { name: 'Il Toro' },
      { name: 'Jupiter' },
      { name: 'Osprey' },
      { name: 'Tempest' },
      { name: 'Torrente' },
      { name: 'Trailblazer' },
      { name: 'Venator' },
      { name: 'Vulcano' },
      { name: 'Wolfpack' },
    ],
  },
  {
    category: 'Gun Parts',
    items: [
      { name: 'Light Gun Parts' },
      { name: 'Medium Gun Parts' },
      { name: 'Heavy Gun Parts' },
      { name: 'Complex Gun Parts' },
    ],
  },
  {
    category: 'Attachments',
    items: [
      { name: 'Angled Grip II' },
      { name: 'Angled Grip III' },
      { name: 'Vertical Grip II' },
      { name: 'Vertical Grip III' },
      { name: 'Lightweight Stock' },
      { name: 'Padded Stock' },
      { name: 'Stable Stock II' },
      { name: 'Stable Stock III' },
      { name: 'Extended Light Magazine II' },
      { name: 'Extended Light Magazine III' },
      { name: 'Extended Medium Magazine II' },
      { name: 'Extended Medium Magazine III' },
      { name: 'Extended Shotgun Magazine II' },
      { name: 'Extended Shotgun Magazine III' },
      { name: 'Compensator II' },
      { name: 'Compensator III' },
      { name: 'Muzzle Brake II' },
      { name: 'Muzzle Brake III' },
      { name: 'Silencer I' },
      { name: 'Silencer II' },
      { name: 'Extended Barrel' },
      { name: 'Shotgun Choke II' },
      { name: 'Shotgun Choke III' },
      { name: 'Shotgun Silencer' },
    ],
  },
  {
    category: 'Grenades & Explosives',
    items: [
      { name: 'Blaze Grenade' },
      { name: 'Fireworks Box' },
      { name: 'Lure Grenade' },
      { name: 'Seeker Grenade' },
      { name: 'Smoke Grenade' },
      { name: 'Tagging Grenade' },
      { name: "Trigger 'Nade" },
    ],
  },
  {
    category: 'Mines',
    items: [
      { name: 'Explosive Mine' },
      { name: 'Gas Mine' },
      { name: 'Jolt Mine' },
      { name: 'Pulse Mine' },
    ],
  },
  {
    category: 'Medical',
    items: [
      { name: 'Defibrillator' },
      { name: 'Vita Shot' },
      { name: 'Vita Spray' },
    ],
  },
  {
    category: 'Utilities',
    items: [
      { name: 'Barricade Kit' },
      { name: 'Remote Raider Flare' },
    ],
  },
  {
    category: 'Augments',
    items: [
      { name: 'Combat Mk. 3 (Aggressive)' },
      { name: 'Combat Mk. 3 (Flanking)' },
      { name: 'Looting Mk. 3 (Safekeeper)' },
      { name: 'Looting Mk. 3 (Survivor)' },
      { name: 'Tactical Mk. 3 (Defensive)' },
      { name: 'Tactical Mk. 3 (Healing)' },
      { name: 'Tactical Mk. 3 (Revival)' },
    ],
  },
  {
    category: 'Light Sticks',
    items: [
      { name: 'Blue Light Stick' },
      { name: 'Green Light Stick' },
      { name: 'Red Light Stick' },
      { name: 'Yellow Light Stick' },
    ],
  },
];
