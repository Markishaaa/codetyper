import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { CodeSnippet } from 'src/app/api/code-snippet';
import { GlobalConstants } from 'src/app/api/global-constants';
import { Score } from 'src/app/api/score';
import { CodeSnippetService } from 'src/app/services/code-snippet.service';
import { ScoreService } from 'src/app/services/score.service';
import { SharedService } from 'src/app/services/shared.service';
import { SubSink } from 'subsink';
import Notiflix from 'notiflix';
import 'codemirror/addon/edit/closebrackets'

@Component({
  selector: 'app-type-code',
  templateUrl: './type-code.component.html',
  styleUrls: ['./type-code.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TypeCodeComponent implements OnInit, OnDestroy {

  subs = new SubSink();

  // css variables
  editorHeightVar: any;
  editorWidthVar: any;

  text: string = "";
  currentSnippet: CodeSnippet | any;
  snippetId: number = -1;

  clickEventSubscription: Subscription | any;

  @ViewChild('codeeditor1') private codeEditor: any;
  @ViewChild('codeeditor2') private codeEditor2: any;

  snippetOptions: any = {
    mode: "text/x-java",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    theme: "dracula",
    tabSize: 2,
    readOnly: true
  };

  editorOptions: any = {
    mode: "text/x-java",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    theme: "dracula",
    tabSize: 2,
    readOnly: false
  }

  timerStarted: boolean = false;
  resetTimer: boolean = false;

  score: Score | any;
  wpm: number = 0;
  seconds: number = 0;

  getRandomSnippet = () => {
    this.subs.add(this.snippetService.getRandomSnippet().subscribe(data => {
      this.currentSnippet = data;
      this.snippetId = this.currentSnippet.id;
      this.wpm = 0;
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

  constructor(private snippetService: CodeSnippetService, private sharedService: SharedService, private scoreService: ScoreService) { }

  getTimerSeconds = (seconds: number) => {
    this.seconds = seconds;

    this.calculateWpm();
  }

  calculateWpm = () => {
    // let characters = this.oldModel.code.length;
    let minutes = this.seconds / 60;

    // this.wpm = (characters / 5) / minutes;
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

    Notiflix.Notify.info("wpm: " + this.wpm);
  }

  ngOnInit(): void {
    this.getRandomSnippet();

    this.clickEventSubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.getRandomSnippet();
      this.resetTimer = true;
      this.timerStarted = false;
    });
  }

  ngAfterViewInit(): void {
    let that = this;
    
    setTimeout(function(){
      const editor = that.codeEditor.codeMirror;
      const editor2 = that.codeEditor2.codeMirror;
      const doc = editor.getDoc();
      // that.editorHeight = editor.lineCount() + "em";
      // editor2.setSize(that.editorWidthVar, that.editorHeightVar * 12)
    }, 500);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}