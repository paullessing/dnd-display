import {Component, Input, OnChanges, SimpleChange, OnInit} from "angular2/core";
import {Observable} from "rxjs/Observable";

export enum TimerEvent {
  START,
  STOP,
  RESET
}

@Component({
  selector: 'timer',
  styles: [`
:host.large {
  text-align: center;
  color: #363636;
  font-family: Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;
  font-weight: 100;
}

:host.large .time {
  font-size: 20vh;
  margin-bottom: 0.2em;
}
:host.large progress {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
}

:host.large progress::-webkit-progress-bar {
  background-color: #ddd;
  height: inherit;
}

:host.large progress::-webkit-progress-value {
  background-color: #007;
  border-radius: 2px;
  height: inherit;
}

:host .urgent {
  color: red;
}
:host .urgent progress::-webkit-progress-value {
  background-color: red;
}
`],
  template: `
<div [hidden]="!time" [class.urgent]="isOverTime">
  <div class="time">{{ time }}</div>
  <progress [max]="seconds" [value]="accurateSeconds"></progress>
</div>
`
})
export class TimerComponent implements OnChanges, OnInit {
  public time: string;
  public accurateSeconds: number;
  public isOverTime: boolean;
  public total: number;

  @Input()
  public seconds: number;

  @Input()
  public control: Observable<TimerEvent>

  private isRunning: boolean;
  private startTime: number;
  private doStep: (timestamp: number) => void;

  constructor() {
    this.doStep = this.step.bind(this);
  }

  ngOnInit() {
    this.control.subscribe((event: TimerEvent) => {
      switch (event) {
        case TimerEvent.START:
          this.toggle(true);
          break;
        case TimerEvent.STOP:
          this.toggle(false);
          break;
        case TimerEvent.RESET:
          this.reset();
          break;
      }
    });
  }

  ngOnChanges(changes: {[key: string]: SimpleChange}): void {
    if (changes['seconds']) {
      this.reset();
    }
  }

  private reset(): void {
    this.isRunning = false;
    this.time = this.toTime(this.seconds);
    this.accurateSeconds = this.seconds;
    this.isOverTime = false;
    this.total = this.seconds;
    this.startTime = null;
  }

  private toggle(run: boolean): void {
    if (run) {
      if (!this.isRunning) {
        this.reset();
        this.isRunning = true;
        window.requestAnimationFrame(this.doStep);
      }
    } else {
      if (this.isRunning) {
        this.isRunning = false;
      }
    }
  }

  private step(timestamp: number): void {
    if (!this.isRunning) {
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
    this.time = this.toTime(this.accurateSeconds, newSeconds < 0);
    if (this.isOverTime && this.accurateSeconds >= this.seconds) {
      this.isRunning = false;
    } else {
      window.requestAnimationFrame(this.doStep);
    }
  }

  private toTime(time: number, isNegative?: boolean) {
    let prefix = isNegative ? '-' : '';
    let result;
    time = Math.floor(time);
    let seconds = time % 60;
    result = (seconds >= 10 ? seconds : '0' + seconds);
    time = Math.floor(time / 60);
    if (time === 0) {
      result = '00:' + result;
      return prefix + result;
    }
    let minutes = time % 60;
    result = (minutes >= 10 ? minutes : '0' + minutes) + ':' + result;
    time = Math.floor(time / 60);
    if (time === 0) {
      return prefix + result;
    }
    return prefix + time + ':' + result;
  }
}
