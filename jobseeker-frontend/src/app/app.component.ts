import { Component } from '@angular/core';

export const backend = '127.0.0.1:3000'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jobseeker-frontend';
}
