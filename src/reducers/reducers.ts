import * as R from 'ramda';
import { Action, ActionReducer } from '@ngrx/store';
import { trace } from '../util';
import { Obj } from '../models/models';
import { ActionPair, MyAction } from '../actions/actions';

export type TypedReducer<TState, T> = (state: TState, action: MyAction<T>) => TState;
export type PayloadReducer<TState, T> = (state: TState, payload: T) => TState;
export type ReducerMap<TState> = Obj<PayloadReducer<TState, any>>;
export type ReducerTuple<TState, T> = [ActionPair<T>, PayloadReducer<TState, T>];
export type State = any;
export type PointFree = <T>(state: T) => T;

// pick the right reducer by action type, or default to the current state
export let reducerFn = <TState>(types: ReducerMap<TState>, initialState: TState): ActionReducer<TState> =>
  <T>(state: TState = initialState, action: MyAction<T>): TState => R.pipe(
    R.pathOr(() => trace('reducer defaulted', state), [action.type]),
    (f: PayloadReducer<TState, T>) => f(state, action.payload), // why was this failing to pass payload?
 )(types);

export function reducerFnTuple<TState>(types: ReducerTuple<TState, any>[], initialState: TState): ActionReducer<TState> {
  let obj = R.map(<T>([{ type, action }, reducerFn]: [ActionPair<T>, PayloadReducer<TState, T>]) =>
      [type, (state: TState, act: MyAction<T>) => reducerFn(state, act.payload)]
  )(types);
  return reducerFn(obj, initialState);
}

export type ReducerStructMap = {
  fixed?: Obj<any>, // (_state, _pl)
  set?: Obj<(payload?: any) => State>, // (_state, pl)
  update?: Obj<PointFree>, // (state, _pl), point-free!
  edit?: { [k: string]: <T>(payload?: T) => PointFree }, // (state, pl), point-free!
  misc?: { [k: string]: <T>(state?: T, payload?: any) => T }, // (state, pl), not point-free, for backward compatibility
};

// make a reducer with some optimizations based on what reducer parameters are actually used
export let reducerStructFn = <T>(struct: ReducerStructMap, initialState: Obj<State>) => {
  let { fixed, set, update, edit, misc } = struct;
  let reducer = R.mergeAll([
    R.map((v: any) => (state: State, payload: any) => v)(fixed),
    R.map((fn: (payload: any) => State) => (state: State, payload: any) => fn(payload))(set),
    R.map((fn: PointFree) => (state: State, payload: any) => fn(state))(update),
    R.map((fn: (payload: any) => PointFree) => (state: State, payload: any) => fn(payload)(state))(update),
    misc,
  ]);
  return reducerFn(reducer, initialState);
}

let mapper = (fn: <T>(types: ReducerMap<T>, initialState: T) => ActionReducer<T>) =>
    R.mapObjIndexed(<TState extends State>([types, initialState]: [ReducerMap<TState>, TState]) => fn(types, initialState));
// : Function
// map [ReducerMap, State] tuples to `(State, Action) ~> State` reducers
export let mapReducers = mapper(reducerFn);
// map [ReducerStructMap, State] tuples to `(State, Action) ~> State` reducers
export let mapStructReducers = mapper(reducerStructFn);
