import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CodeSnippet } from 'src/app/api/code-snippet';
import { CodeSnippetService } from 'src/app/services/code-snippet.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-type-code',
  templateUrl: './type-code.component.html',
  styleUrls: ['./type-code.component.scss']
})
export class TypeCodeComponent implements OnInit {

  currentSnippet: CodeSnippet | any;

  getRandomSnippet: any;
  clickEventSubscription: Subscription | any;

  timer: any;
  stopTimer: any;
  hour: string = "00";
  minute: string = "00";
  second: string = "00";

  handleKeydown: any;

  constructor(private snippetService: CodeSnippetService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getRandomSnippet = () => {
      this.snippetService.getRandomSnippet().subscribe(data => {
        this.currentSnippet = data;
      });
    }

    this.getRandomSnippet();
    this.clickEventSubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.getRandomSnippet();
    });

    this.timer = () => {
      let totalSeconds = 0;
      let countTimer;
      countTimer = () => {
        ++totalSeconds;
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds - hour * 3600) / 60);
        let second = totalSeconds - (hour * 3600 + minute * 60);

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

    this.stopTimer = () => {
      clearInterval(this.timer);
    }

    this.handleKeydown = (event: any) => {
      if (event.key == "Tab") {
        event.preventDefault();
        let start = event.target.selectionStart;
        let end = event.target.selectionEnd;
        event.target.value = event.target.value.substring(0, start) + "\t" + event.target.value.substring(end);
        event.target.selectionStart = event.target.selectionEnd = start + 1;
      }
    }
  }

}
