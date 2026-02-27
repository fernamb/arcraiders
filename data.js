const BENCHES = [
  {
    id: 'explosive',
    name: 'Explosive Station',
    levels: [
      { level: 1, items: [
        { name: 'Chemicals', qty: 50 },
        { name: 'ARC Alloy', qty: 6 },
      ]},
      { level: 2, items: [
        { name: 'Synthesized Fuel', qty: 3 },
        { name: 'Crude Explosives', qty: 5 },
        { name: 'Pop Trigger', qty: 5 },
      ]},
      { level: 3, items: [
        { name: 'Laboratory Reagents', qty: 3 },
        { name: 'Explosive Compound', qty: 5 },
        { name: 'Rocketeer Driver', qty: 3, inv: 2 },
      ]},
    ],
  },
  {
    id: 'gear',
    name: 'Gear Bench',
    levels: [
      { level: 1, items: [
        { name: 'Plastic Parts', qty: 25 },
        { name: 'Fabric', qty: 30 },
      ]},
      { level: 2, items: [
        { name: 'Power Cable', qty: 3, inv: 5 },
        { name: 'Electrical Components', qty: 5 },
        { name: 'Hornet Driver', qty: 5 },
      ]},
      { level: 3, items: [
        { name: 'Industrial Battery', qty: 3 },
        { name: 'Advanced Electrical Components', qty: 5, inv: 5 },
        { name: 'Bastion Cell', qty: 6, inv: 11 },
      ]},
    ],
  },
  {
    id: 'gunsmith',
    name: 'Gunsmith',
    levels: [
      { level: 1, items: [
        { name: 'Metal Parts', qty: 20 },
        { name: 'Rubber Parts', qty: 30 },
      ]},
      { level: 2, items: [
        { name: 'Rusted Tools', qty: 3, inv: 6 },
        { name: 'Mechanical Components', qty: 5 },
        { name: 'Wasp Driver', qty: 8 },
      ]},
      { level: 3, items: [
        { name: 'Rusted Gear', qty: 3, inv: 3 },
        { name: 'Advanced Mechanical Components', qty: 5 },
        { name: 'Sentinel Firing Core', qty: 4 },
      ]},
    ],
  },
  {
    id: 'medical',
    name: 'Medical Lab',
    levels: [
      { level: 1, items: [
        { name: 'Fabric', qty: 50 },
        { name: 'ARC Alloy', qty: 6 },
      ]},
      { level: 2, items: [
        { name: 'Cracked Bioscanner', qty: 2 },
        { name: 'Durable Cloth', qty: 5, inv: 10 },
        { name: 'Tick Pod', qty: 8 },
      ]},
      { level: 3, items: [
        { name: 'Rusted Shut Medical Kit', qty: 3, inv: 3 },
        { name: 'Antiseptic', qty: 8, inv: 5 },
        { name: 'Surveyor Vault', qty: 5, inv: 3 },
      ]},
    ],
  },
  {
    id: 'refiner',
    name: 'Refiner',
    levels: [
      { level: 1, items: [
        { name: 'Metal Parts', qty: 60 },
        { name: 'ARC Powercell', qty: 5 },
      ]},
      { level: 2, items: [
        { name: 'Toaster', qty: 3, inv: 6 },
        { name: 'ARC Motion Core', qty: 5, inv: 10 },
        { name: 'Fireball Burner', qty: 8 },
      ]},
      { level: 3, items: [
        { name: 'Motor', qty: 3 },
        { name: 'ARC Circuitry', qty: 10, inv: 20 },
        { name: 'Bombardier Cell', qty: 6 },
      ]},
    ],
  },
  {
    id: 'utility',
    name: 'Utility Station',
    levels: [
      { level: 1, items: [
        { name: 'Plastic Parts', qty: 50 },
        { name: 'ARC Alloy', qty: 6 },
      ]},
      { level: 2, items: [
        { name: 'Damaged Heat Sink', qty: 2, inv: 3 },
        { name: 'Electrical Components', qty: 5 },
        { name: 'Snitch Scanner', qty: 6 },
      ]},
      { level: 3, items: [
        { name: 'Fried Motherboard', qty: 3, inv: 4 },
        { name: 'Advanced Electrical Components', qty: 5 },
        { name: 'Leaper Pulse Unit', qty: 4, inv: 5 },
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
