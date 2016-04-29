import {Component, Output, EventEmitter, OnInit} from "angular2/core";
import {InitiativeOrder, InitiativeEntry} from "../../entities/initiative";

export const LOCAL_STORAGE_PLAYERS = 'pc-players';

@Component({
  selector: 'new-player',
  templateUrl: 'app/components/new-player/new-player.component.html'
})
export class NewPlayerComponent implements OnInit {
  @Output()
  public created: EventEmitter<InitiativeEntry> = new EventEmitter();

  public newPlayer: InitiativeEntry;
  public players: { [name: string]: InitiativeEntry };
  public playerNames: string[];
  public selectedPlayer: string;

  constructor() {
    this.resetPlayer();
  }

  ngOnInit(): void {
    this.initPlayers();
  }

  public submit() {
    if (!this.newPlayer.name ||
      !this.newPlayer.isNpc && !this.newPlayer.ac ||
      typeof this.newPlayer.initiative !== 'number') {
      return;
    }
    this.created.emit(this.newPlayer);
    if (!this.newPlayer.isNpc) {
      this.storePlayer(this.newPlayer);
      this.initPlayers(); // TODO optimise this
    }

    this.resetPlayer();
  }

  public selectPlayer(playerName: string) {
    this.selectedPlayer = playerName;
    setTimeout(() => {
      this.selectedPlayer = '';
    }, 10);

    if (!playerName) {
      return;
    }
    let player = this.players[playerName];
    if (!player) {
      console.warn('Player not found:', playerName);
      return;
    }
    Object.assign(this.newPlayer, {
      name: player.name,
      ac: player.ac,
      canModifyAc: player.canModifyAc,
      isActive: true,
      isNpc: false
    });
  }

  private initPlayers(): void {
    this.players = this.getPlayers();
    this.playerNames = Object.keys(this.players);
  }

  private storePlayer(player: InitiativeEntry) {
    let players = this.getPlayers();
    players[player.name] = player;
    localStorage.setItem(LOCAL_STORAGE_PLAYERS, JSON.stringify(players));
  }

  private getPlayers(): { [name: string]: InitiativeEntry } {
    let data = localStorage.getItem(LOCAL_STORAGE_PLAYERS);
    let players: { [name: string]: InitiativeEntry } = {};
    if (data) {
      try {
        players = JSON.parse(data);
      } catch (e) {
        console.error(e);
        players = {};
      }
    }
    return players;
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
