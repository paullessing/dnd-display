import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {SocketService, UnsubscribeFunction} from "./socket.service";
import {Action} from "../entities/action";
import {InitiativeOrder} from "../entities/initiative";
import {Subject} from "rxjs/Subject";
import {ReplaySubject} from "rxjs/ReplaySubject";

export const CHANNEL_NAME_INITIATIVE = 'test-initiative';

export const EVENT_NAME_CREATE: string = 'create';
export const EVENT_NAME_NEXT_PLAYER: string = 'next';
export const EVENT_NAME_START_TIMER: string = 'timer-start';

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
    if (!newInitiative.showAll && newIndex < this.currentInitiative.currentIndex) {
      // We've wrapped round
      newInitiative.showAll = true;
    }

    this.socket.postAction(CHANNEL_NAME_INITIATIVE, EVENT_NAME_NEXT_PLAYER, newInitiative);
  }

  public startTimer() {
    this.socket.postAction(CHANNEL_NAME_INITIATIVE, EVENT_NAME_START_TIMER, this.currentInitiative);
  }

  public create(initiative: InitiativeOrder) {
    this.socket.postAction(CHANNEL_NAME_INITIATIVE, EVENT_NAME_CREATE, initiative);
  }

  private updateInitiative(action: Action<InitiativeOrder>): void {
    if (!this.currentInitiative) {
      this.update(action.data);
    } else {
      switch (action.name) {
        case EVENT_NAME_CREATE:
              this.update(action.data);
              this.actions.next(EVENT_NAME_CREATE);
        case EVENT_NAME_NEXT_PLAYER:
              this.update(action.data);
              this.actions.next(EVENT_NAME_NEXT_PLAYER);
              break;
        case EVENT_NAME_START_TIMER:
              this.actions.next(EVENT_NAME_START_TIMER);
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
