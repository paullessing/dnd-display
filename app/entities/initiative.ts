export interface InitiativeEntry {
  id: number;
  name: string;
  initiative: number;
  isAlive: boolean;
  ac?: number;
  canModifyAc: boolean;
}

export type InitiativeOrder = InitiativeEntry[];
