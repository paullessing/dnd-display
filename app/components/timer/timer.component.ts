import {Component, Input, OnChanges, SimpleChange} from "angular2/core";

@Component({
  selector: 'timer',
  template: `
  <div [hidden]="!time">{{ time }}</div>
`
})
export class TimerComponent implements OnChanges {
  public time: string;

  @Input()
  public seconds: number;

  @Input()
  public isStarted: boolean;

  private startTime: number;
  private doStep: (timestamp: number) => void;

  constructor() {
    this.doStep = this.step.bind(this);
  }

  ngOnChanges(changes: {[key: string]: SimpleChange}): void {
    if (changes['seconds']) {
      this.time = this.toTime(this.seconds);
    }
    if (changes['isStarted']) {
      this.changeStarted();
    }
  }

  private changeStarted(): void {
    if (this.isStarted) {
      window.requestAnimationFrame(this.doStep);
    } else {
      this.time = this.toTime(this.seconds);
    }
  }

  private step(timestamp: number): void {
    if (!this.isStarted) {
      return;
    }
    if (!this.startTime) {
      this.startTime = timestamp;
    }
    let difference = (timestamp - this.startTime) / 1000;
    let newSeconds = Math.max(0, this.seconds - difference);
    this.time = this.toTime(newSeconds);
    if (newSeconds > 0) {
      window.requestAnimationFrame(this.doStep);
    }
  }

  private toTime(time: number) {
    let result;
    let time = Math.floor(time);
    let seconds = time % 60;
    result = (seconds >= 10 ? seconds : '0' + seconds);
    time = Math.floor(time / 60);
    if (time === 0) {
      result = '00:' + result;
      return result;
    }
    let minutes = time % 60;
    result = (minutes >= 10 ? minutes : '0' + minutes) + ':' + result;
    time = Math.floor(time / 60);
    if (time === 0) {
      return result;
    }
    return time + ':' + result;
  }
}
