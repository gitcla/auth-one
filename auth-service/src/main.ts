'use strict';

import CONFIG from './config';
import DATA from './users-data';

import express = require('express');
import bodyParser = require('body-parser');
import jwt = require('jsonwebtoken');
import mongoDb = require('mongodb');

import { AuthService } from './auth-service';

const mongoUrl = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/authone';
const mongoClient = new mongoDb.MongoClient(mongoUrl, { useNewUrlParser: true });

mongoClient.connect(err => {
    if (err) { throw err; }

    console.log('Connected successfully to Mongo server');

    const db = mongoClient.db();
    const app = express();

    app.use(bodyParser.json());
    app.set('json spaces', 2);

    const authService = new AuthService(DATA.users, db);

    app.post('/login', (req, res) => {
        authService.login(req.body.username, req.body.password).then(token => {
            res.setHeader('Content-Type', 'text/plain');

            if (token === null) {
                res.status(403).end('Could not authenticate\n');
            } else {
                res.status(200).send(token);
            }
        });
    });

    app.post('/token/validate', (req, res) => {
        const response = authService.validate(req.body.token);

        res.setHeader('Content-Type', 'application/json');

        if (response) {
            res.status(200).json(response);
        } else {
            res.status(403).send(response);
        }
    });

    app.post('/token/renew', (req, res) => {
        const renewedToken = authService.renew(req.body.token);

        res.setHeader('Content-Type', 'text/plain');

        if (renewedToken !== null) {
            res.status(200).send(renewedToken);
        } else {
            res.status(403).send('Could not renew token');
        }
    });

    // TODO: it should be moved on a separate service
    // app.get('/user/info', (req, res) => {
    //     res.setHeader('Content-Type', 'application/json');

    //     try {
    //         const authToken: any = req.headers['auth-token'];
    //         if (authToken === undefined) { throw new Error('No Auth Token provided'); }
    //         const userInfo = authService.getUserInfos(authToken);

    //         res.status(200).json(userInfo);
    //     } catch (err) {
    //         if (err.name === jwt.TokenExpiredError.name) {
    //             res.status(399).json('Token expired');
    //         } else {
    //             res.status(599).json('Could not provide user infos');
    //         }
    //     }
    // });

    app.use((req, res) => {
        res.sendStatus(404);
    });

    app.listen(CONFIG.PORT, () => {
        console.log(`server listening on http://${CONFIG.HOST}:${CONFIG.PORT}/`);
    });
});
