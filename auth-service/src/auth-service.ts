import { User } from './user';
import { PayloadData } from './payload-data';
import PRIVATE_KEY from './private-key';
import PUBLIC_KEY from './public-key';
import jwt = require('jsonwebtoken');
import crypto = require('crypto');

export class AuthService {

    private static readonly DEFAULT_EXPIRATION_TIME: string = '5m';

    private readonly _expirationTime: string = '5m';
    private readonly _users: User[];

    constructor(users: any) {
        this._expirationTime = process.env.EXPIRATION_TIME ? process.env.EXPIRATION_TIME : AuthService.DEFAULT_EXPIRATION_TIME;
        console.log("Token expiration time set to " + this._expirationTime);
        this._users = users;
    }

    login(username: string, password: string): string | null {
        console.log('Login...');

        try {
            const encodedPassword = this.hashPassword(password);

            // TODO: use an indexed repository
            const user = this._users.find(u => u.username === username && u.password === encodedPassword);

            if (user === undefined) { throw new Error('Could not authenticate'); }

            const token = this.generateToken(user);
            user.issuedTokens.unshift(token); // TODO: use a buffer of no more than XX elements

            console.log('Token generated');

            return token;
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }

    validate(token: string): boolean {
        console.log('Validate...');

        try {
            const decodedToken = jwt.verify(token, PUBLIC_KEY);
            console.log('Token is valid');
            console.log(decodedToken);

            return true;
        } catch (err) {
            console.log(err.message);

            return false;
        }
    }

    renew(token: string): string {
        console.log('Renew...');

        try {
            const decodedToken: any = jwt.verify(token, PUBLIC_KEY, { ignoreExpiration: true });
            const user = this._users.find(u => u.username === decodedToken.data.username);

            if (user === undefined) { throw new Error('User not found'); }

            // TODO: must be improved, using indexes is not safe!
            const indexOfToken = user.issuedTokens.indexOf(token);
            if (indexOfToken === -1) { throw new Error('Issued token not found'); }

            const renewedToken = this.generateToken(user);
            user.issuedTokens[indexOfToken] = renewedToken;

            console.log('Token renewed');

            return renewedToken;
        } catch (err) {
            console.log(err.message);

            return null;
        }
    }

    // TODO: should be moved on a separate service
    getUserInfos(token: string): PayloadData {
        const decodedToken: any = jwt.verify(token, PUBLIC_KEY);
        return decodedToken.data;
    }

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
