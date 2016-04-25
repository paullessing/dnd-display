import {Injectable} from "angular2/core";

@Injectable()
export class SocketService {
  private socket: Promise<SocketIOClient.Emitter>;
  private subscriptions: { [name: string]: ((value: any) => void)[] } = {};

  constructor() {
    this.socket = new Promise((resolve) => {
      let instance = io('https://home.paullessing.com');
      instance.on('connect', () => {
        instance.on('action', action => this.handleAction(action));

        resolve(instance);
      });
    });
    // socket.emit('subscribe', 'fooChan');
    // socket.on('action', function(data) {
    //   console.log("Got data", data);
    // });

    //
  }

  public get channels() {
    return {
      get: (name: string) => {
        if (this.subscriptions[name]) {
        }
      }
    }
  }

  public addListener<T>(channelName: string, handler: (value: T) => void): () => void {
    let currentSubscriptions = this.subscriptions[channelName] || (this.subscriptions[channelName] = []);
    if (!currentSubscriptions.length) {
      this.socket.then(socket => socket.emit('subscribe', channelName));
    }
    currentSubscriptions.push(handler);

    return () => {
      let index = this.subscriptions[channelName].indexOf(handler);
      if (index >= 0) {
        this.subscriptions[channelName] = this.subscriptions[channelName].splice(index, 1);
      }
    }
  }

  private handleAction(action: any) {
    console.log('ACTION', action);
  }
}
