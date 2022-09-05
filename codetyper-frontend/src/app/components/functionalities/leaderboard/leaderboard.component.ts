import { Component, OnInit, Input } from '@angular/core';
import { Score } from 'src/app/api/score';
import { ScoreService } from 'src/app/services/score.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  subs = new SubSink();

  @Input() snippetId: number = 0;
  scores: Score[] = new Array;

  visibility: string = "hidden";
  toggleShow: string = "show leaderboard";
  toggleVisibility: boolean = false;

  constructor(private scoreService: ScoreService) { }

  showLeaderboard = () => {
    this.toggleVisibility = !this.toggleVisibility;

    if (this.toggleVisibility) {
      this.subs.add(this.scoreService.getBySnippet(this.snippetId).subscribe(data => {
        this.scores = data;
        this.scores = this.scores.sort((n1, n2) => n2.wpm - n1.wpm);
      }));
      this.visibility = "visible";
      this.toggleShow = "hide leaderboard";
    } else {
      this.visibility = "hidden";
      this.toggleShow = "show leaderboard";
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
