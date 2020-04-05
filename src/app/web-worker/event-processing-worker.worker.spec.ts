import { isArray } from 'util';

describe('Test Event processing Algorithim', () => {

    beforeEach(() => {
        // jasmine.DEFAULT_TIMEOUT_INTERVAL =100000;
    });

    it('should pass 1 dataset', (done) => {

        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "600px", "left": "10px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }

        worker.postMessage({events:[{ start: 30, end: 150 }],width:620,sidePadding:10});
    });

    it('1) should pass base dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "600px", "left": "10px" },
            { "start": 540, "end": 600, "height": "60px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "300px", "left": "10px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "300px", "left": "310px" },
            { "start": 610, "end": 670, "height": "60px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "300px", "left": "10px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 600 },
        { start: 560, end: 620 }, { start: 610, end: 670 }]
        ,width:620,sidePadding:10});
    });


    it('2) should pass 1 big event 2 side event dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "600px", "left": "10px" },
            { "start": 540, "end": 700, "height": "160px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "300px", "left": "10px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "300px", "left": "310px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "300px", "left": "310px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 700 },
        { start: 560, end: 620 }, { start: 630, end: 680 }]
        ,width:620,sidePadding:10});
    });


    it('3) should pass 1 full day event 1 big event 2 side event dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 15, "end": 720, "height": "705px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "200px", "left": "10px" },
            { "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "400px", "left": "210px" },
            { "start": 540, "end": 700, "height": "160px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "200px", "left": "210px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "200px", "left": "410px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 4", "location": "Sample Location.", "width": "200px", "left": "410px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 700 },
        { start: 560, end: 620 }, { start: 630, end: 680 }, { start: 15, end: 720 }]
        ,width:620,sidePadding:10});
    });

    it('4) should pass 1 full day event 2 big event 3 side event dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 15, "end": 720, "height": "705px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "150px", "left": "10px" },
            { "start": 15, "end": 500, "height": "485px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "150px", "left": "160px" },
            { "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "300px", "left": "310px" },
            { "start": 540, "end": 700, "height": "160px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "150px", "left": "160px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 4", "location": "Sample Location.", "width": "300px", "left": "310px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 5", "location": "Sample Location.", "width": "150px", "left": "310px" }, { "start": 650, "end": 680, "height": "30px", "title": "Sample Item - 6", "location": "Sample Location.", "width": "150px", "left": "460px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 700 }, { start: 560, end: 620 }, { start: 630, end: 680 },
        { start: 15, end: 720 }, { start: 15, end: 500 }, { start: 650, end: 680 }]
        ,width:620,sidePadding:10});
    });


    it('5) should pass 1 full day event 2 big event 4 side event crop overflow dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 15, "end": 720, "height": "705px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "150px", "left": "10px" },
            { "start": 15, "end": 500, "height": "485px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "150px", "left": "160px" },
            { "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "300px", "left": "310px" },
            { "start": 540, "end": 700, "height": "160px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "150px", "left": "160px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 4", "location": "Sample Location.", "width": "150px", "left": "310px" },
            { "start": 560, "end": 575, "height": "15px", "title": "Sample Item - 5", "location": "Sample Location.", "width": "150px", "left": "460px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 6", "location": "Sample Location.", "width": "150px", "left": "310px" },
            { "start": 650, "end": 680, "height": "30px", "title": "Sample Item - 7", "location": "Sample Location.", "width": "150px", "left": "460px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 700 }, { start: 560, end: 620 },
        { start: 630, end: 680 }, { start: 15, end: 720 }, { start: 15, end: 500 },
        { start: 650, end: 680 }, { start: 560, end: 575 }]
        ,width:620,sidePadding:10});
    });


    it('6) should pass 1 full day event 2 big event 4 side event crop overflow dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 15, "end": 720, "height": "705px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "120px", "left": "10px" },
            { "start": 15, "end": 500, "height": "485px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "120px", "left": "130px" },
            { "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "360px", "left": "250px" },
            { "start": 400, "end": 600, "height": "200px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "120px", "left": "250px" },
            { "start": 540, "end": 700, "height": "160px", "title": "Sample Item - 4", "location": "Sample Location.", "width": "120px", "left": "130px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 5", "location": "Sample Location.", "width": "120px", "left": "370px" },
            { "start": 560, "end": 575, "height": "15px", "title": "Sample Item - 6", "location": "Sample Location.", "width": "120px", "left": "490px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 7", "location": "Sample Location.", "width": "120px", "left": "250px" },
            { "start": 650, "end": 680, "height": "30px", "title": "Sample Item - 8", "location": "Sample Location.", "width": "240px", "left": "370px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 700 }, { start: 560, end: 620 }, { start: 630, end: 680 }, { start: 15, end: 720 },
        { start: 15, end: 500 }, { start: 650, end: 680 }, { start: 560, end: 575 }, { start: 400, end: 600 }]
        ,width:620,sidePadding:10});
    });


    it('7) should pass 1 full day event 2 big event 4 side event crop overflow dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 15, "end": 500, "height": "485px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "150px", "left": "10px" },
            { "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "450px", "left": "160px" },
            { "start": 400, "end": 600, "height": "200px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "150px", "left": "160px" },
            { "start": 540, "end": 700, "height": "160px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "150px", "left": "10px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 4", "location": "Sample Location.", "width": "150px", "left": "310px" },
            { "start": 560, "end": 575, "height": "15px", "title": "Sample Item - 5", "location": "Sample Location.", "width": "150px", "left": "460px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 6", "location": "Sample Location.", "width": "150px", "left": "160px" },
            { "start": 650, "end": 680, "height": "30px", "title": "Sample Item - 7", "location": "Sample Location.", "width": "300px", "left": "310px" }];
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 700 }, { start: 560, end: 620 }, { start: 630, end: 680 },
        { start: 15, end: 500 }, { start: 650, end: 680 }, { start: 560, end: 575 }, { start: 400, end: 600 }]
        ,width:620,sidePadding:10});
    });


    it('8) should pass 2collision group 2 medium event 4 side event crop overflow dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 15, "end": 300, "height": "285px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "300px", "left": "10px" },
            { "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "300px", "left": "310px" },
            { "start": 400, "end": 600, "height": "200px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "150px", "left": "10px" },
            { "start": 540, "end": 700, "height": "160px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "150px", "left": "160px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 4", "location": "Sample Location.", "width": "150px", "left": "310px" },
            { "start": 560, "end": 575, "height": "15px", "title": "Sample Item - 5", "location": "Sample Location.", "width": "150px", "left": "460px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 6", "location": "Sample Location.", "width": "150px", "left": "10px" },
            { "start": 650, "end": 680, "height": "30px", "title": "Sample Item - 7", "location": "Sample Location.", "width": "300px", "left": "310px" }];
            // console.log(JSON.stringify(result.data));
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 700 }, { start: 560, end: 620 }, { start: 630, end: 680 },
        { start: 15, end: 300 }, { start: 650, end: 680 }, { start: 560, end: 575 }, { start: 400, end: 600 }]
        ,width:620,sidePadding:10});
    });


    it('9) should pass 3collision group 2 medium event 4 side event crop overflow dataset', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{ "start": 15, "end": 300, "height": "285px", "title": "Sample Item - 0", "location": "Sample Location.", "width": "300px", "left": "10px" },
            { "start": 30, "end": 150, "height": "120px", "title": "Sample Item - 1", "location": "Sample Location.", "width": "300px", "left": "310px" },
            { "start": 400, "end": 600, "height": "200px", "title": "Sample Item - 2", "location": "Sample Location.", "width": "120px", "left": "10px" },
            { "start": 400, "end": 600, "height": "200px", "title": "Sample Item - 3", "location": "Sample Location.", "width": "120px", "left": "130px" },
            { "start": 400, "end": 550, "height": "150px", "title": "Sample Item - 4", "location": "Sample Location.", "width": "120px", "left": "250px" },
            { "start": 540, "end": 620, "height": "80px", "title": "Sample Item - 5", "location": "Sample Location.", "width": "120px", "left": "370px" },
            { "start": 560, "end": 620, "height": "60px", "title": "Sample Item - 6", "location": "Sample Location.", "width": "120px", "left": "250px" },
            { "start": 560, "end": 575, "height": "15px", "title": "Sample Item - 7", "location": "Sample Location.", "width": "120px", "left": "490px" },
            { "start": 630, "end": 680, "height": "50px", "title": "Sample Item - 8", "location": "Sample Location.", "width": "300px", "left": "10px" },
            { "start": 650, "end": 680, "height": "30px", "title": "Sample Item - 9", "location": "Sample Location.", "width": "300px", "left": "310px" }];
            // console.log(JSON.stringify(result.data));
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 150 }, { start: 540, end: 620 }, { start: 560, end: 620 }, { start: 630, end: 680 },
        { start: 15, end: 300 }, { start: 650, end: 680 }, { start: 560, end: 575 }, { start: 400, end: 600 }, { start: 400, end: 600 }, { start: 400, end: 550 }]
        ,width:620,sidePadding:10});
    });

    
    it('10) should pass multiple same width dataset with smaller size dataset passed as random events', (done) => {
        var worker = new Worker('./event-processing-worker.worker', { type: 'module' })
        worker.onmessage = function (result) {
            var expected = [{"start":30,"end":300,"height":"270px","title":"Sample Item - 0","location":"Sample Location.","width":"120px","left":"10px"},
            {"start":30,"end":300,"height":"270px","title":"Sample Item - 1","location":"Sample Location.","width":"120px","left":"130px"},
            {"start":30,"end":270,"height":"240px","title":"Sample Item - 2","location":"Sample Location.","width":"120px","left":"250px"},
            {"start":30,"end":150,"height":"120px","title":"Sample Item - 3","location":"Sample Location.","width":"120px","left":"370px"},
            {"start":30,"end":150,"height":"120px","title":"Sample Item - 4","location":"Sample Location.","width":"120px","left":"490px"},
            {"start":170,"end":300,"height":"130px","title":"Sample Item - 5","location":"Sample Location.","width":"240px","left":"370px"}];
            // console.log(JSON.stringify(result.data));
            expect(compareEventsArray(result.data, expected)).toBeTrue();
            done();
        }
        worker.postMessage({events:[{ start: 30, end: 300 },{ start: 30, end: 150 },{ start: 30, end: 150 },{ start: 30, end: 300 },{ start: 170, end: 300 },{ start: 30, end: 270 }]
        ,width:620,sidePadding:10});
    });
});

function compareEventsArray(actual, expected) {
    var isEqual = true;
    if (actual == null || !isArray(actual) || actual.length != expected.length) {
        return false;
    }

    expected.forEach(
        (event, index) => {
            if (event.left != actual[index]['left']
                || event.width != actual[index]['width']
                || event.height != actual[index]['height']
            ) {
                console.log('Error at Index ' + index, actual[index]);
                isEqual = false;
            }
        }
    );

    return isEqual;
}

/**
 * All layDayOut functions for above set
 *
 * //no1

layOutDay([{ start: 30, end: 150 }, { start: 540, end: 600 },{ start: 560, end: 620 }, { start: 610, end: 670 }]);

//no2
layOutDay([{ start: 30, end: 150 }, { start: 540, end: 700 },
            { start: 560, end: 620 }, { start: 630, end: 680 }]);

//no3
layOutDay([{ start: 30, end: 150 }, { start: 540, end: 700 },
            { start: 560, end: 620 }, { start: 630, end: 680 },{start:15,end:720}]);

//no4
layOutDay([{ start: 30, end: 150 }, { start: 540, end: 700 },{ start: 560, end: 620 }, { start: 630, end: 680 },
            {start:15,end:720},{start:15,end:500},{ start: 650, end: 680 }]);

//no5
layOutDay([{ start: 30, end: 150 }, { start: 540, end: 700 },{ start: 560, end: 620 },
             { start: 630, end: 680 },{start:15,end:720},{start:15,end:500},
            { start: 650, end: 680 },{ start: 560, end: 575 }]);

//no6
layOutDay([{ start: 30, end: 150 }, { start: 540, end: 700 },{ start: 560, end: 620 }, { start: 630, end: 680 },{start:15,end:720},
            {start:15,end:500},{ start: 650, end: 680 },{ start: 560, end: 575 },{ start: 400, end: 600 }]);

//no7
layOutDay([{ start: 30, end: 150 }, { start: 540, end: 700 },{ start: 560, end: 620 }, { start: 630, end: 680 },
            {start:15,end:500},{ start: 650, end: 680 },{ start: 560, end: 575 },{ start: 400, end: 600 }]);

//no8
layOutDay([{ start: 30, end: 150 }, { start: 540, end: 700 },{ start: 560, end: 620 }, { start: 630, end: 680 },
            {start:15,end:300},{ start: 650, end: 680 },{ start: 560, end: 575 },{ start: 400, end: 600 }]);

//no9

//no10
layOutDay([{ start: 30, end: 300 },{ start: 30, end: 150 },{ start: 30, end: 150 },{ start: 30, end: 300 },{ start: 170, end: 300 },{ start: 30, end: 270 }]);
 */