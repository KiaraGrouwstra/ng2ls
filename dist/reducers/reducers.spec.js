"use strict";
var R = require('ramda');
var actions_1 = require('../actions/actions');
var reducers_1 = require('./reducers');
var cls = actions_1.makeAction('book', 'create');
var action = new cls('foo');
describe('reducerFn', function () {
    it('should make a reducer function from a type map and initial state', function () {
        var reducer = reducers_1.reducerFn({ inc: R.inc }, 0);
        // Action:: { type, payload }
        expect(reducer(0, { type: 'inc' })).toEqual(1);
    });
});
describe('mapReducers', function () {
    it('should map [ReducerMap, State] tuples to `(State, Action) ~> State` reducers', function () {
        var reducerObj = reducers_1.mapReducers({ inc: R.inc });
        expect(reducerObj['inc'](0, { type: 'inc', payload: null })).toEqual(1);
    });
});
describe('mapStructReducers', function () {
    it('should map [ReducerStructMap, State] tuples to `(State, Action) ~> State` reducers', function () {
        var reducerObj = reducers_1.mapStructReducers({
            fixed: { fixed: 123 },
            set: { set: R.identity },
            update: { update: R.dec },
            edit: { edit: function (state, amount) { return state + amount; } },
            misc: { misc: R.inc },
        });
        expect(reducerObj['edit'](0, { type: 'edit', payload: 2 })).toEqual(1);
    });
});
