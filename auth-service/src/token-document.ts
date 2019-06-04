// TODO: add User-Agent field
export interface TokenDocument {
    username: string;
    token: string;
    issuedAt: Date;
    remoteAddress: string;
}
