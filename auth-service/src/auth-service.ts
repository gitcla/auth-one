import { User } from './user';
import { PayloadData } from './payload-data';
import PRIVATE_KEY from './private-key';
import PUBLIC_KEY from './public-key';
import jwt = require('jsonwebtoken');
import crypto = require('crypto');
import mongoDb = require('mongodb');

// TODO: add User-Agent field
export interface TokenDocument {
    username: string;
    token: string;
    issuedAt: Date;
    remoteAddress: string;
}

export class AuthService {

    private static readonly DEFAULT_EXPIRATION_TIME: string = '5m';

    private readonly _expirationTime: string = '5m';
    private readonly _db: mongoDb.Db;

    constructor(db: mongoDb.Db) {
        this._expirationTime = process.env.EXPIRATION_TIME ? process.env.EXPIRATION_TIME : AuthService.DEFAULT_EXPIRATION_TIME;
        console.log('Token expiration time set to ' + this._expirationTime);
        this._db = db;
    }

    async login(username: string, password: string, remoteAddress: string): Promise<string> {
        if (username === null || username === undefined) { throw new Error('Invalid username'); }
        if (password === null || password === undefined) { throw new Error('Invalid password'); }

        console.log('Login...');

        username = username.toLowerCase(); // username is treated lower case on database
        const encodedPassword = this.hashPassword(password);

        // Find the user on Mongo collection
        const user = await this._db.collection('users').findOne({
            username: username,
            password: encodedPassword
        });

        if (user === null) { throw new Error('User not found'); }

        const token = this.generateToken(user);
        const tokenDocument: TokenDocument = {
            username: username.toLowerCase(),
            token: token,
            issuedAt: new Date(),
            remoteAddress: remoteAddress
        };

        this._db.collection('tokens').insertOne(tokenDocument);

        console.log('Token generated');

        return token;
    }

    /**
     * Refresh a previously issued token.
     */
    async refresh(token: string, remoteAddress: string): Promise<string> {
        console.log('Refresh token...');

        const decodedToken: any = jwt.verify(token, PUBLIC_KEY, { ignoreExpiration: true });
        const username = decodedToken.data.username;

        // Find the updated data of the user on Mongo collection
        const user = await this._db.collection('users').findOne({
            username: username
        });

        if (user === null) { throw new Error('User not found'); }

        const refreshedToken = this.generateToken(user);
        const refreshedTokenDocument = {
            username: username,
            token: refreshedToken,
            issuedAt: new Date(),
            remoteAddress: remoteAddress
        };

        // findOneAndReplace the old token on MongoDB
        const oldDocument = await this._db.collection('tokens').findOneAndReplace({
            username: username,
            token: token
        }, refreshedTokenDocument);

        if (oldDocument.value === null) { throw new Error('Could not refresh token'); }

        console.log('Token refreshed.');

        return refreshedToken;
    }

    // validate(token: string): boolean {
    //     console.log('Validate...');

    //     try {
    //         const decodedToken = jwt.verify(token, PUBLIC_KEY);
    //         console.log('Token is valid');
    //         console.log(decodedToken);

    //         return true;
    //     } catch (err) {
    //         console.log(err.message);

    //         return false;
    //     }
    // }

    // getUserInfos(token: string): PayloadData {
    //     const decodedToken: any = jwt.verify(token, PUBLIC_KEY);
    //     return decodedToken.data;
    // }

    private generateToken(user: User): string {
        const payloadData: PayloadData = {
            username: user.username,
            fullName: user.fullName
        };

        return jwt.sign(
            { data: payloadData },
            PRIVATE_KEY,
            { algorithm: 'RS256', expiresIn: this._expirationTime }
        );
    }

    private hashPassword(plainPassword: string): string {
        const hash = crypto.createHash('sha256');
        hash.update(plainPassword);
        return hash.digest('base64');
    }
}
