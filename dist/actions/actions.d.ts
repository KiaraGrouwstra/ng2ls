import * as R from 'ramda';
import { Type, Obj, Action } from '../models/models';
export interface MyAction<T> {
    type: string;
    payload: T;
}
export interface ActionCtor<T> {
    new (payload: T): MyAction<T>;
}
export declare type ActionClass = Type<Action>;
export declare type ActionInfo = {
    actions: Obj<ActionClass>;
    types: Obj<string>;
};
export declare type ActionPair<T> = {
    type: string;
    action: ActionCtor<T>;
};
export declare let toPayload: <T>(action: MyAction<T>) => T;
export declare let actionTp: R.CurriedFunction2<string, string, string>;
export declare function makeAction<T>(typeName: string, actionName: string): ActionCtor<T>;
export declare let make: {
    actions: (name: string, actions: string[]) => Obj<Type<Action>>;
    types: (name: string, actions: string[]) => Obj<string>;
};
export declare let actionFactory: (name: string, actions: string[]) => ActionInfo;
export declare function effectfulAction(types: string[]): string[];
export declare let mapSyncActions: (actionGroups: Obj<string[]>) => Obj<ActionInfo>;
export declare let mapAsyncActions: (actionGroups: Obj<string[]>) => Obj<ActionInfo>;
export declare let makeBoth: (name: string) => <T>(action: string) => ActionPair<T>;
export declare let pairFactory: (name: string, actions: string[]) => ActionPair<any>[];
export declare let pairObjFactory: (name: string, actions: string[]) => ActionPair<any>[];
