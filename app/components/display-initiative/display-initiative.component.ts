import {Component, OnInit} from "angular2/core";
import {
  InitiativeService, EVENT_NAME_START_TIMER, EVENT_NAME_NEXT_PLAYER,
  EVENT_NAME_STOP_TIMER, EVENT_NAME_RESET_TIMER
} from "../../services/initiative.service";
import {InitiativeOrder, InitiativeEntry} from "../../entities/initiative";
import {TimerComponent, TimerEvent} from "../timer/timer.component";
import {NewInitiativeComponent} from "../new-initiative/new-initiative.component";
import {Subject} from "rxjs/Subject";
import {TimeSinceComponent} from "../time-since/time-since.component";

@Component({
  selector: 'display-initiative',
  templateUrl: 'app/components/display-initiative/display-initiative.component.html',
  directives: [TimerComponent, NewInitiativeComponent, TimeSinceComponent],
})
export class DisplayInitiativeComponent implements OnInit {
  public currentPlayer = null;
  public nextPlayer = null;
  public currentRound = null;
  public timerControl: Subject<TimerEvent> = new Subject<TimerEvent>();

  public roundTime: number = 120;

  private startTime: string;

  constructor(
    private initiativeService: InitiativeService
  ) {
  }

  ngOnInit(): void {
    this.initiativeService.initiative.subscribe((order: InitiativeOrder) => {
      this.updatePlayers(order);
      this.currentRound = order.roundNumber || null;
      this.startTime = order.startTime;
    });
    this.initiativeService.actions.subscribe((action: string) => {
      this.handleAction(action);
    });
  }

  private updatePlayers(initiative: InitiativeOrder) {
    if (!initiative.players.length) {
      this.currentPlayer = null;
      return;
    }
    let currentIndex = this.findIndex(initiative.players, initiative.currentId);
    this.currentPlayer = initiative.players[currentIndex];
    let index = currentIndex;
    let isNext = false;
    do {
      index = (index + 1) % initiative.players.length;
      let nextPlayer = initiative.players[index];
      if (index === currentIndex) {
        isNext = true;
      } else {
        if (nextPlayer.isActive) {
          if (nextPlayer.isNpc) {
            isNext = initiative.showAll;
          } else {
            isNext = true;
          }
        }
      }
    } while (!isNext);
    this.nextPlayer = initiative.players[index];
  }

  private findIndex(players: InitiativeEntry[], id: number) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  private handleAction(action: string) {
    switch(action) {
      case EVENT_NAME_START_TIMER:
        this.timerControl.next(TimerEvent.START);
        break;
      case EVENT_NAME_STOP_TIMER:
        this.timerControl.next(TimerEvent.STOP);
        break;
      case EVENT_NAME_RESET_TIMER:
        this.timerControl.next(TimerEvent.RESET);
        break;
      case EVENT_NAME_NEXT_PLAYER:
        this.timerControl.next(TimerEvent.RESET);
        break;
    }
  }
}
