import {Component, OnInit} from '@angular/core';
import {GridDay} from "../grid-day";

@Component({
  selector: 'app-datefinder',
  templateUrl: './datefinder.component.html',
  styleUrls: ['./datefinder.component.css']
})

export class DatefinderComponent implements OnInit {

  targetMonth: Date;
  // todo: rename newgd
  newgd: object = {};   // will <dateid>:<GridDay> e.g. {123: GridDay1, 234: GridDay2} where the dateid is the field/key name
  weekdaysSelected = {};    // will hold col class names (eg. tue etc.) where those whole weekday cols have been selected.
  weeksSelected = {};    // will hold row class names (eg. wk2 etc.) where those whole weeknum rows have been selected.
  numGridDays = 0;

  // storage for unavailable days
  unavailable = {};

  constructor() {
  }

  ngOnInit() {
    this.targetMonth = new Date();   // defaults to today
    // this.targetMonth.setHours(0, 0, 0, 0);  // midnight
    // this.targetMonth.setDate(1);  // first of month
    console.log(this.targetMonth);  // todo: remove
    this.createGridDays(this.targetMonth);
  }

  // handles the month change back, forth and to Today's month
  changeTargetMonth(direction: number, event) {

    // clear the selected classes... will be reinstated from saved dates later
    this.clearSelected();

    // direction should be -1 (previous month) or 1 (next month). 0 will go to current month.
    if (direction === 0) {
      this.targetMonth = new Date();
    } else {
      // todo: should only work for months from current onwards
      this.targetMonth.setMonth(this.targetMonth.getMonth() + direction);
      this.targetMonth.setHours(2);   // todo: this is a hack to get round GMT/BST hour changes!
    }
    this.createGridDays(this.targetMonth);
  }

  // removes 'selected' class from all elements in the calendar
  clearSelected() {
    for (const key in this.newgd) {
      this.newgd[key].selState = '';
    }
  }

  // draws the calendar grid
  createGridDays(monthDate: Date) {

    // reset newGD
    this.newgd = {};
    this.weekdaysSelected = {};
    this.weeksSelected = {};

    // calendar will be centred on target month, but showing days before and
    // after depending on weekdays

    // set monthDate to 1st of month   todo: must be a better way of stripping time from date?
    monthDate.setDate(1);
    monthDate = this.stripTime(monthDate);
    console.log(monthDate);   // todo: remove

    // based on day of week, get days before and after target month to fill grid
    let gridFirstDate = new Date(monthDate), gridLastDate = new Date(monthDate);
    while (gridFirstDate.getDay() !== 1) {
      gridFirstDate.setDate(gridFirstDate.getDate() - 1);
    }

    // get the last day of target month, then advance until the first Sunday
    gridLastDate.setMonth(gridLastDate.getMonth() + 1);
    gridLastDate.setDate(gridLastDate.getDate() - 1);
    while (gridLastDate.getDay() !== 0) {
      gridLastDate.setDate(gridLastDate.getDate() + 1)
    }

    let d = new Date(gridFirstDate);
    let today = this.stripTime(new Date()), todayClass: string, weekClass: string;

    // use counters to determine which week row a day is in - 7 days in a week!
    let dayCount: number = 0, weekCount: number = 1;

    while (d.valueOf() <= gridLastDate.valueOf()) {
      todayClass = d.valueOf() === today.valueOf() ? 'today' : '';

      // work out which week row this day is in
      dayCount++;
      if (dayCount > 7) {
        weekCount++;
        dayCount = 1;
      }
      weekClass = 'wk' + weekCount.toString();

      const gd: GridDay = {
        day: d.getDate(),
        jmonth: d.getMonth(),
        year: d.getFullYear(),
        weekday: this.getDayOfWeek(d),
        today: todayClass,
        weeknum: weekClass,
        dateid: d.valueOf(),
        selState: '',
        pastState: d.valueOf() < this.stripTime(new Date()).valueOf() ? 'past' : ''
      };

      // check if in 'unavailable' array
      if (this.unavailable[gd.dateid]) {
        gd.selState = 'selected';
      }

      // add to the array
      this.newgd[d.valueOf()] = gd;

      this.numGridDays = Object.keys(this.newgd).length;

      // increment to next day
      d.setDate(d.getDate() + 1);
    }

    // reset the target month
    this.targetMonth = monthDate;

  }

  // handles the clicking of days, weekdays, weeks
  calClick(event){
    const target = event.target;

    switch (target.parentElement.id) {
      case 'calendar':
        if (this.newgd[target.id].selState !== 'selected' && this.newgd[target.id].pastState !== 'past') {
          this.newgd[target.id].selState = 'selected';
          this.unavailable[target.id] = true;
        } else {
          this.newgd[target.id].selState = '';
          delete this.unavailable[target.id];
        }
        break;

      case 'coltitle':
        const day: string = target.id;
        // toggle the weekday's existence in the weekdaysSelected array
        if (this.weekdaysSelected[day]) {
          delete this.weekdaysSelected[day];
        } else {
          this.weekdaysSelected[day] = 'selected';
        }
        // now reflect this in those weekdays in newgd: key is the dateid
        for (const key in this.newgd) {
          if (this.newgd[key].weekday === day && this.newgd[key].pastState !== 'past') {
            this.newgd[key].selState = this.weekdaysSelected[day];

              // also update the 'unavailable' list
              if (this.weekdaysSelected[day]) {
                this.unavailable[key] = true;
              } else {
                delete this.unavailable[key]
              }
          }
        }
        break;

      case 'rowtitle':
        const week: string = target.id;
        // toggle the weeknum's existence in the weeksSelected array
        if (this.weeksSelected[week]) {
          delete this.weeksSelected[week];
        } else {
          this.weeksSelected[week] = 'selected';
        }
        // now reflect this in those weeks in newgd: key is the dateid
        for (const key in this.newgd) {
          if (this.newgd[key].weeknum === week && this.newgd[key].pastState !== 'past') {
            this.newgd[key].selState = this.weeksSelected[week];

            // also update the 'unavailable' list
            if (this.weeksSelected[week]) {
              this.unavailable[key] = true;
            } else {
              delete this.unavailable[key]
            }
          }
        }
        break;

      default:
        break;
    }
    console.log(this.unavailable);
  }


  getDayOfWeek(date: Date) {
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayOfWeek];
  }

  // returns a date with time stripped using ISO format   todo: must be a better way of doing this - creates problems with seasonal spring/fall changes
  stripTime(date: Date) {
    const strDate = date.toISOString().slice(0,10);
    return new Date(strDate);
  }
}


