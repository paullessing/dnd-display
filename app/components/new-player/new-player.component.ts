import {Component, Output, EventEmitter} from "angular2/core";
import {InitiativeOrder, InitiativeEntry} from "../../entities/initiative";

@Component({
  selector: 'new-player',
  templateUrl: 'app/components/new-player/new-player.component.html'
})
export class NewPlayerComponent {
  @Output()
  public created: EventEmitter<InitiativeEntry> = new EventEmitter();

  public newPlayer: InitiativeEntry;

  constructor() {
    this.resetPlayer();
  }

  public submit() {
    if (!this.newPlayer.name ||
      !this.newPlayer.isNpc && !this.newPlayer.ac ||
      typeof this.newPlayer.initiative !== 'number') {
      return;
    }
    this.created.emit(this.newPlayer);

    this.resetPlayer();
  }

  private resetPlayer() {
    this.newPlayer = {
      name: null,
      isNpc: false,
      initiative: null,
      ac: null,
      canModifyAc: false,
      isActive: true
    }
  }
}
