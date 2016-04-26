import {Component, Input, OnChanges, SimpleChange} from "angular2/core";

@Component({
  selector: 'timer',
  styles: [`
`],
  template: `
<div [hidden]="!time" [class.urgent]="isOverTime">
  <div class="time">{{ time }}</div>
  <progress [max]="seconds" [value]="accurateSeconds"></progress>
</div>
`
})
export class TimerComponent implements OnChanges {
  public time: string;
  public accurateSeconds: number;
  public isOverTime: boolean;
  public total: number;

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
      this.accurateSeconds = this.seconds;
      this.isOverTime = false;
      this.total = this.seconds;
    }
    if (changes['isStarted']) {
      this.changeStarted();
    }
  }

  private changeStarted(): void {
    if (this.isStarted) {
      console.log('Changing started');
      window.requestAnimationFrame(this.doStep);
    } else {
      this.time = this.toTime(this.seconds);
      this.startTime = null;
      this.accurateSeconds = this.seconds;
      this.total = this.seconds;
      this.isOverTime = false;
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
    let oldSecondsPositive = this.accurateSeconds >= 0;
    let newSeconds = Math.floor((this.seconds - difference) * 100) / 100;
    if (newSeconds < 0 && oldSecondsPositive) {
      this.isOverTime = true;
    }
    this.accurateSeconds = Math.min(this.seconds, Math.abs(newSeconds));
    this.time = this.toTime(this.accurateSeconds);
    if (this.isOverTime && this.accurateSeconds >= this.seconds) {
      this.isStarted = false;
    } else {
      window.requestAnimationFrame(this.doStep);
    }
  }

  private toTime(time: number) {
    let result;
    time = Math.floor(time);
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
