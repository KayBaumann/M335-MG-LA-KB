import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result-screen',
  templateUrl: './result-screen.page.html',
  styleUrls: ['./result-screen.page.scss'],
})
export class ResultsPage {

  result: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router   
  ) {}

  ngOnInit() {
    this.result = history.state.result;
  }

  playAgain() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
