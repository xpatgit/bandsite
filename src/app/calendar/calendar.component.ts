import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  days=[];

  constructor() { }

  ngOnInit() {
    for (let i=1; i<=31; i++) {
      this.days.push(i);
    }
  }

}
