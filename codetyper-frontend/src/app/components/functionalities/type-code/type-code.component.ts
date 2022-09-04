import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NuMonacoEditorComponent, NuMonacoEditorDiffModel, NuMonacoEditorModel } from '@ng-util/monaco-editor';
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

  // @ViewChild(NuMonacoEditorComponent, { static: false })
  // model: NuMonacoEditorModel | any;
  // modelType: NuMonacoEditorModel | any;

  text: string = "";

  currentSnippet: CodeSnippet | any;

  clickEventSubscription: Subscription | any;

  currentTheme = "vs-dark";
  options = {
    theme: this.currentTheme, minimap: { enabled: false },
    contextmenu: false, formatOnType: true,
    renderControlCharacters: false, renderOverviewRuler: false,
    scrollBeyondLastLine: false, selectionClipboard: false,
    selectOnLineNumbers: false, quickSuggestions: false,
    renderIndicators: false
  };
  oldModel: NuMonacoEditorDiffModel | any;
  newModel: NuMonacoEditorDiffModel | any;
  height = "30rem";
  setTheme: any;

  timer: any;
  toggleStartTimer: boolean = true;
  toggleStopTimer: boolean = false;
  hour: string = "00";
  minute: string = "00";
  second: string = "00";

  isLoading: boolean = true;

  handleKeydown: any;

  initializeMonacoEditor = (value: string) => {
    this.oldModel = {
      code: value,
      language: "java"
    };
    this.newModel = {
      code: "",
      language: "java"
    }

    // this.model = {
    //   value: value,
    //   language: "java",
    // };
    // this.modelType = {
    //   value: "",
    //   language: "java",
    // };
  }

  getRandomSnippet = () => {
    this.subs.add(this.snippetService.getRandomSnippet().subscribe(data => {
      this.currentSnippet = {
        id: data.id,
        title: data.title,
        language: data.language,
        description: data.description,
        content: data.content
      };
      this.initializeMonacoEditor(this.currentSnippet.content);
      // this.checkForTypingErrors();
    }));
  }

  stopTimer = () => {
    clearInterval(this.timer);
  }

  resetTimer = () => {
    clearInterval(this.timer);
    this.hour = "00";
    this.minute = "00";
    this.second = "00";
  }

  constructor(private snippetService: CodeSnippetService, private sharedService: SharedService, @Inject(DOCUMENT) private document: Document, private elementRef: ElementRef, private renderer: Renderer2) {
    this.initializeMonacoEditor("");
  }

  ngOnInit(): void {
    this.getRandomSnippet();

    this.clickEventSubscription = this.subs.add(this.sharedService.getClickEvent().subscribe(() => {
      this.getRandomSnippet();
      this.resetTimer();
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

    this.handleKeydown = (event: any) => {
      if (event.key && this.toggleStartTimer) {
        this.toggleStartTimer = false;
        this.timer();
      }

      if (event.key == monaco.KeyCode.Alt && event.key == monaco.KeyCode.Shift && event.key == monaco.KeyCode.KeyF) {
        console.log("here")
      }

      if (event.altKey && event.shiftKey && event.key.toLowerCase() == "f") {
        event.preventDefault();
        // this.modelEdit.trigger(this.modelEdit.code, "editor.action.formatDocument");
      }

      if (event.ctrlKey && event.key.toLowerCase() == "s") {
        event.preventDefault();
        this.stopTimer();
      }

      if (event.ctrlKey && event.key.toLowerCase() == "v" ||
        event.ctrlKey && event.key.toLowerCase() == "c" ||
        event.ctrlKey && event.key.toLowerCase() == "z") {
        event.preventDefault();
      }
    }
  }

  // @ViewChild("input") inputElement: ElementRef | any;
  // @ViewChild("output") outputElement: ElementRef | any;

  // checkForTypingErrors = () => {
  //   const snippet = this.currentSnippet.content;
  //   snippet.split("").forEach((char: string) => {
  //     const charSpan = this.document.createElement("span");
  //     charSpan.innerText = char;
  //     this.renderer.appendChild(this.inputElement.nativeElement, charSpan);
  //   });
  // }

  ngAfterViewInit() {
    //   this.elementRef.nativeElement.querySelector("#editor2")
    //     .addEventListener("input", () => {
    //       const arraySnippet = this.editor1.querySelectorAll("span");
    //       const arrayValue = this.editor2.value.split("");
    //       arraySnippet.foreach((charSpan: { classList: { remove: (arg0: string) => void; add: (arg0: string) => void; }; innerText: any; }, index: string | number) => {
    //         const char = arrayValue[index];
    //         if (char == null) {
    //           charSpan.classList.remove("correct");
    //           charSpan.classList.remove("incorrect");
    //         }
    //         if (char === charSpan.innerText) {
    //           charSpan.classList.add("correct");
    //           charSpan.classList.remove("incorrect");
    //         } else {
    //           charSpan.classList.remove("correct");
    //           charSpan.classList.add("incorrect");
    //         }
    //       });
    //     });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}