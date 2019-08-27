const express = require('express');
const { EventEmitter } = require('events');
const bodyParser = require('body-parser');

const app = express();
// app.use(express.json());

const events = {};
const newEvents = new EventEmitter();

app.post('/new-event', (req, res) => {
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
    newEvents.emit(scope);
});

app.get('/new-events', bodyParser.urlencoded({ extended: false }), (req, res) => {
    const scope = req.query.scope;
    if (!scope) {
        res.status(400);
        return res.send();
    }

    const sendResponse = () => {
        const newEvents = events[scope] || [];
        events[scope] = [];
        return res.send(newEvents);
    };

    if (events[scope] && events[scope].length) {
        sendResponse();
    } else {
        newEvents.once(scope, sendResponse);
    }
});

app.get('/healthz', (req, res) => res.send('OK'));

app.listen(process.env.PORT || 80, () => console.log(`Started!`));

