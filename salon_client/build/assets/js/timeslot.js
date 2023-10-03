mobiscroll.setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

var formatDate = mobiscroll.util.datetime.formatDate;
var staff = [{
    id: 1,
    name: 'Ryan',
    color: '#e20000',
    title: 'Cloud System Engineer',
    img: 'https://img.mobiscroll.com/demos/m1.png'
}, {
    id: 2,
    name: 'Kate',
    color: '#60e81a',
    title: 'Help Desk Specialist',
    img: 'https://img.mobiscroll.com/demos/f1.png'
}, {
    id: 3,
    name: 'John',
    color: '#3ba7ff',
    title: 'Application Developer',
    img: 'https://img.mobiscroll.com/demos/m2.png'
}];

var shifts = [{
    start: '2023-03-02T07:00',
    end: '2023-03-02T13:00',
    title: '07:00 - 13:00',
    resource: 2,
    slot: 1
}, {
    start: '2023-03-02T07:00',
    end: '2023-03-02T13:00',
    title: '07:00 - 13:00',
    resource: 3,
    slot: 1
}, {
    start: '2023-03-02T07:00',
    end: '2023-03-02T13:00',
    title: '07:00 - 13:00',
    resource: 6,
    slot: 1
}, {
    start: '2023-03-03T07:00',
    end: '2023-03-03T13:00',
    title: '07:00 - 13:00',
    resource: 1,
    slot: 1
}, {
    start: '2023-03-03T07:00',
    end: '2023-03-03T13:00',
    title: '07:00 - 13:00',
    resource: 2,
    slot: 1
}, {
    start: '2023-03-03T12:00',
    end: '2023-03-03T18:00',
    title: '12:00 - 18:00',
    resource: 3,
    slot: 2
}, {
    start: '2023-03-04T07:00',
    end: '2023-03-04T13:00',
    title: '07:00 - 13:00',
    resource: 1,
    slot: 1
}, {
    start: '2023-03-04T07:00',
    end: '2023-03-04T13:00',
    title: '07:00 - 13:00',
    resource: 3,
    slot: 1
}, {
    start: '2023-03-04T12:00',
    end: '2023-03-04T18:00',
    title: '12:00 - 18:00',
    resource: 2,
    slot: 2
}, {
    start: '2023-03-05T12:00',
    end: '2023-03-05T18:00',
    title: '12:00 - 18:00',
    resource: 2,
    slot: 2
}, {
    start: '2023-03-06T07:00',
    end: '2023-03-06T13:00',
    title: '07:00 - 13:00',
    resource: 1,
    slot: 1
}, {
    start: '2023-03-06T12:00',
    end: '2023-03-06T18:00',
    title: '12:00 - 18:00',
    resource: 2,
    slot: 2
}, {
    start: '2023-03-06T12:00',
    end: '2023-03-06T18:00',
    title: '12:00 - 18:00',
    resource: 3,
    slot: 2
}, {
    start: '2023-03-07T07:00',
    end: '2023-03-07T13:00',
    title: '07:00 - 13:00',
    resource: 1,
    slot: 1
}, {
    start: '2023-03-07T12:00',
    end: '2023-03-07T18:00',
    title: '12:00 - 18:00',
    resource: 3,
    slot: 2
}];

mobiscroll.eventcalendar('#demo-shift-template', {
    view: {
        timeline: {
            type: 'week',
            eventList: true,
            startDay: 1,
            endDay: 5
        }
    },
    data: shifts,
    resources: staff,
    clickToCreate: true,
    dragToMove: true,
    dragToResize: false,
    colors: [{
        background: '#a5ceff4d',
        slot: 1,
        recurring: {
            repeat: 'weekly',
            weekDays: 'MO,TU,WE,TH,FR'
        }
    }, {
        background: '#f7f7bb4d',
        slot: 2,
        recurring: {
            repeat: 'weekly',
            weekDays: 'MO,TU,WE,TH,FR'
        }
    }],
    slots: [{
            id: 1,
            name: 'Morning',
        }, {
            id: 2,
            name: 'Afternoon',
        }],
    onEventUpdate: function (args, inst) {
        var event = Object.assign({}, args.event);
        event.title = event.slot === 1 ? '07:00 - 13:00' : '12:00 - 18:00';
        inst.updateEvent(event);
        return false;
    },
    renderSlot: function (args) {
        var slotId = args.slot.id;
        return '<div style="background:' + (slotId == 1 ? '#a5ceff4d' : '#f7f7bb4d') + ';padding:4px;">' +
            '<div class="slot-name">' + args.slot.name + '</div>' +
            '<div class="slot-time">' + (slotId == 1 ? '7am - 1pm' : '12pm - 6pm') + '</div>' +
            '</div>';
    },
    extendDefaultEvent: function (ev) {
        var d = ev.start;
        var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ev.slot == 1 ? 7 : 12);
        var end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ev.slot == 1 ? 13 : 18);

        return {
            title: formatDate('HH:mm', start) + ' - ' + formatDate('HH:mm', end),
            start: start,
            end: end
        };
    },
});