import {Injectable} from "angular2/core";
import {SocketEvent} from "../entities/socket-event";
import {Action} from "../entities/action";
import {Http, Headers} from "angular2/http";

export interface ActionHandler {
  (action: Action<any>): void;
}

export interface UnsubscribeFunction {
  (): void;
}

@Injectable()
export class SocketService {
  private socket: Promise<SocketIOClient.Emitter>;
  private subscriptions: { [name: string]: ((value: any) => void)[] } = {};

  constructor(
    private http: Http
  ) {
    this.socket = new Promise((resolve) => {
      let instance = io('https://home.paullessing.com');
      instance.on('connect', () => {
        instance.on('action', action => this.handleEvent(action));

        resolve(instance);
      });
    });
    // socket.emit('subscribe', 'fooChan');
    // socket.on('action', function(data) {
    //   console.log("Got data", data);
    // });

    //
  }

  public postAction(channelName: string, action: string, data: any) {
    this.http.put(`https://home.paullessing.com/channel/${channelName}/action`, JSON.stringify({
      action,
      data
    }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).toPromise();
  }

  public subscribe(channelName: string, handler: ActionHandler): UnsubscribeFunction {
    let currentSubscriptions = this.subscriptions[channelName] || (this.subscriptions[channelName] = []);
    if (!currentSubscriptions.length) {
      this.socket.then(socket => socket.emit('subscribe', channelName));
    }
    currentSubscriptions.push(handler);

    return () => {
      let index = this.subscriptions[channelName].indexOf(handler);
      if (index >= 0) {
        this.subscriptions[channelName] = this.subscriptions[channelName].splice(index, 1);
        if (!this.subscriptions[channelName].length) {
          this.socket.then(socket => socket.emit('unsubscribe', channelName));
        }
      }
    }
  }

  private handleEvent(event: SocketEvent) {
    let listeners = this.subscriptions[event.channelName];
    if (!listeners) {
      this.socket.then(socket => socket.emit('unsubscribe', event.channelName));
      return;
    }
    listeners.forEach(listener => listener(event.action));
  }
}
