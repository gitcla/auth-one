'use strict';

import CONFIG from './config';
import DATA from './users-data';

import express = require('express');
import bodyParser = require('body-parser');
import mongoDb = require('mongodb');

import { AuthService } from './auth-service';

const CONTENT_TYPE = 'Content-Type';
const TEXT_PLAIN = 'text/plain';
// const APPLICATION_JSON = 'application/json';

const getRemoteIpAddress = function (req: express.Request) {
    return req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].toString() : req.connection.remoteAddress;
};

const getAuthToken = function (req: express.Request) {
    const authHeader: string = req.headers['authorization'];
    if (authHeader === undefined || authHeader === null) {
        throw new Error('No Authorization header provided');
    }
    if (authHeader.startsWith('Bearer ') === false) {
        throw new Error('Invalid Authorization header');
    }

    return authHeader.substring(7);
};

const mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/authone';
const mongoClient = new mongoDb.MongoClient(mongoUrl, { useNewUrlParser: true });

mongoClient.connect(err => {
    if (err) { throw err; }

    console.log('Successfully connected to MongoDB');

    const db = mongoClient.db();
    const app = express();

    app.use(bodyParser.json());
    app.set('json spaces', 2);

    const authService = new AuthService(db);

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

    app.post('/token/refresh', (req, res) => {
        const remoteAddress = getRemoteIpAddress(req);
        try {
            const token = getAuthToken(req);

            authService.refresh(token, remoteAddress)
                .then(token => {
                    res.setHeader(CONTENT_TYPE, TEXT_PLAIN);
                    res.status(200).send(token);
                }).catch(err => {
                    console.log(err.message);
                    res.status(401).end('Refresh failed');
                })
        } catch (err) {
            console.log(err.message);
            res.status(401).end('Invalid token');
        }
    });

    app.post('/token/revoke', (req, res) => {
        // TODO: revoke a token provided by the Header -> Authorization: Bearer token
        res.status(500).end('To be implemented');
    });

    app.post('/token/revoke-all', (req, res) => {
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
