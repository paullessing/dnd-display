export interface SocketEvent {
  channelName: string;
  action: {
    name: string;
    data: any;
    seqId: number;
    _id: string;
    timestamp: string; // 2016-04-24T09:32:35.704Z
  }
}
