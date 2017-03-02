import { ActionReducer } from '@ngrx/store';
import { Obj } from '../models/models';
import { ActionPair, MyAction } from '../actions/actions';
export declare type TypedReducer<TState, T> = (state: TState, action: MyAction<T>) => TState;
export declare type PayloadReducer<TState, T> = (state: TState, payload: T) => TState;
export declare type ReducerMap<TState> = Obj<PayloadReducer<TState, any>>;
export declare type ReducerTuple<TState, T> = [ActionPair<T>, PayloadReducer<TState, T>];
export declare type State = any;
export declare type PointFree = <T>(state: T) => T;
export declare let reducerFn: <TState>(types: Obj<(state: TState, payload: any) => TState>, initialState: TState) => ActionReducer<TState>;
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
export declare let reducerStructFn: <T>(struct: {
    fixed?: Obj<any> | undefined;
    set?: Obj<(payload?: any) => any> | undefined;
    update?: Obj<PointFree> | undefined;
    edit?: {
        [k: string]: <T>(payload?: T | undefined) => PointFree;
    } | undefined;
    misc?: {
        [k: string]: <T>(state?: T | undefined, payload?: any) => T;
    } | undefined;
}, initialState: Obj<any>) => ActionReducer<Obj<T>>;
export declare let mapReducers: any;
export declare let mapStructReducers: any;
