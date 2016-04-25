export interface InitiativeOrder {
  id: number;
  isRunning: boolean;
  showAll: boolean;
  currentIndex: number;
  players: InitiativeEntry[];
}

export interface InitiativeEntry {
  id: number;
  name: string;
  initiative: number;
  isActive: boolean;
  ac?: number;
  canModifyAc: boolean;
}
