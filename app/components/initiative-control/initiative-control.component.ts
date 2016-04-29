import {Component, OnInit} from "angular2/core";
import {
  InitiativeService, EVENT_NAME_START_TIMER, EVENT_NAME_NEXT_PLAYER,
  EVENT_NAME_RESET_TIMER, EVENT_NAME_STOP_TIMER
} from "../../services/initiative.service";
import {InitiativeOrder} from "../../entities/initiative";
import {TimerComponent, TimerEvent} from "../timer/timer.component";
import {NewInitiativeComponent} from "../new-initiative/new-initiative.component";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'initiative-control',
  styles: [
    `
:host {
  display: block;
  padding: 20px;
}
.initiative__player--active:after {
  content: '<--'
}
`
  ],
  templateUrl: 'app/components/initiative-control/initiative-control.component.html',
  directives: [TimerComponent, NewInitiativeComponent]
})
export class InitiativeControlComponent implements OnInit {
  public initiativeOrder: InitiativeOrder;
  public timerControl: Subject<TimerEvent> = new Subject<TimerEvent>();

  constructor(
    private initiativeService: InitiativeService
  ) {
  }

  ngOnInit(): void {
    this.initiativeService.initiative.subscribe((order: InitiativeOrder) => {
      this.initiativeOrder = order;
      console.log('Ive got an initiative');
    });
    this.initiativeService.actions.subscribe((action: string) => {
      this.handleAction(action);
    });
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
