/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  processEvents(data);
  postMessage(data.events);
});

function processEvents(data) {
  var events = data.events
  var width = data.width - 2*data.sidePadding;
  var leftPadding = data.sidePadding;
  var collisionGroups = [];
  var collisionGroupEnd = null;

  //sort by start time 
  events = events.sort(function (e1, e2) {
    if (e1.start < e2.start) return -1;
    if (e1.start > e2.start) return 1;
    //if start is same the longer event should be dispalyed first
    if (e1.end < e2.end) return 1;
    if (e1.end > e2.end) return -1;
    return 0;
  });

  var e = events[0];

  for (let i = 0; i < events.length; i++) {
    e = events[i];
    setEventDefaultUiParams(e, i);
    if (collisionGroupEnd != null && e.start >= collisionGroupEnd) {
      // as events are sorted by time there will not be any more collision after this
      //evaluate existing collision group UI params
      setCollisionGroupUIParams(collisionGroups, width, leftPadding);
      //reseting colision params. if user can add a single event them 
      //we may persist this and during add we will evaluate only collision group where the event falls
      collisionGroups = [];
      collisionGroupEnd = null;

    }

    //in the collision group arrange it for multiple collisions 1 big event collide with 2 small event
    //all collision group events collide but on UI they should not overlap so 2D array,
    //each row is a column to be displayed in UI
    var placed = false;
    for (var j = 0; j < collisionGroups.length; j++) {
      var cg = collisionGroups[j];
      //if the two event do not overlap then they will come one bellow other ie in same column
      //as event is sorted ovelap will happen only from end start>end means the events in this column do not overlap
      //thus to utilize the empty space in left we place it bellow old event in same column
      if (e.start > cg[cg.length - 1].end) {
        cg.push(e);
        placed = true;
        break;
      }
    }
    //put it as a new column in this collision group
    if (!placed) {
      collisionGroups.push([e]);
    }

    //updated the group end so its easy to compare next event
    if (collisionGroupEnd === null || e.end > collisionGroupEnd) {
      collisionGroupEnd = e.end;
    }

  }

  if (collisionGroups.length > 0) {
    setCollisionGroupUIParams(collisionGroups, width, leftPadding);
  }
}

function setCollisionGroupUIParams(collisionGroups, width, leftPadding) {
  // console.log(collisionGroups);
  var columns = collisionGroups.length;//each row will act as a column for this collision group
  for (var i = 0; i < columns; i++) {
    var cg = collisionGroups[i];
    for (var j = 0; j < cg.length; j++) {
      var event = cg[j];
      var baseWidth = width / columns;
      event['width'] = (baseWidth * getEventExpansionFactor(event, i, collisionGroups)) + 'px';
      event['left'] = ((baseWidth * i) + leftPadding) + 'px';
    }
  }
}

function setEventDefaultUiParams(e, i) {
  if (e != undefined) {
    e['height'] = e.end - e.start + 'px';// currently for 12 hours height is 720px 1px = 1min
    e['title'] = 'Sample Item - ' + i;
    e['location'] = 'Sample Location.';
  }
}

function getEventExpansionFactor(currentEvent, cgIndex, collisionGroups) {
  var expansionFactor = 1;
  //get the current column and then check how many columns on the right are empty
  //the empty columns on right is expansion factor

  for (var i = cgIndex + 1; i < collisionGroups.length; i++) {
    var col = collisionGroups[i];
    // there is a possiblity that column on right has some event
    // the collision for this event can happen either from top or from bottom
    // if no collision then the event can expand to this column
    // if any collision found then cant expand more so break;
    for (var j = 0; j < col.length; j++) {
      var adjacentEvent = col[j];
      //evetnt can overlap from top or from bottom removing not operator by changing sign.
      if (currentEvent.start < adjacentEvent.end && currentEvent.end > adjacentEvent.start) {
        return expansionFactor;
      }
    }
    expansionFactor++;
  }
  return expansionFactor;
}

