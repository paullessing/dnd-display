import {Component, OnInit} from "angular2/core";
import {InitiativeService, EVENT_NAME_START_TIMER, EVENT_NAME_NEXT_PLAYER} from "../../services/initiative.service";
import {InitiativeOrder} from "../../entities/initiative";
import {TimerComponent} from "../timer/timer.component";
import {NewInitiativeComponent} from "../new-initiative/new-initiative.component";

@Component({
  selector: 'initiative-control',
  styles: [
    `
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
  public timerIsStarted = false;

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

  public newInitiative(initiative: InitiativeOrder) {
    this.initiativeService.create(initiative);
  }

  private handleAction(action: string) {
    switch(action) {
      case EVENT_NAME_START_TIMER:
        this.timerIsStarted = true;
        break;
      case EVENT_NAME_NEXT_PLAYER:
        this.timerIsStarted = false;
        break;
    }
  }
}
