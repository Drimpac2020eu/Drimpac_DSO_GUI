import * as Promise from 'bluebird';
import { Connection } from './Connection';
import { Statement } from './Statement';
export interface IJDBCConfig {
    className: string;
    url: string;
    username?: string;
    password?: string;
}
export declare class JDBC {
    private connection;
    private config;
    private debug;
    constructor(config: IJDBCConfig);
    getConnection(connectIfClosed?: boolean): Promise<Connection>;
    createStatement(connectIfClosed?: boolean): Promise<Statement>;
    private validateConfig;
    private classForName;
    private registerDriver;
    private newConnection;
}
