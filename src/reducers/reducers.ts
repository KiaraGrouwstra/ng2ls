import * as R from 'ramda';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Action, ActionReducer } from '@ngrx/store';
import { trace } from '../js';
import { Obj } from '../models/models';
import { ActionPair, MyAction } from '../actions/actions';
import { Observable } from 'rxjs';

export type TypedReducer<TState, T> = (state: TState, action: MyAction<T>) => TState;
export type PayloadReducer<TState, T> = (state: TState, payload: T) => TState;
export type ReducerMap<TState> = Obj<PayloadReducer<TState, any>>;
export type ReducerTuple<TState, T> = [ActionPair<T>, PayloadReducer<TState, T>];
export type State = any;
export type PointFree = <T>(state: T) => T;
export type Reducer<T> = (pl: T) => PointFree;

// pick the right reducer by action type, or default to the current state
export let reducerFn = <TState>(types: ReducerMap<TState>, initialState?: TState): ActionReducer<TState> =>
  <T>(state: TState = <TState> initialState, action: MyAction<T>): TState => R.pipe(
    R.pathOr(() => trace(`reducer type defaulted: ${action.type}`, state), [action.type]),
    (f: PayloadReducer<TState, T>) => f(state, action.payload), // why was this failing to pass payload?
 )(types);

export function reducerFnTuple<TState>(types: ReducerTuple<TState, any>[], initialState: TState): ActionReducer<TState> {
  let pairs = R.map(<T>([{ type, action }, reducerFn]: [ActionPair<T>, PayloadReducer<TState, T>]): [string, (s: TState, a:MyAction<T>) => TState] =>
      [type, (state: TState, act: MyAction<T>) => reducerFn(state, act.payload)]
  , types);
  return reducerFn(R.fromPairs(pairs), initialState);
}

export type ReducerStructMap = {
  fixed?: Obj<any>, // (_state, _pl)
  set?: Obj<(payload?: any) => State>, // (_state, pl)
  update?: Obj<PointFree>, // (state, _pl), point-free!
  edit?: { [k: string]: <T>(payload?: T) => PointFree }, // (state, pl), point-free!
  misc?: { [k: string]: <T>(state?: T, payload?: any) => T }, // (state, pl), not point-free, for backward compatibility
};

// make a reducer with some optimizations based on what reducer parameters are actually used
export let reducerStructFn = /*<T>*/(struct: ReducerStructMap, initialState: any): ActionReducer<Obj</*T*/any>> => {
  // let { fixed = {}, set = {}, update = {}, edit = {}, misc = {} } = struct;
  let fixed = struct.fixed || {};
  let set = struct.set || {};
  let update = struct.update || {};
  let edit = struct.edit || {};
  let misc = struct.misc || {};
  let reducer = <Obj<PayloadReducer</*T*/any, any>>> R.mergeAll([
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

export type Selector<TState, T> = (state$: Observable<TState>) => Observable<T>;
export let combineSelectors = <TState, Types extends any[], TRes>(selectors: string/*Selector<TState, any>*/[]
    /* Types.map(Tp => Selector<TState, Tp>) */, fn: (params: Types) => TRes): Selector<TState, TRes> =>
    (state$: Observable<TState>): Observable<TRes> => combineLatest/*<...Types>*/<any>
    (...selectors.map(<T>(selector: string/*Selector<TState, any>*/) => state$.pluck(selector))).map(fn);
    // ^ could simplify from array with R.apply(fn) if using ...params wouldn't error with "A rest parameter must be of an array type"
