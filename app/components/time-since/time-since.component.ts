import {Component, Input, OnInit, OnDestroy, OnChanges, SimpleChange} from "angular2/core";

@Component({
  selector: 'time-since',
  template: '{{ displayTime }}'
})
export class TimeSinceComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public startTime: string;

  public displayTime: string;

  private startTimestamp: number;
  private interval: number;

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.calculateTime();
    }, 500);
    this.calculateTime();

    if (this.startTime) {
      this.startTimestamp = new Date(this.startTime).getTime();
    }
  }

  ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    if (changes['startTime']) {
      this.startTimestamp = new Date(this.startTime).getTime();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private calculateTime() {
    if (!this.startTime) {
      this.displayTime = '';
    }
    let difference = new Date().getTime() - this.startTimestamp;
    this.displayTime = this.convertToString(difference / 1000);
  }


  private convertToString(time: number) {
    if (typeof time !== 'number') {
      return '';
    }
    time = Math.floor(time);
    let seconds = time % 60;
    time = Math.floor(time / 60);
    if (time === 0) {
      return seconds + 's';
    }
    let minutes = time % 60;
    time = Math.floor(time / 60);
    if (time === 0) {
      return minutes + 'm';
    }
    return time + 'h ' + (minutes >= 10 ? minutes : '0' + minutes) + 'm';
  }
}
