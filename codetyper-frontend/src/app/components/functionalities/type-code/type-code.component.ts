import { Component, OnDestroy, OnInit } from '@angular/core';
import { NuMonacoEditorDiffModel } from '@ng-util/monaco-editor';
import { Subscription } from 'rxjs';
import { CodeSnippet } from 'src/app/api/code-snippet';
import { GlobalConstants } from 'src/app/api/global-constants';
import { Score } from 'src/app/api/score';
import { CodeSnippetService } from 'src/app/services/code-snippet.service';
import { ScoreService } from 'src/app/services/score.service';
import { SharedService } from 'src/app/services/shared.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-type-code',
  templateUrl: './type-code.component.html',
  styleUrls: ['./type-code.component.scss']
})
export class TypeCodeComponent implements OnInit, OnDestroy {

  subs = new SubSink();

  text: string = "";
  currentSnippet: CodeSnippet | any;
  snippetId: number = -1;

  clickEventSubscription: Subscription | any;

  currentTheme = "vs-dark";
  themes = ['vs-dark', 'hc-black'];
  options: any;
  oldModel: NuMonacoEditorDiffModel | any;
  newModel: NuMonacoEditorDiffModel | any;
  height = "30rem";

  timerStarted: boolean = false;
  resetTimer: boolean = false;

  score: Score | any;
  wpm: number = 0;
  seconds: number = 0;

  initializeMonacoEditor = (value: string) => {
    this.oldModel = {
      code: value,
      language: "java"
    };
    this.newModel = {
      code: "",
      language: "java"
    }
  }

  initializeOptions = () => {
    this.options = {
      theme: this.currentTheme, minimap: { enabled: false },
      contextmenu: false, formatOnType: true,
      renderControlCharacters: false, renderOverviewRuler: false,
      scrollBeyondLastLine: false, selectionClipboard: false,
      selectOnLineNumbers: false, quickSuggestions: false,
      renderIndicators: false
    };
  }

  getRandomSnippet = () => {
    this.subs.add(this.snippetService.getRandomSnippet().subscribe(data => {
      this.currentSnippet = data;
      this.snippetId = this.currentSnippet.id;
      this.initializeMonacoEditor(this.currentSnippet.content);
    }));
  }

  handleKeydown = (event: any) => {
    if (!this.timerStarted && event.key) {
      this.resetTimer = false;
      this.timerStarted = true;
    }

    // for future code formatting
    if (event.altKey && event.shiftKey && event.key.toLowerCase() == "f") {
      event.preventDefault();
    }

    if (event.ctrlKey && event.key.toLowerCase() == "s") {
      event.preventDefault();
      this.timerStarted = false;
      this.resetTimer = false;
    }

    if (event.ctrlKey && event.key.toLowerCase() == "v" ||
      event.ctrlKey && event.key.toLowerCase() == "c" ||
      event.ctrlKey && event.key.toLowerCase() == "z") {
      event.preventDefault();
    }
  }

  onChange = (event: any) => {
    this.currentTheme = event;
    this.initializeOptions();
  }

  constructor(private snippetService: CodeSnippetService, private sharedService: SharedService, private scoreService: ScoreService) {
    this.initializeMonacoEditor("");
    this.initializeOptions();
  }

  getTimerSeconds = (seconds: number) => {
    this.seconds = seconds;

    this.calculateWpm();
  }

  calculateWpm = () => {
    let characters = this.oldModel.code.length;
    let minutes = this.seconds / 60;

    this.wpm = (characters / 5) / minutes;
    this.wpm = Math.round(this.wpm);

    if (this.seconds > 0) {
      this.createScore();
    }
  }

  createScore = () => {
    if (GlobalConstants.guest !== GlobalConstants.user) {
      this.subs.add(this.scoreService.createScore(GlobalConstants.user.username, this.snippetId, this.wpm, 0).subscribe(data => {
        if (data !== 0)
          this.score = data;
      }));
    }

    window.alert("wpm: " + this.wpm);
  }

  ngOnInit(): void {
    this.getRandomSnippet();

    this.clickEventSubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.getRandomSnippet();
      this.resetTimer = true;
      this.timerStarted = false;
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}