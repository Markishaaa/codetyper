import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
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
    }));
  }

  constructor(private snippetService: CodeSnippetService, private sharedService: SharedService, @Inject(DOCUMENT) private document: Document, private elementRef: ElementRef, private renderer: Renderer2) {
    this.initializeMonacoEditor("");
  }

  timerStarted: boolean = false;
  resetTimer: boolean = false; 

  ngOnInit(): void {
    this.getRandomSnippet();

    this.clickEventSubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.getRandomSnippet();
      this.resetTimer = true;
      this.timerStarted = false;
    });

    this.handleKeydown = (event: any) => {
      if (!this.timerStarted && event.key) {
        this.timerStarted = true;
      }

      if (event.key == monaco.KeyCode.Alt && event.key == monaco.KeyCode.Shift && event.key == monaco.KeyCode.KeyF) {
        console.log("here")
      }
      
      // for future formatting code
      if (event.altKey && event.shiftKey && event.key.toLowerCase() == "f") {
        event.preventDefault();
      }

      if (event.ctrlKey && event.key.toLowerCase() == "s") {
        event.preventDefault();
        // this.stopTimer();
      }

      if (event.ctrlKey && event.key.toLowerCase() == "v" ||
        event.ctrlKey && event.key.toLowerCase() == "c" ||
        event.ctrlKey && event.key.toLowerCase() == "z") {
        event.preventDefault();
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}