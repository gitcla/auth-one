'use strict';

import express = require('express');
import bodyParser = require('body-parser');

import CONFIG from './config';
import DATA from './users-data';
import { AuthService } from './auth-service';

const app = express();

app.use(bodyParser.json());
app.set('json spaces', 2);

const authService = new AuthService(DATA.users);

app.post('/auth/login', (req, res) => {
    const token = authService.login(req.body.username, req.body.password);

    res.setHeader('Content-Type', 'text/plain');

    if (token === null) {
        res.status(403).end('Could not authenticate\n');
    } else {
        res.status(200).send(token);
    }
});

app.post('/auth/token/validate', (req, res) => {
    const response = authService.validate(req.body.token);

    res.setHeader('Content-Type', 'application/json');

    if (response) {
        res.status(200).json(response);
    } else {
        res.status(403).send(response);
    }
});

app.post('/auth/token/renew', (req, res) => {
    const renewedToken = authService.renew(req.body.token);

    res.setHeader('Content-Type', 'text/plain');

    if (renewedToken !== null) {
        res.status(200).send(renewedToken);
    } else {
        res.status(403).send('Could not renew token');
    }
});

app.listen(CONFIG.PORT, () => {
    console.log(`server listening on http://${CONFIG.HOST}:${CONFIG.PORT}/`);
});
