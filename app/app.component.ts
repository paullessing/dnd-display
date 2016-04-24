import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {SocketService} from "./services/socket.service";
import {DisplayInitiativeComponent} from "./components/display-initiative/display-initiative.component";

/**
 * Main app component for the character sheet app.
 */
@Component({
  selector: 'body[dnd-display], dnd-display',
  templateUrl: 'app/app.component.html',
  directives: [
    ROUTER_DIRECTIVES,
  ],
  providers: [
    SocketService
  ]
})
@RouteConfig([
  {path: '/initiative', name: 'Initiative', component: DisplayInitiativeComponent, useAsDefault: true},
])
export class AppComponent {
  constructor(
  ) {
  }
}
