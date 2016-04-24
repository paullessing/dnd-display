import {Component} from "angular2/core";
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'display-initiative',
  template: `

`,

})
export class DisplayInitiativeComponent {
  constructor(
    private socket: SocketService
  ) {
    socket.addListener('test-initiative', () => {

    });
  }
}
