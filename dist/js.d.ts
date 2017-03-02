/// <reference types="node" />
import { Component, OpaqueToken } from '@angular/core';
import { ValidatorFn, FormBuilder, AbstractControl } from '@angular/forms';
import { Path, NestedArr, NestedObj, Obj, Pred, Type, ObjectMapper, Prop, StringLike, Fn } from './types';
export declare let arr2obj: <T>(fn: (s: StringLike) => T) => (arr: StringLike[]) => Obj<T>;
export declare function arr2map<T, U>(arr: Array<T>, fn: (v: T) => U): Map<T, U>;
export declare function doReturn<T>(fn: (v: T) => void): (v: T) => T;
export declare function fromQuery(str: string): Obj<string>;
export declare function toQuery(obj: {}): string;
export declare function typed<T>(from: Type<any>[], to: Type<T>, fn: Fn<T>): Fn<T>;
export declare function combine<T>(fn: Fn<T>, allow_undef?: {
    [key: string]: boolean;
}): (v: T) => void;
export declare function fallback<T>(def: T, fn: Fn<T>): Fn<T>;
export declare function tryLog<T>(fn: Fn<T>): Fn<T | undefined>;
export declare function ng2comp<TComp extends Type<any>>(o: {
    component?: Component;
    parameters?: Array<OpaqueToken | never>;
    decorators?: Obj<ClassDecorator>;
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
/**
 * map the contents of a nested yet otherwise homogeneous array (e.g. [1, [[2], 3]])
 */
export declare let mapNestedArr: <T, U>(f: (v: T, path: ArrayLike<Prop>) => U, v: NestedArr<T>, path?: Prop[]) => NestedArr<U>;
/**
 * map the contents of a nested yet otherwise homogeneous object (e.g. { a: 1, z: { y: { b: 2 }, c: 3 } })
 */
export declare let mapNestedObj: <T, U>(f: (v: T, path: ArrayLike<Prop>) => U, v: NestedObj<T>, path?: Prop[]) => NestedObj<U>;
export declare let falsy: any;
export declare let truthy: any;
export declare let lookup: any;
export declare let lookupOr: any;
export declare let callFn: <T>(fn: (...args: any[]) => T, thisArg: any, args: IArguments) => T;
