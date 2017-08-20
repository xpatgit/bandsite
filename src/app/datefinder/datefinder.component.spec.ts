import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatefinderComponent } from './datefinder.component';

describe('DatefinderComponent', () => {
  let component: DatefinderComponent;
  let fixture: ComponentFixture<DatefinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatefinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatefinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
