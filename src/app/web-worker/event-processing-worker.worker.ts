/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  processEvents(data);
  postMessage(data);
});

function processEvents(events) {
  //TODO :: sort by start time if not done by DB

  //if current start time is found between previous one then overlap
  //check the over lap value and add 1

  var width = 600;
  if (events != undefined && events.length != 0) {
    var e = events[0];
    setEventDefaultUiParams(e,1);
    for (let i = 1; i < events.length; i++) {
      e = events[i];
      setEventDefaultUiParams(e,i+1);
      // if all are in ascending time then we dont need to check for each element an optimization
      // for (let j = i; j > 0; j--) { 
      var pe = events[i - 1];
      if (e.start < pe.end) {
        if (pe['collision'] == undefined) {
          // this is first collision
          pe['width'] = width / 2 + 'px';
          e['width'] = width / 2 + 'px';
          //keep the start and end of collision so that next event can check 
          // some event can be full day or longer than current so pe end time
          e['collision'] = {
            count: 1,
            start: e.start,
            end: pe.end,
            peRef: [pe]
          }
          //set e left position
          e['left'] = 10 + width / 2 + 'px';//for multiple collision normalization in else block;
        } else if (e.start < pe.collision.end) {
          //previous event already had collision we have multiple collisions
          e['width'] = width / (pe['collision']['count'] + 2) + 'px';
          e['collision'] = {
            count: 1,
            start: e.start,
            end: pe.end,
            peRef: [pe]
          }
          //what has to be left?
          //set e left position
          //possible staircase formation need to check position
          e['left'] = 10 + (width - width / (pe['collision']['count'] + 2)) + 'px';
          //reset width of all previous events collision
          resetWidth(e, e['width']);
          //reset left margin of all previous collisions

        }
        else {
          e['width'] = width / 2 + 'px';
          e['collision'] = {
            count: 1,
            start: e.start,
            end: pe.end,
            peRef: [pe]
          }
        }
      } else if (pe['collision'] != undefined && e.start < pe.collision.end) {
        //previous event already had collision we dont collide with immediate neighbour but some other long event
        e['width'] = width / 2 + 'px';
        e['collision'] = {
          count: 1,
          start: e.start,
          end: pe.end,
          peRef: [pe]
        }
        //set e left position
        e['left'] = 10 + width / 2 + 'px';
        //reset width of all previous events collision
        resetWidth(e, e['width']);
        //reset left margin of all previous collisions

      }
    }
  }
  this.eventArray = events;//set the modified input event to the component variable for rendering
}

function setEventDefaultUiParams(e,i) {
  var width = 600;
  if (e != undefined) {
    e['height'] = e.end - e.start + 'px';// currently for 12 hours height is 720px 1px = 1min
    e['width'] = width + 'px'; //due to position absolute the 100% goes out of the div so calculating absolute value.
    e['left'] = 10 + 'px';//due to position absolute adding the padding value
    e['title'] = 'Sample Item - '+i;
    e['location'] = 'Sample Location.';

  }
}

function resetWidth(event, width) {
  if (event['collision'] != undefined && event['collision']['peRef'] != undefined) {
    event['collision']['peRef'][0]['width'] = width;
    resetWidth(event['collision']['peRef'][0], width);
  }
}
