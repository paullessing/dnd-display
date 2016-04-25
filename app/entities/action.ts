export interface Action<T> {
  name: string;
  seqId: number;
  timestamp: string;
  data: T;
}
