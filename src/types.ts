import { Observable } from 'rxjs';

// declare namespace Types {

  export type Ord = number | string | boolean | Date;
  export type Primitive = string | number | boolean;
  export type List<T> = ArrayLike<T>;
  export type StringLike = string | StringRepresentable<string>;
  export type Prop = Primitive | StringRepresentable<Primitive>;
  export type Path = List<Prop>;
  export type Struct<T> = Obj<T> | List<T>;
  export type Pred<T> = (v: T) => boolean;

  export interface Type<T> extends Function {
    new (...args: any[]): T;
  }

  export interface Obj<T> {
    [index: string]: T;
  }

  export interface NestedObj<T> extends Obj<T|NestedObj<T>> {}
  export interface NestedArr<T> extends Array<T|NestedArr<T>> {}
  // interface NestedStruct<T> extends Struct<T|NestedStruct<T>> {}

  export interface StringRepresentable<T> {
    toString(): T;
  }

  export type ObsInfo = { obs: Observable<any>, start?: string, next?: string, done?: string };
  export type Submitter = (v: any) => ObsInfo;

  // a function mapping objects to objects using an object of transformation functions
  export type ObjectMapper = (mapping: Obj<Function>) => Function;

  export type Fn<T> = (...args: any[]) => T;

// }

// export = Types;
