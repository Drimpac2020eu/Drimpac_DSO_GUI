import * as Promise from 'bluebird';
import { IResultSet, ResultSet } from './ResultSet';
export interface IPreparedStatement {
    setStringSync(index: number, value: string): void;
    setIntSync(index: number, value: number): void;
    setLongSync(index: number, value: number): void;
    setTimestampSync(index: number, timestamp: string): void;
    setDateSync(index: number, date: string): void;
    executeUpdateAsync(): Promise<number>;
    executeUpdateSync(): number;
    addBatchAsync(): void;
    addBatchSync(): void;
    executeBatchAsync(): Promise<number[]>;
    executeBatchSync(): number[];
    executeQueryAsync(): Promise<IResultSet>;
    closeAsync(): void;
}
export declare class PreparedStatement {
    protected preparedStatement: IPreparedStatement;
    constructor(statement: IPreparedStatement);
    setString(index: number, value: string): void;
    setInt(index: number, value: number): void;
    setLong(index: number, value: string): void;
    setTimestamp(index: number, value: string): void;
    setDate(index: number, value: string): void;
    executeUpdate(): Promise<number>;
    executeUpdateSync(): number;
    addBatch(): void;
    addBatchSync(): void;
    executeBatch(): Promise<number[]>;
    executeBatchSync(): number[];
    executeQuery(): Promise<ResultSet>;
    close(): void;
}
