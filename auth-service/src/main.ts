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
                res.status(401).end('Login failed');
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
                res.status(401).end('Refresh failed');
            })
    });

    app.get('/token/revoke', (req, res) => {
        authService.revoke(req.headers[AUTHORIZATION_HEADER])
            .then(token => {
                res.setHeader(CONTENT_TYPE, TEXT_PLAIN);
                res.status(200).send(token);
            }).catch(err => {
                console.log(err.message);
                res.status(401).end('Revoke failed');
            })
    });

    app.get('/token/revoke-all', (req, res) => {
        // TODO: revoke all tokens associated with the user provided by the Header -> Authorization: Bearer token
        res.status(500).end('To be implemented');
    });

    app.use((_, res) => {
        res.sendStatus(404);
    });

    app.listen(CONFIG.PORT, () => {
        console.log(`Server listening on http://${CONFIG.HOST}:${CONFIG.PORT}/`);
    });
});
