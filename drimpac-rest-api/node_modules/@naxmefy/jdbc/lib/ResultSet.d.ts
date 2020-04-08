import { IResultSetMetaData, ResultSetMetaData } from './ResultSetMetaData';
export interface IResultSet {
    nextSync(): IResultSet;
    getMetaDataSync(): IResultSetMetaData;
    getBooleanSync(columnLabel: string): any;
    getBytesSync(columnLabel: string): any;
    getStringSync(columnLabel: string): any;
    getShortSync(columnLabel: string): any;
    getIntSync(columnLabel: string): any;
    getFloatSync(columnLabel: string): any;
    getDoubleSync(columnLabel: string): any;
    getBigDecimalSync(columnLabel: string): any;
    getDateSync(columnLabel: string): any;
    getTimeSync(columnLabel: string): any;
    getTimestampSync(columnLabel: string): any;
    getObjectSync(columnLabel: string): any;
}
export declare type IFetchResult = {};
export declare class ResultSet {
    private resultSet;
    constructor(resultSet: IResultSet);
    next(): IResultSet;
    getMetaData(): ResultSetMetaData;
    fetchResult(): IFetchResult;
    fetchAllResults(): IFetchResult[];
}
