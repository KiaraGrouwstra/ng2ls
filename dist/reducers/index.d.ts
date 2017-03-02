import { Observable } from 'rxjs/Observable';
import { ActionReducer } from '@ngrx/store';
import { Obj } from '../models/models';
export declare type House = {};
export declare type Device = {};
export declare type StateNav = string;
export declare type StateHouses = House[];
export declare type StateProjects = {}[];
export declare type StateDevices = Obj<Device>;
export interface State {
    houses: StateHouses;
}
export declare let reducer: ActionReducer<State>;
/**
 * ```ts
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = getBooksState(state$);
 * 	}
 * ```
 */
export declare type Selector<TState, T> = (state$: Observable<TState>) => Observable<T>;
export declare type CombineSelectors = <TState, Types extends any[], TRes>(selectors: Selector<TState, any>[], fn: (params: Types) => TRes) => Selector<TState, TRes>;
export declare let combineSelectors: CombineSelectors;
