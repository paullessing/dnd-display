import {Component, OnInit} from "angular2/core";
import {InitiativeService} from "../../services/initiative.service";
import {InitiativeOrder} from "../../entities/initiative";

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
</div>
`,

})
export class DisplayInitiativeComponent implements OnInit {
  public initiativeOrder: InitiativeOrder;

  constructor(
    private initiativeService: InitiativeService
  ) {
  }

  ngOnInit(): void {
    this.initiativeService.initiative.subscribe((order: InitiativeOrder) => {
      this.initiativeOrder = order;
      console.log('Ive got an initiative');
    });
  }

  public next(): void {
    this.initiativeService.nextPlayer();
  }
}
