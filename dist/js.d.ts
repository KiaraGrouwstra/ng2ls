import * as R from 'ramda';
import { ValidatorFn, FormBuilder, AbstractControl } from '@angular/forms';
import { Path, NestedArr, NestedObj, Obj, Pred, Type, ObjectMapper, Prop, StringLike, Fn } from './types';
export declare let arr2obj: <T>(fn: (s: StringLike) => T) => <T>(arr: StringLike[]) => Obj<T>;
export declare function arr2map<T, U>(arr: Array<T>, fn: (v: T) => U): Map<T, U>;
export declare function doReturn<T>(fn: (v: T) => void): (v: T) => T;
export declare function fromQuery(str: string): Object;
export declare function toQuery(obj: {}): string;
export declare function typed<T>(from: Type<any>[], to: Type<T>, fn: Fn<T>): Fn<T>;
export declare function combine<T>(fn: Fn<T>, allow_undef?: {
    [key: string]: boolean;
}): (v: T) => void;
export declare function fallback<T>(def: T, fn: Fn<T>): Fn<T>;
export declare function tryLog<T>(fn: Fn<T>): Fn<T | undefined>;
export declare function ng2comp<TComp extends Type<any>>(o: {
    component?: {};
    parameters?: Array<void>;
    decorators?: {};
    class: TComp;
}): TComp;
export declare function findIndexSet<T>(x: any, set: Set<T>): number;
export declare let editValsOriginal: ObjectMapper;
export declare let editValsBoth: ObjectMapper;
export declare let editValsLambda: ObjectMapper;
export declare function splitObj(obj: {}): [string[], any[]];
export declare let evalExpr: (context: {}, vars?: {}) => (expr: string) => any;
export declare function print(k: string, v: {}): void;
export declare function transformWhile<T>(predicate: Pred<T>, transformer: (v: T) => T, v: T): T;
export declare class ExtendableError extends Error {
    constructor(message: string);
}
export declare function extractIterables(v: any, path?: Prop[], iters?: Array<[Path, any[]]>): Array<[Path, any[]]>;
export declare function parameterizeStructure(val: any, iterableColl: Array<[Path, any[]]>): Function;
export declare let encode: (rawString: string) => string;
export declare let decode: (encodedString: string) => string;
export declare const MAX_ARRAY: number;
export declare type ValidatorStruct = ValidatorFn | {
    [k: string]: ValidatorStruct;
};
export declare function editCtrl(fb: FormBuilder, val: any, vldtr: ValidatorStruct): AbstractControl;
export declare let mapNestedBoth: <T, U>(f: (v: any, path: ArrayLike<Prop>) => U, v: T, path?: Prop[]) => any;
export declare let mapNestedArr: <T, U>(f: (v: T | NestedArr<T>, path: ArrayLike<Prop>) => U, v: T, path?: Prop[]) => NestedArr<U>;
export declare let mapNestedObject: <T, U>(f: (v: NestedObj<T>, path: ArrayLike<Prop>) => U, v: T, path?: Prop[]) => NestedObj<U>;
export declare let falsy: R.Pred<any>;
export declare let truthy: R.Variadic<boolean>;
export declare let lookup: (arg1: {}, arg0?: any) => <V, T extends Record<any, V>>(obj: T) => V;
export declare let lookupOr: R.CurriedFunction2<Object, string, <V, T extends Record<any, V>>(obj: T) => V>;
export declare let callFn: <T>(fn: Fn<T>, thisArg: any, args: IArguments) => T;
