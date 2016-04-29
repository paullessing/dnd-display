export interface InitiativeOrder {
  id?: number;
  roundNumber: number;
  isRunning: boolean;
  showAll: boolean;
  currentId: number;
  startTime: string;
  players: InitiativeEntry[];
}

export interface InitiativeEntry {
  id?: number;
  name: string;
  initiative: number;
  isNpc: boolean;
  isActive: boolean;
  ac?: number;
  canModifyAc: boolean;
}
