import * as R from 'ramda';
import { ActionReducer } from '@ngrx/store';
import { Obj } from '../models/models';
import { ActionPair, MyAction } from '../actions/actions';
export declare type TypedReducer<TState, T> = (state: TState, action: MyAction<T>) => TState;
export declare type PayloadReducer<TState, T> = (state: TState, payload: T) => TState;
export declare type ReducerMap<TState> = Obj<PayloadReducer<TState, any>>;
export declare type ReducerTuple<TState, T> = [ActionPair<T>, PayloadReducer<TState, T>];
export declare type State = any;
export declare type PointFree = <T>(state: T) => T;
export declare let reducerFn: <TState>(types: Obj<PayloadReducer<TState, any>>, initialState: TState) => ActionReducer<TState>;
export declare function reducerFnTuple<TState>(types: ReducerTuple<TState, any>[], initialState: TState): ActionReducer<TState>;
export declare type ReducerStructMap = {
    fixed?: Obj<any>;
    set?: Obj<(payload?: any) => State>;
    update?: Obj<PointFree>;
    edit?: {
        [k: string]: <T>(payload?: T) => PointFree;
    };
    misc?: {
        [k: string]: <T>(state?: T, payload?: any) => T;
    };
};
export declare let reducerStructFn: <T>(struct: ReducerStructMap, initialState: Obj<any>) => any;
export declare let mapReducers: (obj: R.Dictionary<{}>) => {
    [x: string]: ActionReducer<{}>;
};
export declare let mapStructReducers: (obj: R.Dictionary<{}>) => {
    [x: string]: ActionReducer<{}>;
};
