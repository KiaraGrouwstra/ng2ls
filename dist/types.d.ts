import { Observable } from 'rxjs';
declare namespace Types {
    type Ord = number | string | boolean | Date;
    type Primitive = string | number | boolean;
    type List<T> = ArrayLike<T>;
    type StringLike = string | StringRepresentable<string>;
    type Prop = Primitive | StringRepresentable<Primitive>;
    type Path = List<Prop>;
    type Struct<T> = Obj<T> | List<T>;
    type Pred<T> = (v: T) => boolean;
    interface Type<T> extends Function {
        new (...args: any[]): T;
    }
    interface Obj<T> {
        [index: string]: T;
    }
    interface NestedObj<T> extends Obj<T | NestedObj<T>> {
    }
    interface NestedArr<T> extends Array<T | NestedArr<T>> {
    }
    interface StringRepresentable<T> {
        toString(): T;
    }
    type ObsInfo = {
        obs: Observable<any>;
        start?: string;
        next?: string;
        done?: string;
    };
    type Submitter = (v: any) => ObsInfo;
    type ObjectMapper = (mapping: Obj<Function>) => Function;
    type Fn<T> = (...args: any[]) => T;
}
export = Types;
