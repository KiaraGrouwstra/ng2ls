import * as R from 'ramda';
import { OpaqueToken, ValueProvider } from '@angular/core';
import { arr2obj, type } from '../js';
import { Type, Obj, Action } from '../models/models';

export interface MyAction<T> {
  type: string;
  payload: T;
};
// export type ActionCtor<T> = Type<MyAction<T>>
export interface ActionCtor<T> {
  new(payload: T): MyAction<T>;
}
export type ActionClass = Type<Action>; // TODO: swap this out for MyAction<T> if I can get the type info -- requires heterogeneous map()
export type ActionInfo = { actions: Obj<ActionClass>, types: Obj<string> };
export type ActionPair<T> = { type: string, action: ActionCtor<T> };
export let toPayload = <T>(action: MyAction<T>): T => action.payload;

// create an action type string
export let actionTp = R.curry((typeName: string, action: string): string => `[${typeName}] ${action}`); // type()
// create the Complete string for an action
let derivedAction: Obj<(action: string) => string> = R.map((tp: string) =>
  (action: string) => `${action}_${tp}`
)({
  complete: 'Complete',
  fail: 'Failed', // wait, should these get a different payload type?
});

// create an action class
export function makeAction<T>(typeName: string, actionName: string): ActionCtor<T> {
  let tn = actionTp(typeName, actionName);
  return class implements Action {
    type = tn;
    constructor(public payload: T) {}
  };
}


export let make = {
  actions: (name: string, actions: string[]) => <Obj<Type<Action>>>arr2obj(<T>(action: string) => makeAction<T>(name, action))(actions),
  // ^ where to get this T?: http://orizens.com/wp/topics/simple-action-creators-for-ngrxstore-in-angular-2/
  // types: (name: string, actions: string[]): Obj<string> => R.fromPairs(actions.map((act: string): [string, string] => [act.toUpperCase(), actionTp(name, act)])),
};
// create actions for given types and a name
export let actionFactory = (name: string, actions: string[]) => <ActionInfo>R.map((fn: (name: string, actions: string[]) => any) => fn(name, actions))(make);

// create actions for given types and a name
export function effectfulAction(types: string[]): string[] {
  let reducer = (arr: string[], fn: (action: string) => string) => arr.concat(types.map(fn, types));
  return R.values(derivedAction).reduce(reducer, []);
}
// create actions in batch
export let mapSyncActions: (actionGroups: Obj<string[]>) => Obj<ActionInfo> =
    R.mapObjIndexed(R.flip(actionFactory));
export let mapAsyncActions: (actionGroups: Obj<string[]>) => Obj<ActionInfo> =
    R.mapObjIndexed((v: string[], k: string): ActionInfo => R.pipe(effectfulAction, R.curry(actionFactory)(k))(v));

// attempt to flip the structure to put actions and their types together

// make an action pair (type string / Action ctor)
// export let makeBoth = R.curry(<T>(name: string, action: string): ActionPair<T> => ({
export let makeBoth = (name: string) => <T>(action: string): ActionPair<T> => ({
  type: actionTp(name, action),
  action: makeAction<T>(name, action),
});
// make pairs in batch. missing types!
export let pairFactory = (name: string, actions: string[]): ActionPair<any>[] => actions.map(a => makeBoth(name)<any>(a));
export let pairObjFactory = (name: string, actions: string[]) => <ActionPair<any>[]>arr2obj((a: string) => makeBoth(name)<any>(a))(actions);

/*
let baseline = class { type = 'shoe'; constructor(public payload: string) {} };
let improved = makeAction<string>('shoe', 'make');

// attempt to preserve typing through data structures:

export interface Tp<T> {
  tp: T;
}
let c = <T>(): Type<Tp<T>> => class implements Tp<T> {
  tp: T;
  toString() { return this.tp.toString(); };
}
let tpCls = c<string>();
// v like makeAction<T> with type moved to param for gen by het map
let makeTypedAction = <T>(typeName: string, actionName: string, cls: Type<Tp<T>>): ActionCtor<T> => makeAction<T>(typeName, actionName);
// usage: let typedAction = makeTypedAction('shoe', 'make', c<string>());

// INFO LOSS: <any>?, ActionInfo with ActionClass rather than heterogeneous object of MyAction<T>
// create actions for given types and a name
export let typedActionFactory = (name: string, actions: Obj<Type<Tp<any>>>): ActionInfo => ({
  actions: R.mapObjIndexed((cls: Type<Tp<any>>, action: string) => makeTypedAction(name, action, cls))(actions),
  types: R.fromPairs(R.keys(actions).map((act: string): [string, string] => [act.toUpperCase(), actionTp(name, act)])),
});
// typedActionFactory('shoe', { make: c<string>() });

// INFO LOSS: no way TS can follow key mutations
export let mapKeys = R.curry((fn: (str: string) => string, obj: Object) => R.zipObj(R.map(fn, R.keys(obj)), R.values(obj)));
// create actions for given types and a name
// INFO LOSS: reduce, mapKeys, probably merge
export function typedEffectfulAction(types: Obj<Type<Tp<any>>>): Obj<Type<Tp<any>>> {
  let reducer = (obj: Obj<Type<Tp<any>>>, fn: (action: string) => string) => R.merge(mapKeys(fn)(obj))(obj);
  return R.values(derivedAction).reduce(reducer, types);
}

// create actions in batch
// INFO LOSS: heterogeneous map
export let mapTypedSyncActions: (actionGroups: Obj<Obj<Type<Tp<any>>>>) => Obj<ActionInfo> =
    R.mapObjIndexed(R.flip(typedActionFactory));
export let mapTypedAsyncActions: (actionGroups: Obj<Obj<Type<Tp<any>>>>) => Obj<ActionInfo> =
    R.mapObjIndexed((v: Obj<Type<Tp<any>>>, k: string): ActionInfo => R.pipe(typedEffectfulAction, R.curry(typedActionFactory)(k))(v));
*/
