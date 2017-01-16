"use strict";
var R = require("ramda");
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject';
var rxjs_1 = require("rxjs");
require("rxjs/add/operator/combineLatest");
require("rxjs/add/operator/startWith");
// import { EventEmitter } from '@angular/core';
// // append to array:
function elemToArr(arr, x) {
    // concatenates arrays rather than pushing them as a single item
    return arr.concat(x);
    // // overwrites the old value
    // arr.push(x);
    // return arr;
    // // slower, but no overriding and arrays become one item
    // let c = R.cloneDeep(arr);
    // c.push(x);
    // return c;
}
exports.elemToArr = elemToArr;
function arrToArr(a, b) {
    return a.concat(b);
}
exports.arrToArr = arrToArr;
// // append to Set:
function elemToSet(set, x) {
    return set.add(x);
}
exports.elemToSet = elemToSet;
function arrToSet(set, arr) {
    return arr.reduce(function (set, x) { return set.add(x); }, set);
}
exports.arrToSet = arrToSet;
function setToSet(a, b) {
    // return new Set(function*() { yield* a; yield* b; }());
    return new Set(Array.from(a).concat(Array.from(b)));
}
exports.setToSet = setToSet;
// set of logging functions to use in Observable.subscribe (see `notify`)
function loggers(kw) {
    if (kw === void 0) { kw = 'obs'; }
    return [
        function (v) { return console.log(kw + " next", v); },
        function (e) { return console.error(kw + " error", e); },
        function () { return console.log(kw + " done"); },
    ];
}
exports.loggers = loggers;
// log an Observable's values
function notify(kw, obs) {
    var _a = loggers(kw), next = _a[0], complete = _a[1], error = _a[2];
    return obs.subscribe(next, complete, error);
}
exports.notify = notify;
// generalizes combineLatest from 2 Observables to an array of n: combLastObs([a$, b$]).map([a, b] => ...)
function combLastObs(arr) {
    return arr.reduce(function (obj_obs, v, idx) {
        var combiner = function (obj, val) {
            return Object.assign(obj, (_a = {}, _a[idx] = val, _a));
            var _a;
        };
        return R.hasProp('subscribe', v) ?
            obj_obs.combineLatest(v, combiner) :
            obj_obs.map(function (obs) { return combiner(obs, v); });
    }, new rxjs_1.BehaviorSubject({})).map(function (r) { return R.values(r); });
}
exports.combLastObs = combLastObs;
// maps the latest values of a set of Observables to a lambda
function mapComb(arr, fn) {
    return combLastObs(arr).map(function (r) { return fn.apply(void 0, r); });
}
exports.mapComb = mapComb;
// use the latest values of a set of Observables to subscribe to a lambda
function subComb(arr, fn) {
    return combLastObs(arr).subscribe(function (r) { return fn.apply(void 0, r); });
}
exports.subComb = subComb;
