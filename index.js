const express = require('express');
const { EventEmitter } = require('events');
const bodyParser = require('body-parser');

const app = express();
// app.use(express.json());

const events = {};
const newEvents = new EventEmitter();

app.post('/new-event', bodyParser.urlencoded({ extended: false }), (req, res) => {
    const scope = req.query.scope;
    if (!scope) {
        res.status(400);
        return res.send();
    }

    res.status(200);
    res.send();

    if (!events[scope]) {
        events[scope] = [];
    }

    events[scope].push(req.body);
    const sended = newEvents.emit(scope);

    if(sended) {
        events[scope] = [];
    }
});

app.get('/new-events', (req, res) => {
    const scope = req.query.scope;
    if (!scope) {
        res.status(400);
        return res.send();
    }

    const sendResponse = () => res.send(events[scope]);

    if (events[scope] && events[scope].length) {
        sendResponse();
        events[scope] = [];
    } else {
        newEvents.once(scope, sendResponse);
    }
});

app.get('/healthz', (req, res) => res.send('OK'));

app.listen(process.env.PORT || 80, () => console.log(`Started!`));

