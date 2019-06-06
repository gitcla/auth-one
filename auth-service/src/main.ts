'use strict';

import CONFIG from './config';

import express = require('express');
import bodyParser = require('body-parser');
import mongoDb = require('mongodb');

import { AuthService } from './auth-service';

const CONTENT_TYPE = 'Content-Type';
const TEXT_PLAIN = 'text/plain';
const X_FORWARDED_FOR = 'x-forwarded-for';
const AUTHORIZATION_HEADER = 'authorization';

const getRemoteIpAddress = function (req: express.Request) {
    return req.headers[X_FORWARDED_FOR] ? req.headers[X_FORWARDED_FOR].toString() : req.connection.remoteAddress;
};

const mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : CONFIG.MONGO_URL;
const mongoClient = new mongoDb.MongoClient(mongoUrl, { useNewUrlParser: true });

mongoClient.connect(err => {
    if (err) { throw err; }

    console.log('Successfully connected to MongoDB');

    const db = mongoClient.db();
    const app = express();

    app.use(bodyParser.json());
    app.set('json spaces', 2);

    const tokenExpirationTime = process.env.EXPIRATION_TIME ? process.env.EXPIRATION_TIME : CONFIG.TOKEN_EXPIRATION_TIME;
    const authService = new AuthService(db, tokenExpirationTime);

    app.post('/login', (req, res) => {
        const remoteAddress = getRemoteIpAddress(req);

        authService.login(req.body.username, req.body.password, remoteAddress)
            .then(token => {
                res.setHeader(CONTENT_TYPE, TEXT_PLAIN);
                res.status(200).send(token);
            }).catch(err => {
                console.log(err.message);
                res.status(401).end('login failed');
            });
    });

    app.get('/token/refresh', (req, res) => {
        const remoteAddress = getRemoteIpAddress(req);

        authService.refresh(req.headers[AUTHORIZATION_HEADER], remoteAddress)
            .then(token => {
                res.setHeader(CONTENT_TYPE, TEXT_PLAIN);
                res.status(200).send(token);
            }).catch(err => {
                console.log(err.message);
                res.status(401).end('refresh failed');
            });
    });

    app.get('/token/revoke', (req, res) => {
        const remoteAddress = getRemoteIpAddress(req);

        authService.revoke(req.headers[AUTHORIZATION_HEADER], remoteAddress)
            .then(token => {
                res.setHeader(CONTENT_TYPE, TEXT_PLAIN);
                res.status(200).send(token);
            }).catch(err => {
                console.log(err.message);
                res.status(401).end('revoke failed');
            })
    });

    app.get('/token/revoke-all', (req, res) => {
        const remoteAddress = getRemoteIpAddress(req);

        authService.revokeAll(req.headers[AUTHORIZATION_HEADER], remoteAddress)
            .then(token => {
                res.setHeader(CONTENT_TYPE, TEXT_PLAIN);
                res.status(200).send(token);
            }).catch(err => {
                console.log(err.message);
                res.status(401).end('revoke-all failed');
            });
    });

    app.get('/liveness', (_, res) => {
        db.stats()
            .then(stats => {
                console.log('Status: ' + (stats.ok === 1 ? 'Ok' : 'KO'));
                res.status(200).send('Ok');
            }).catch(err => {
                console.log(err.message);
                res.status(503).send('Service unavailable');
            });
    });

    app.use((_, res) => {
        res.sendStatus(404);
    });

    app.listen(CONFIG.PORT, () => {
        console.log(`Server listening on http://${CONFIG.HOST}:${CONFIG.PORT}/`);
    });
});
