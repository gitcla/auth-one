import { User } from './user';
import { PayloadData } from './payload-data';
import { TokenDocument } from './token-document';
import PRIVATE_KEY from './private-key';
import PUBLIC_KEY from './public-key';
import jwt = require('jsonwebtoken');
import crypto = require('crypto');
import mongoDb = require('mongodb');

export class AuthService {

    private readonly _tokenExpirationTime: string = '5m';
    private readonly _db: mongoDb.Db;

    constructor(db: mongoDb.Db, tokenExpirationTime: string) {
        this._tokenExpirationTime = tokenExpirationTime;
        this._db = db;

        console.log('Token expiration time set to ' + this._tokenExpirationTime);
    }

    /**
     * Tries to authenticate and returns a new token on success.
     * 
     * @param username username provided on body request
     * @param password password provided on body request
     * @param remoteAddress IP Address of the client
     */
    async login(username: string, password: string, remoteAddress: string): Promise<string> {
        console.log(`${remoteAddress} - Login`);

        if (username === null || username === undefined) { throw new Error('Invalid username'); }
        if (password === null || password === undefined) { throw new Error('Invalid password'); }

        username = username.toLowerCase(); // username is treated lower case on database
        const encodedPassword = this.hashPassword(password);

        // Find the user on Mongo collection
        const user = await this._db.collection('users').findOne({
            username: username,
            password: encodedPassword
        });

        if (user === null) { throw new Error(`User "${username}" not found`); }

        const token = this.generateToken(user);
        const tokenDocument: TokenDocument = {
            username: username.toLowerCase(),
            token: token,
            issuedAt: new Date(),
            remoteAddress: remoteAddress
        };

        this._db.collection('tokens').insertOne(tokenDocument);

        console.log(`${remoteAddress} - Token generated for user ${username}`);

        return token;
    }

    /**
     * Refresh a previously issued token and return a new one.
     * 
     * @param authHeader Authentication header with the Bearer token.
     * @param remoteAddress IP Address of the client
     */
    async refresh(authHeader: string, remoteAddress: string): Promise<string> {
        console.log(`${remoteAddress} - Refresh`);

        const token = this.getAuthToken(authHeader);

        const decodedToken: any = jwt.verify(token, PUBLIC_KEY, { ignoreExpiration: true });
        const username = decodedToken.data.username;

        // Get the updated data of the user on Mongo collection
        const user = await this._db.collection('users').findOne({
            username: username
        });

        if (user === null) { throw new Error(`User "${username}" not found`); }

        const refreshedToken = this.generateToken(user);
        const refreshedTokenDocument = {
            username: username,
            token: refreshedToken,
            issuedAt: new Date(),
            remoteAddress: remoteAddress
        };

        // replace the old token informations on MongoDB
        const replaceResult = await this._db.collection('tokens').findOneAndReplace({
            username: username,
            token: token
        }, refreshedTokenDocument);

        if (replaceResult.value === null) { throw new Error('Old token not found, could not refresh'); }

        console.log(`${remoteAddress} - Token refreshed for user ${username}`);

        return refreshedToken;
    }

    /**
     * Revoke a previously issued token.
     * 
     * @param authHeader Authentication header with the Bearer token.
     */
    async revoke(authHeader: string, remoteAddress: string): Promise<void> {
        console.log(`${remoteAddress} - Revoke`);

        const token = this.getAuthToken(authHeader);

        const decodedToken: any = jwt.verify(token, PUBLIC_KEY, { ignoreExpiration: true });
        const username = decodedToken.data.username;

        const result = await this._db.collection('tokens').deleteOne({
            username: username,
            token: token
        });

        if (result.deletedCount === 0) { throw new Error('Token not found'); }

        console.log(`${remoteAddress} - Token revoked for user ${username}`);
    }

    /**
     * Revoke all previously issued tokens for authenticated user.
     * 
     * @param authHeader Authentication header with the Bearer token.
     */
    async revokeAll(authHeader: string, remoteAddress: string): Promise<void> {
        console.log(`${remoteAddress} - Revoke All`);

        const token = this.getAuthToken(authHeader);

        // token must not be expired!
        const decodedToken: any = jwt.verify(token, PUBLIC_KEY);
        const username = decodedToken.data.username;

        await this._db.collection('tokens').deleteMany({
            username: username
        });

        console.log(`${remoteAddress} - Revoked all tokens for user ${username}`);
    }

    private getAuthToken(authHeader: string): string {
        if (authHeader === undefined || authHeader === null) { throw new Error('No Authorization header provided'); }
        if (authHeader.startsWith('Bearer ') === false) { throw new Error('Invalid Authorization header'); }

        return authHeader.substring(7);
    };

    private generateToken(user: User): string {
        const payloadData: PayloadData = {
            username: user.username,
            fullName: user.fullName
        };

        return jwt.sign(
            { data: payloadData },
            PRIVATE_KEY,
            { algorithm: 'RS256', expiresIn: this._tokenExpirationTime }
        );
    }

    private hashPassword(plainPassword: string): string {
        const hash = crypto.createHash('sha256');
        hash.update(plainPassword);
        return hash.digest('base64');
    }
}
