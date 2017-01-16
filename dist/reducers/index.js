"use strict";
var R = require("ramda");
var fromRouter = require("@ngrx/router-store");
var environment_1 = require("../../environments/environment");
// import { compose } from '@ngrx/core';
// protect state from mutation (-> error)
var ngrx_store_freeze_1 = require("ngrx-store-freeze");
// Object<ReducerFn> -> ReducerFn<Object<ReducerFn>>
var store_1 = require("@ngrx/store");
var reducers_1 = require("./reducers"); //, mapStructReducers
var actions_1 = require("../actions");
var foo_1 = require("../actions/foo");
var UPDATE_LOCATION = fromRouter.routerActions.UPDATE_LOCATION;
// store: db, reducers: tables, selectors: queries
var REDUCERS = {};
// R.map(R.prop('State'))(REDUCERS)
// nope... calculating is run-time, interfaces are compile-time
// const reducers = R.merge(R.map(({ reducers, initialState }) => reducerFn(reducers, initialState))(REDUCERS), {
//   router: fromRouter.routerReducer,
// });
var reducers = reducers_1.mapReducers({
    hideNav: [(_a = {},
            _a[UPDATE_LOCATION] = function (state, doHide) { return doHide ? 'none' : 'inherit'; },
            _a), 'inherit'],
    projects: [(_b = {},
            _b[actions_1.actions.projects.types.SEARCH_COMPLETE] = function (state, _a) {
                var payload = _a.payload;
                return payload;
            },
            _b), []],
    houses: [(_c = {},
            _c[actions_1.actions.houses.types.SEARCH_COMPLETE] = function (state, _a) {
                var payload = _a.payload;
                return payload;
            },
            _c), []],
    devices: [(_d = {},
            _d[actions_1.actions.devices.types.OVERVIEW_COMPLETE] = function (state, _a) {
                var payload = _a.payload;
                return R.assoc('0', payload, state);
            },
            _d), {}],
    // alternative, using tuples with pairs/payloads rather than object. May require `mapReducers` / `reducerStructFn` variants if deemed useful.
    foos: [[
            [foo_1.pairs.search, function (state, payload) { return payload; }],
        ], {}],
});
var developmentReducer = R.pipe(store_1.combineReducers, ngrx_store_freeze_1.storeFreeze)(reducers);
var productionReducer = store_1.combineReducers(reducers);
exports.reducer = environment_1.environment.production ? productionReducer : developmentReducer;
var selectors = function (k) { return R.map(R.prop(k)); };
var _a, _b, _c, _d;
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
