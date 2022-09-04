import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  timer: any;
  @Input() timerStarted: boolean = false;
  @Input() reset: boolean = false;

  hour: string = "00";
  minute: string = "00";
  second: string = "00";

  totalSeconds: number = 0;
  @Output() timeEvent: EventEmitter<number> = new EventEmitter<number>();

  onNotify = (clicked: boolean): void => {
    if (clicked) {
      this.timer();
    } else {
      this.stopTimer();
    }
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.timeEvent.emit(this.totalSeconds);
  }

  resetTimer = () => {
    clearInterval(this.timer);
    this.hour = "00";
    this.minute = "00";
    this.second = "00";
    this.timeEvent.emit(this.totalSeconds);
  }

  constructor() { }

  ngOnInit(): void {
    this.timer = () => {
      let countTimer;
      countTimer = () => {
        ++this.totalSeconds;
        let hour = Math.floor(this.totalSeconds / 3600);
        let minute = Math.floor((this.totalSeconds - hour * 3600) / 60);
        let second = this.totalSeconds - (hour * 3600 + minute * 60);

        if (minute < 10 || second < 10) {
          let formatNumber = (num: number): string => {
            let formattedNumber = num.toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false
            });

            return formattedNumber;
          }

          this.hour = formatNumber(hour);
          this.minute = formatNumber(minute);
          this.second = formatNumber(second);
        } else {
          this.hour = hour.toString();
          this.minute = minute.toString();
          this.second = second.toString();
        }
      }

      this.timer = setInterval(countTimer, 1000);
    }
  }

  ngOnChanges() {
    if (this.timerStarted && !this.reset) {
      this.timer();
    } else if (!this.timerStarted && !this.reset) {
      this.stopTimer();
    } else if (this.reset) {
      this.resetTimer();
    }
  }

}
