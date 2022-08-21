import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CodeSnippet } from 'src/app/api/code-snippet';
import { GlobalConstants } from 'src/app/api/global-constants';
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
  }

}
