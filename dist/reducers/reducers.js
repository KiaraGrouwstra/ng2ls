"use strict";
var R = require("ramda");
var util_1 = require("../util");
// pick the right reducer by action type, or default to the current state
exports.reducerFn = function (types, initialState) {
    return function (state, action) {
        if (state === void 0) { state = initialState; }
        return R.pipe(R.pathOr(function () { return util_1.trace('reducer defaulted', state); }, [action.type]), function (f) { return f(state, action.payload); })(types);
    };
};
function reducerFnTuple(types, initialState) {
    var obj = R.map(function (_a) {
        var _b = _a[0], type = _b.type, action = _b.action, reducerFn = _a[1];
        return [type, function (state, act) { return reducerFn(state, act.payload); }];
    })(types);
    return exports.reducerFn(obj, initialState);
}
exports.reducerFnTuple = reducerFnTuple;
// make a reducer with some optimizations based on what reducer parameters are actually used
exports.reducerStructFn = function (struct, initialState) {
    var _a = struct.fixed, fixed = _a === void 0 ? {} : _a, _b = struct.set, set = _b === void 0 ? {} : _b, _c = struct.update, update = _c === void 0 ? {} : _c, _d = struct.edit, edit = _d === void 0 ? {} : _d, _e = struct.misc, misc = _e === void 0 ? {} : _e;
    var reducer = R.mergeAll([
        R.map(function (v) { return function (state, payload) { return v; }; })(fixed),
        R.map(function (fn) { return function (state, payload) { return fn(payload); }; })(set),
        R.map(function (fn) { return function (state, payload) { return fn(state); }; })(update),
        R.map(function (fn) { return function (state, payload) { return fn(payload)(state); }; })(update),
        misc,
    ]);
    return exports.reducerFn(reducer, initialState);
};
var mapper = function (fn) {
    return R.mapObjIndexed(function (_a) {
        var types = _a[0], initialState = _a[1];
        return fn(types, initialState);
    });
};
// : Function
// map [ReducerMap, State] tuples to `(State, Action) ~> State` reducers
exports.mapReducers = mapper(exports.reducerFn);
// map [ReducerStructMap, State] tuples to `(State, Action) ~> State` reducers
exports.mapStructReducers = mapper(exports.reducerStructFn);
