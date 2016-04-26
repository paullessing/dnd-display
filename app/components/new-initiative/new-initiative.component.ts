import {Component, Output, EventEmitter} from "angular2/core";
import {InitiativeOrder, InitiativeEntry} from "../../entities/initiative";

@Component({
  selector: 'new-initiative',
  templateUrl: 'app/components/new-initiative/new-initiative.component.html'
})
export class NewInitiativeComponent {
  @Output()
  public created: EventEmitter<InitiativeOrder> = new EventEmitter();

  public initiative: InitiativeOrder;
  public newPlayer: InitiativeEntry;

  private maxId: number;

  constructor() {
    this.resetInitiativeData();
  }

  public addPlayer() {
    if (!this.newPlayer.name ||
      !this.newPlayer.isNpc && !this.newPlayer.ac ||
      typeof this.newPlayer.initiative !== 'number') {
      return;
    }


    this.initiative.players.push(this.newPlayer);
    if (this.initiative.currentId < 0) {
      this.initiative.currentId = this.newPlayer.id;
    }
    this.resetPlayer();
  }

  public submitInitiative() {
    this.created.emit(this.initiative);
    this.resetInitiativeData();
  }

  private resetInitiativeData() {
    this.initiative = {
      isRunning: false,
      showAll: false,
      currentId: -1,
      players: []
    };
    this.maxId = 0;
    this.resetPlayer();
  }

  private resetPlayer() {
    this.newPlayer = {
      id: ++this.maxId,
      name: null,
      isNpc: false,
      initiative: null,
      ac: null,
      canModifyAc: false,
      isActive: true
    }
  }
}
