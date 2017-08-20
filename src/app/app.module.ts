import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DatefinderComponent } from './datefinder/datefinder.component';
import { GridobjAsArrayPipe } from './pipes/gridobj-as-array.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    DatefinderComponent,
    GridobjAsArrayPipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
