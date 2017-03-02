import { Obj } from './models/models';
export declare function type<T>(label: T | ''): T;
export declare let arr2obj: <T>(fn: (k: string) => T) => any;
export declare let json: (text: string, reviver?: ((key: any, value: any) => any) | undefined) => any;
export declare let pojofy: any;
export declare let trace: any;
export declare let toQuery: (obj: Obj<any>) => string;
export declare function makeUrl(url: string, pars?: {}): string;
export declare let fromParams: (str: string) => Obj<string>;
