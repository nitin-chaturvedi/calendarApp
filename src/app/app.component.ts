import { Component, NgZone } from '@angular/core';
import { isArray, isNumber } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'calendarApp';

  time: any;
  eventArray: any;
  webWorker: Worker;

  constructor(private zone: NgZone) {
    window['layOutDay'] = (events) => {
      zone.run(() => {
        this.layOutDay(events);
      });
    }
  }

  ngOnInit() {

    if (typeof Worker !== 'undefined') {
      this.webWorker = new Worker('./web-worker/event-processing-worker.worker', { type: 'module' })
      this.webWorker.onmessage = ({ data }) => {
        this.eventArray = data;
      }
    }

    this.initializeTime();
    this.defaultEvent();
    this.layOutDay(this.eventArray);
  }

  initializeTime() {
    this.time = [{ t: "9:00", m: "AM" }, { t: "9:30", m: "AM" }, { t: "10:00", m: "AM" }, { t: "10:30", m: "AM" }, { t: "11:00", m: "AM" }
      , { t: "11:30", m: "AM" }, { t: "12:00", m: "PM" }, { t: "12:30", m: "PM" }, { t: "1:00", m: "PM" }, { t: "1:30", m: "PM" }
      , { t: "2:00", m: "PM" }, { t: "2:30", m: "PM" }, { t: "3:00", m: "PM" }, { t: "3:30", m: "PM" }, { t: "4:00", m: "PM" }
      , { t: "4:30", m: "PM" }, { t: "5:00", m: "PM" }, { t: "5:30", m: "PM" }, { t: "6:00", m: "PM" }, { t: "6:30", m: "PM" }
      , { t: "7:00", m: "PM" }, { t: "7:30", m: "PM" }, { t: "8:00", m: "PM" }, { t: "8:30", m: "PM" }, { t: "9:00", m: "PM" }]

  }

  defaultEvent() {
    this.eventArray = [{ start: 30, end: 150 }, { start: 540, end: 600 }, { start: 560, end: 620 }, { start: 610, end: 670 }];
  }

  layOutDay(events) {
    if (this.validateEvents(events)) {
      this.webWorker.postMessage(events);
    } else {
      throw 'Error :: invalid Input';
    }
  }

  validateEvents(events) {
    if (events == undefined || !isArray(events)) {
      return false;
    }
    // 1)all objects to have start and end time 2) values should be valid and in range
    for (let i = 0; i < events.length; i++) {
      var e = events[i];
      if (
        e.start == undefined
        || e.end == undefined
        || !isNumber(e.start)
        || !isNumber(e.end)
        || e.start > e.end
      ) {
        return false;
      }
    }
    return true;
  }

}


