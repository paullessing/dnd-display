import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {SocketService, UnsubscribeFunction} from "./socket.service";
import {Action} from "../entities/action";
import {InitiativeOrder} from "../entities/initiative";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";

export const CHANNEL_NAME_INITIATIVE = 'test-initiative';

@Injectable()
export class InitiativeService {
  public initiative: Subject<InitiativeOrder> = new ReplaySubject(1);
  public actions: Subject<string> = new Subject();

  private currentInitiative: InitiativeOrder;

  constructor(
    private socket: SocketService,
    private http: Http
  ) {
    this.subscribeAndGet<InitiativeOrder>(CHANNEL_NAME_INITIATIVE, action => this.updateInitiative(action));
  }

  public nextPlayer() {
    if (!this.currentInitiative) {
      return;
    }
    let newInitiative = Object.assign({}, this.currentInitiative);
    let players = newInitiative.players;
    let newIndex = newInitiative.currentIndex;
    do {
      newIndex = (newIndex + 1) % players.length;
    } while (newIndex !== this.currentInitiative.currentIndex && !players[newIndex].isActive);
    newInitiative.currentIndex = newIndex;

    this.socket.postAction(CHANNEL_NAME_INITIATIVE, 'next', newInitiative);
  }

  public startTimer() {
    this.socket.postAction(CHANNEL_NAME_INITIATIVE, 'timer-start', this.currentInitiative);
  }

  private updateInitiative(action: Action<InitiativeOrder>): void {
    if (!this.currentInitiative) {
      this.update(action.data);
    } else {
      switch (action.name) {
        case 'next':
              this.update(action.data);
              this.actions.next('next');
              break;
        case 'timer-start':
              this.actions.next('timer-start');
              break;
        default:
              console.warn('Unexpected event:', action.name);
              // Do nothing
      }
    }
  }

  private update(initiative: InitiativeOrder) {
    this.currentInitiative = initiative;
    this.initiative.next(this.currentInitiative);
  }

  private getFromChannel(channelName: string): Promise<Action<any>> {
    return this.http.get(`https://home.paullessing.com/channel/${channelName}/latest`)
      .map(response => response.json())
      .toPromise();
  }

  private subscribeAndGet<T>(channelName: string, handler: (action: Action<T>) => void): UnsubscribeFunction {
    let unsubscribe = this.socket.subscribe(channelName, handler);
    this.getFromChannel(channelName).then(handler);
    return unsubscribe;
  }
}
