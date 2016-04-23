import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

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
  ]
})
@RouteConfig([
])
export class AppComponent {
  constructor(
  ) {
    let socket = io('https://home.paullessing.com');
    socket.on('connect', function() {
      console.log("connected");
      socket.emit('subscribe', 'fooChan');
      socket.on('action', function(data) {
        console.log("Got data", data);
      });
    });
  }
}
