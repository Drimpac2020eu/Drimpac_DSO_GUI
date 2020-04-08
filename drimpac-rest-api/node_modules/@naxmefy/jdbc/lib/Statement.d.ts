import * as Promise from 'bluebird';
import { IResultSet, ResultSet } from './ResultSet';
export interface IStatement {
    executeUpdate(sql: string): number;
    executeUpdateAsync(sql: string): Promise<number>;
    executeQueryAsync(sql: string): Promise<IResultSet>;
    addBatchAsync(sql: string): void;
    addBatchSync(sql: string): void;
    clearBatchSync(): void;
    clearBatchAsync(): void;
    executeBatchAsync(): Promise<number[]>;
    executeBatchSync(): number[];
    setQueryTimeoutSync(seconds: number): void;
    closeAsync(): void;
}
export declare class Statement {
    protected statement: IStatement;
    constructor(statement: any);
    executeUpdate(sql: string): Promise<number>;
    executeUpdateSync(sql: string): number;
    executeQuery(sql: string): Promise<ResultSet>;
    addBatch(sql: string): void;
    addBatchSync(sql: string): void;
    clearBatchSync(): void;
    clearBatch(): void;
    executeBatch(): Promise<number[]>;
    executeBatchSync(): number[];
    setQueryTimeout(seconds: number): void;
    close(): void;
}
