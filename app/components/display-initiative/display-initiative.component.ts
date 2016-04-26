import {Component, OnInit} from "angular2/core";
import {InitiativeService, EVENT_NAME_START_TIMER, EVENT_NAME_NEXT_PLAYER} from "../../services/initiative.service";
import {InitiativeOrder, InitiativeEntry} from "../../entities/initiative";
import {TimerComponent} from "../timer/timer.component";
import {NewInitiativeComponent} from "../new-initiative/new-initiative.component";

@Component({
  selector: 'display-initiative',
  templateUrl: 'app/components/display-initiative/display-initiative.component.html',
  directives: [TimerComponent, NewInitiativeComponent],
  styles: [`
display-initiative {
  height: 100%;
  color: #333;
}
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.initiative {
  color: #363636;
  font-size: 26vh;
  font-family: Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;
  font-weight: 100;
}
`]
})
export class DisplayInitiativeComponent implements OnInit {
  public currentPlayer = null;
  public timerIsStarted = false;

  constructor(
    private initiativeService: InitiativeService
  ) {
  }

  ngOnInit(): void {
    this.initiativeService.initiative.subscribe((order: InitiativeOrder) => {
      this.currentPlayer = order.players[this.findIndex(order.players, order.currentId)];
    });
    this.initiativeService.actions.subscribe((action: string) => {
      this.handleAction(action);
    })
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
        this.timerIsStarted = true;
        break;
      case EVENT_NAME_NEXT_PLAYER:
        this.timerIsStarted = false;
        break;
    }
  }
}
