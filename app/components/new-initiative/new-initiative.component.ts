import {Component, Output, EventEmitter} from "angular2/core";
import {InitiativeOrder, InitiativeEntry} from "../../entities/initiative";
import {NewPlayerComponent} from "../new-player/new-player.component";

@Component({
  selector: 'new-initiative',
  templateUrl: 'app/components/new-initiative/new-initiative.component.html',
  styles: [`
.currentTable {
  margin-bottom: 1em;
  min-width: 400px;
  border: 1px solid #666;
}
.currentTable__placeholder {
  color: #333;
  font-style: italic;
}
.currentTable td,
.currentTable th {
  padding: 4px 8px;
}
.currentTable th {
  font-weight: 400;
  text-align: left;
}
.currentTable thead {
  border-bottom: 1px solid #666;
}
.action {
  font-size: 0.8em;
  font-weight: normal;
  margin-right: 1em;
  color: #363636;
}
`],
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

  public moveUp(index: number) {
    if (index <= 0 || index >= this.initiative.players.length) {
      return;
    }
    this.swap(index, index - 1);
    this.initiative.currentId = this.initiative.players[0].id;
  }

  public moveDown(index: number) {
    if (index < 0 || index >= this.initiative.players.length - 1) {
      return;
    }
    this.swap(index, index + 1);
    this.initiative.currentId = this.initiative.players[0].id;
  }

  public remove(index: number) {
    if (index < 0 || index > this.initiative.players.length - 1) {
      return;
    }
    this.initiative.players.splice(index, 1);
    if (this.initiative.players.length) {
      this.initiative.currentId = this.initiative.players[0].id;
    } else {
      this.initiative.currentId = -1;
    }
  }

  private swap(index1, index2) {
    let temp = this.initiative.players[index1];
    this.initiative.players[index1] = this.initiative.players[index2];
    this.initiative.players[index2] = temp;
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
    if (!this.initiative.players.length) {
      return;
    }
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
