import {Component, Output, EventEmitter} from "angular2/core";
import {InitiativeOrder, InitiativeEntry} from "../../entities/initiative";
import {NewPlayerComponent} from "../new-player/new-player.component";

@Component({
  selector: 'new-initiative',
  templateUrl: 'app/components/new-initiative/new-initiative.component.html',
  directives: [NewPlayerComponent]
})
export class NewInitiativeComponent {
  @Output()
  public created: EventEmitter<InitiativeOrder> = new EventEmitter();

  public initiative: InitiativeOrder;

  private maxId: number;

  constructor() {
    this.resetInitiativeData();
  }

  public addPlayer(player: InitiativeEntry) {
    let newPlayer = Object.assign({}, player);
    newPlayer.id = ++this.maxId;
    this.initiative.players.push(newPlayer);
    if (this.initiative.currentId < 0) {
      this.initiative.currentId = newPlayer.id;
    }
  }

  public submitInitiative() {
    this.created.emit(this.initiative);
    this.resetInitiativeData();
  }

  private resetInitiativeData() {
    this.initiative = {
      roundNumber: 1,
      isRunning: false,
      showAll: false,
      currentId: -1,
      players: []
    };
    this.maxId = 0;
  }
}
