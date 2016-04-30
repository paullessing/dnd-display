import {Component, OnInit} from "angular2/core";
import {
  InitiativeService, EVENT_NAME_START_TIMER, EVENT_NAME_NEXT_PLAYER,
  EVENT_NAME_RESET_TIMER, EVENT_NAME_STOP_TIMER
} from "../../services/initiative.service";
import {InitiativeOrder} from "../../entities/initiative";
import {TimerComponent, TimerEvent} from "../timer/timer.component";
import {NewInitiativeComponent} from "../new-initiative/new-initiative.component";
import {Subject} from "rxjs/Subject";
import {TimeSinceComponent} from "../time-since/time-since.component";

@Component({
  selector: 'initiative-control',
  styles: [
    `
:host {
  display: block;
  padding: 20px;
}
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
.currentTable tr.active {
  font-weight: bold;
  background-color: #ddd;
}
.toggle-active {
  font-size: 0.8em;
  font-weight: normal;
  color: #363636;
}
`
  ],
  templateUrl: 'app/components/initiative-control/initiative-control.component.html',
  directives: [TimerComponent, NewInitiativeComponent, TimeSinceComponent]
})
export class InitiativeControlComponent implements OnInit {
  public initiativeOrder: InitiativeOrder;
  public timerControl: Subject<TimerEvent> = new Subject<TimerEvent>();

  public roundTime: number = 120;

  constructor(
    private initiativeService: InitiativeService
  ) {
  }

  ngOnInit(): void {
    this.initiativeService.initiative.subscribe((order: InitiativeOrder) => {
      this.initiativeOrder = order;
    });
    this.initiativeService.actions.subscribe((action: string) => {
      this.handleAction(action);
    });
  }

  public clear(): void {
    this.initiativeService.clear();
  }

  public next(): void {
    this.initiativeService.nextPlayer();
  }

  public previous(): void {
    this.initiativeService.previousPlayer();
  }

  public startTimer(): void {
    this.initiativeService.startTimer();
  }

  public stopTimer(): void {
    this.initiativeService.stopTimer();
  }

  public resetTimer(): void {
    this.initiativeService.resetTimer();
  }

  public newInitiative(initiative: InitiativeOrder) {
    this.initiativeService.create(initiative);
  }

  public toggleActive(id: number) {
    this.initiativeService.toggleActive(id);
  }

  private getCombatTime(): number {
    if (this.initiativeOrder && this.initiativeOrder.startTime) {
      let time = new Date(this.initiativeOrder.startTime).getTime();
      let diff = (new Date().getTime() - time) / 1000;
      return diff;
    } else {
      return 0;
    }
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
