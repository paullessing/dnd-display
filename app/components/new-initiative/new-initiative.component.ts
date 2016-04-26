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
    this.initiative.players.push(this.newPlayer);
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
      currentIndex: 0,
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
