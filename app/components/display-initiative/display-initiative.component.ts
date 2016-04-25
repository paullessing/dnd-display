import {Component, OnInit} from "angular2/core";
import {InitiativeService} from "../../services/initiative.service";
import {InitiativeOrder} from "../../entities/initiative";
import {TimerComponent} from "../timer/timer.component";

@Component({
  selector: 'display-initiative',
  styles: [
    `
.initiative__player--active:after {
  content: '<--'
}
`
  ],
  template: `
<div *ngIf="initiativeOrder && initiativeOrder.isRunning">
  <h1>Initiative</h1>
  <ul>
    <li
      *ngFor="#player of initiativeOrder.players; #i = index"
      class="initiative__player"
      [class.initiative__player--active]="initiativeOrder.currentIndex === i"
    >
      {{ player.name }} <span *ngIf="player.ac">(AC: {{ player.ac }})</span>
    </li>
  </ul>
  <button (click)="next()">Next</button>
  <timer [isStarted]="timerIsStarted" [seconds]="120"></timer><button (click)="startTimer()">Start Time</button>
</div>
`,
  directives: [TimerComponent]
})
export class DisplayInitiativeComponent implements OnInit {
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
    })
  }

  public next(): void {
    this.initiativeService.nextPlayer();
  }

  public startTimer(): void {
    this.initiativeService.startTimer();
  }

  private handleAction(action: string) {
    switch(action) {
      case 'timer-start':
        this.timerIsStarted = true;
        break;
      case 'next':
        this.timerIsStarted = false;
        break;
    }
  }
}
