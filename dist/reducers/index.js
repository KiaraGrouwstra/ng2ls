"use strict";
var R = require('ramda');
var combineLatest_1 = require('rxjs/observable/combineLatest');
// import { environment } from '../../environments/environment';
var environment = { production: false };
// import { compose } from '@ngrx/core';
// protect state from mutation (-> error)
var ngrx_store_freeze_1 = require('ngrx-store-freeze');
// Object<ReducerFn> -> ReducerFn<Object<ReducerFn>>
var store_1 = require('@ngrx/store');
var reducers_1 = require('./reducers'); //, mapStructReducers
var actions_1 = require('../actions');
var foo_1 = require('../actions/foo');
// let { UPDATE_LOCATION } = fromRouter.routerActions;
// store: db, reducers: tables, selectors: queries
var REDUCERS = {};
// R.map(R.prop('State'))(REDUCERS)
// nope... calculating is run-time, interfaces are compile-time
// const reducers = R.merge(R.map(({ reducers, initialState }) => reducerFn(reducers, initialState))(REDUCERS), {
//   router: fromRouter.routerReducer,
// });
var reducers = reducers_1.mapReducers({
    // hideNav: [{
    //   [UPDATE_LOCATION]: (state: StateNav, doHide: boolean) => doHide ? 'none' : 'inherit',
    // }, 'inherit'],
    projects: [(_a = {},
            _a[actions_1.actions.projects.types.SEARCH_COMPLETE] = function (state, _a) {
                var payload = _a.payload;
                return payload;
            },
            _a
        ), []],
    houses: [(_b = {},
            _b[actions_1.actions.houses.types.SEARCH_COMPLETE] = function (state, _a) {
                var payload = _a.payload;
                return payload;
            },
            _b
        ), []],
    devices: [(_c = {},
            _c[actions_1.actions.devices.types.OVERVIEW_COMPLETE] = function (state, _a) {
                var payload = _a.payload;
                return R.assoc('0', payload, state);
            },
            _c
        ), {}],
    // alternative, using tuples with pairs/payloads rather than object. May require `mapReducers` / `reducerStructFn` variants if deemed useful.
    foos: [[
            [foo_1.pairs.search, function (state, payload) { return payload; }],
        ], {}],
});
var developmentReducer = R.pipe(store_1.combineReducers, ngrx_store_freeze_1.storeFreeze)(reducers);
var productionReducer = store_1.combineReducers(reducers);
exports.reducer = environment.production ? productionReducer : developmentReducer;
var selectors = function (k) { return R.map(R.prop(k)); };
exports.combineSelectors = function (selectors, fn) {
    return function (state$) { return combineLatest_1.combineLatest /*<...Types>*/.apply(void 0, selectors.map(function (selector) { return state$.let(selector); })).map(fn); };
};
var _a, _b, _c;
// ^ could simplify from array with R.apply(fn) if using ...params wouldn't error with "A rest parameter must be of an array type"
