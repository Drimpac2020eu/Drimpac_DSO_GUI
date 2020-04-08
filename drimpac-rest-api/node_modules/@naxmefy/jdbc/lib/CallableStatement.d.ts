import { IPreparedStatement, PreparedStatement } from './PreparedStatement';
export interface ICallableStatement extends IPreparedStatement {
    registerOutParameterSync(index: number, type: string): void;
    getStringSync(index: number): string;
    getIntSync(index: number): number;
}
export declare class CallableStatement extends PreparedStatement {
    private callableStatement;
    constructor(statement: ICallableStatement);
    registerOutParameter(index: number, type: string): void;
    getString(index: number): string;
    getInt(index: number): number;
    getType(type: string): any;
}
