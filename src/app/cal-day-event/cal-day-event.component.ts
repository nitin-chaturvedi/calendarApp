import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cal-day-event',
  templateUrl: './cal-day-event.component.html',
  styleUrls: ['./cal-day-event.component.scss']
})
export class CalDayEventComponent implements OnInit {

  @Input()
  time:any;

  @Input()
  eventArray:any;

  constructor() { }

  ngOnInit(): void {
  }

}
