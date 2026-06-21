import type { FootprintData } from './FootprintContext';

export interface EmissionsResult {
  transport: number;
  diet: number;
  energy: number;
  total: number;
}

/**
 * Pure function to calculate annual CO2 emissions (kg) from footprint data.
 * Emission factors:
 *   Transport: Car=0.18, EV=0.05, Transit=0.04, Bike=0 kg CO2 per km
 *   Diet: HeavyMeat=2900, Balanced=1900, Vegetarian=1200, Vegan=700 kg CO2 per year
 *   Energy: 0.4 kg CO2/kWh (grid), 0.06 kg CO2/kWh (renewable)
 */
export function calculateEmissions(data: FootprintData): EmissionsResult {
  // Transport
  const transportFactors: Record<FootprintData['transport']['mode'], number> = {
    car: 0.18,
    ev: 0.05,
    transit: 0.04,
    bike: 0,
  };
  const transportEmissions = data.transport.distance * 52 * transportFactors[data.transport.mode];

  // Diet
  const dietFactors: Record<FootprintData['diet']['type'], number> = {
    'heavy-meat': 2900,
    balanced: 1900,
    vegetarian: 1200,
    vegan: 700,
  };
  const dietEmissions = dietFactors[data.diet.type];

  // Energy
  const energyFactor = data.energy.renewable ? 0.06 : 0.4;
  const energyEmissions = data.energy.electricity * 12 * energyFactor;

  const transport = Math.round(transportEmissions);
  const diet = Math.round(dietEmissions);
  const energy = Math.round(energyEmissions);

  return { transport, diet, energy, total: transport + diet + energy };
}
