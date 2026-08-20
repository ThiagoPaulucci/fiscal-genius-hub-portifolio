// Simple fiscal rules database for initial lookups
export type Sector = "comercio" | "servicos" | "industria";

export interface OfficialRates {
  icms: number;
  pis?: number;
  cofins?: number;
}

export const FISCAL_RULES: Record<string, Record<Sector, OfficialRates>> = {
  SP: {
    comercio: { icms: 12, pis: 1.65, cofins: 7.6 },
    servicos: { icms: 0, pis: 0.65, cofins: 3 },
    industria: { icms: 18, pis: 1.65, cofins: 7.6 },
  },
  RJ: {
    comercio: { icms: 18, pis: 1.65, cofins: 7.6 },
    servicos: { icms: 0, pis: 0.65, cofins: 3 },
    industria: { icms: 19, pis: 1.65, cofins: 7.6 },
  },
};

export const defaultUF = "SP" as const;
export const defaultSector: Sector = "comercio";

export function getFallbackRates(): OfficialRates {
  return { icms: 12, pis: 1.65, cofins: 7.6 };
}
