import * as R from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ActionReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { arr2obj, trace } from '../util';
import { environment } from '../../environments/environment';
import { Obj, House } from '../models/models';

// import { compose } from '@ngrx/core';
// protect state from mutation (-> error)
import { storeFreeze } from 'ngrx-store-freeze';
// Object<ReducerFn> -> ReducerFn<Object<ReducerFn>>
import { combineReducers } from '@ngrx/store';

import { mapReducers } from './reducers';  //, mapStructReducers
import { actions } from '../actions';
import { pairs as foos } from '../actions/foo';
let { UPDATE_LOCATION } = fromRouter.routerActions;

// store: db, reducers: tables, selectors: queries
const REDUCERS = {
  // foo: require('./foo'),
};

type StateNav = string;
type StateHouses = House[];
// type StateDevices = Obj<Device>;

export interface State {
  // router: fromRouter.RouterState;
  houses: StateHouses;
}
// R.map(R.prop('State'))(REDUCERS)
// nope... calculating is run-time, interfaces are compile-time

// const reducers = R.merge(R.map(({ reducers, initialState }) => reducerFn(reducers, initialState))(REDUCERS), {
//   router: fromRouter.routerReducer,
// });
let reducers = mapReducers({
  hideNav: [{
    [UPDATE_LOCATION]: (state: StateNav, doHide: boolean) => doHide ? 'none' : 'inherit',
  }, 'inherit'],
  projects: [{
    [actions.projects.types.SEARCH_COMPLETE]: (state: StateProjects, { payload }) => payload, // did just putting payload still fail?
  }, []],
  houses: [{
    [actions.houses.types.SEARCH_COMPLETE]: (state: StateHouses, { payload }) => payload,
  }, []],
  devices: [{
    [actions.devices.types.OVERVIEW_COMPLETE]: (state: StateDevices, { payload }) => R.assoc('0', payload, state), // where to get id??
  }, {}],

  // alternative, using tuples with pairs/payloads rather than object. May require `mapReducers` / `reducerStructFn` variants if deemed useful.
  foos: [[
    [foos.search, (state: StateDevices, payload: string) => payload],
  ], {}],
});

const developmentReducer = R.pipe(combineReducers, storeFreeze)(reducers);
const productionReducer = combineReducers(reducers);
export let reducer: ActionReducer<State> = environment.production ? productionReducer : developmentReducer;

let selectors = (k: string) => R.map(R.prop(k));

// selector to use on state in component constructor
/**
 * ```ts
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = getBooksState(state$);
 * 	}
 * ```
 */
/*
export let getBooksState = R.map(R.prop('books'));
export let bookSelectors = R.map((sel) => R.pipe(getBooksState, sel))(REDUCERS.books.selectors); // selectors?

export let getSearchState = R.map(s => s.search);
export let searchSelectors = R.map((sel) => R.pipe(getSearchState, sel))(arr2obj(selectors)(R.keys(REDUCERS.search.initialState)));

// // selector with join: array of books in store
// export const getSearchResults = function (state$: Observable<State>) {
//   return combineLatest<{ [id: string]: Book }, string[]>(
//     state$.let(getBookEntities),
//     state$.let(getSearchBookIds)
//  )
//   .map(([entities, ids]) => ids.map(id => entities[id]));
// };

export let getCollectionState = R.map(s => s.collection);
export let collectionSelectors = R.map((sel) => R.pipe(getCollectionState, sel))(arr2obj(selectors)(R.keys(REDUCERS.collection.initialState)));

// export const getBookCollection = function (state$: Observable<State>) {
//   return combineLatest<{ [id: string]: Book }, string[]>(
//     state$.let(getBookEntities),
//     state$.let(getCollectionBookIds)
//   )
//   .map(([entities, ids]) => ids.map(id => entities[id]));
// };

// export const isSelectedBookInCollection = function (state$: Observable<State>) {
//   return combineLatest<string[], Book>(
//     state$.let(getCollectionBookIds),
//     state$.let(getSelectedBook),
//   )
//   .map(([ids, selectedBook]) => ids.indexOf(selectedBook.id) > -1);
// };

// Layout Reducers
export const getLayoutState = (state$: Observable<State>) => state$.select(R.prop('layout'));
// export const getShowSidenav = R.pipe(fromLayout.getShowSidenav, getLayoutState);
*/
