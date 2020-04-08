import * as Promise from 'bluebird';
import { IStatement, Statement } from './Statement';
import { IPreparedStatement, PreparedStatement } from './PreparedStatement';
import { CallableStatement, ICallableStatement } from './CallableStatement';
export interface IConnection {
    setAutoCommitSync(autoCommit: boolean): void;
    createStatementAsync(): Promise<IStatement>;
    prepareStatementAsync(sql: string): Promise<IPreparedStatement>;
    prepareCallAsync(call: string): Promise<ICallableStatement>;
    commitAsync(): void;
    rollbackAsync(): void;
    closeAsync(): void;
    isClosedSync(): boolean;
    isValidSync(timeout: number): void;
}
export declare class Connection {
    private connection;
    constructor(connection: IConnection);
    setAutoCommit(autoCommit: boolean): void;
    createStatement(): Promise<Statement>;
    prepareStatement(sql: string): Promise<PreparedStatement>;
    prepareCall(call: string): Promise<CallableStatement>;
    commit(): void;
    rollback(): void;
    close(): void;
    isClosed(): boolean;
    isValid(timeout: number): void;
}
