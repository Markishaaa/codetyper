import { Component, ElementRef, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NuMonacoEditorDiffModel } from '@ng-util/monaco-editor';
import { Subscription } from 'rxjs';
import { CodeSnippet } from 'src/app/api/code-snippet';
import { CodeSnippetService } from 'src/app/services/code-snippet.service';
import { SharedService } from 'src/app/services/shared.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-type-code',
  templateUrl: './type-code.component.html',
  styleUrls: ['./type-code.component.scss']
})
export class TypeCodeComponent implements OnInit, OnDestroy {

  subs = new SubSink();

  @Output()
  selectedLang: string = "java";
  @Output()
  selectedTheme: string = "vs";

  isCompared: boolean = false;
  text: string = "";

  @Input()
  languages = [ "java" ];

  @Input()
  themes = [
    {
      value: "vs",
      name: "Visual Studio"
    }
  ];

  // input
  inputOptions = { theme: "vs", language: this.selectedLang };
  // compare, output
  diffOptions = { theme: "vs", language: this.selectedLang, readOnly: true, renderSideBySide: true };
  originalModel: NuMonacoEditorDiffModel = {
    code: '',
    language: this.selectedLang
  };

  modifiedModel: NuMonacoEditorDiffModel = {
    code: '',
    language: this.selectedLang
  };

  currentSnippet: CodeSnippet | any;

  getRandomSnippet: any;
  clickEventSubscription: Subscription | any;

  timer: any;
  stopTimer: any;
  toggleStartTimer: boolean = true;
  toggleStopTimer: boolean = false;
  hour: string = "00";
  minute: string = "00";
  second: string = "00";

  handleKeydown: any;

  @ViewChild("box1") box1: ElementRef | any;
  @ViewChild("box2") box2: ElementRef | any;
  setHeight: any;

  constructor(private snippetService: CodeSnippetService, private sharedService: SharedService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getRandomSnippet = () => {
      this.subs.add(this.snippetService.getRandomSnippet().subscribe(data => {
        this.currentSnippet = data;
        this.setHeight();
      }));
    }

    this.getRandomSnippet();
    this.clickEventSubscription = this.subs.add(this.sharedService.getClickEvent().subscribe(() => {
      this.getRandomSnippet();
    }));

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
      let toggle = false;
      let start = event.target.selectionStart;
      let end = event.target.selectionEnd;

      if (event.key === "Tab") {
        event.preventDefault();
        event.target.value = event.target.value.substring(0, start) + "  " + event.target.value.substring(end);
        event.target.selectionStart = event.target.selectionEnd = start + 1;
      }
      if (event.key === "{") {
        toggle = true;
      }
      if (event.key === "Enter") {
        console.log("enter")
        event.target.value = event.target.value.substring(0, start) + "\t" + event.target.value.substring(end);
        event.target.selectionStart = event.target.selectionEnd = start + 1;
        toggle = false;
      }
      if (toggle && event.key === "}") {
        console.log("toggle off")
        toggle = false;
      }

      if (event.key && this.toggleStartTimer) {
        this.toggleStartTimer = false;
        this.timer();
      }
    }
  }

  ngAfterViewInit() {
    this.setHeight = () => {
      let height = (<HTMLElement>this.box1.nativeElement).getBoundingClientRect().height;
      console.log(height);
      this.renderer.setStyle(this.box2.nativeElement, 'height', `${height}px`);
    }

    this.setHeight();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
 
  onCompare() {
    this.originalModel = Object.assign({}, this.originalModel, { code: this.currentSnippet.content });
    this.modifiedModel = Object.assign({}, this.originalModel, { code: this.text });
    this.isCompared = true;
    window.scrollTo(0, 0); // scroll the window to top
  }

}
