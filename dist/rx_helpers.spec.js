"use strict";
var rx_helpers_1 = require('./rx_helpers'); //, emitter
var rxjs_1 = require('rxjs');
require('rxjs/add/operator/map');
require('rxjs/add/operator/scan');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/toArray');
require('rxjs/add/operator/last');
require('rxjs/add/operator/startWith');
require('rxjs/add/observable/from');
var R = require('ramda');
// // let test = (obs, val, txt) => obs.subscribe(e => console.log(JSON.stringify(e) == JSON.stringify(val), txt, JSON.stringify(e)));
// let rxit = require('jasmine-rx').rxit;
var fail = function (e) { return alert(e); };
describe('Rx Helpers', function () {
    var do_obs = function (done, obs, test, not_done) {
        if (not_done === void 0) { not_done = false; }
        return obs.subscribe(not_done ? R.pipe(test, done) : test, R.pipe(fail, done), done);
    };
    // let obs_it = (desc, obs, test) => it(desc, (done) => obs.subscribe(test, fail(done), done));
    var people = [{ "id": 1, "name": "Brad" }, { "id": 2, "name": "Jules" }, { "id": 3, "name": "Jeff" }];
    var keys = ["id", "name"]; //R.keys(people);
    var obs, flat;
    beforeEach(function () {
        // obs = http.get(`api/people.json`).map(y => y.json())
        obs = rxjs_1.Observable.from([people]);
        flat = obs.mergeMap(function (x, i) { return x; });
    });
    it('spits out the original array (like http)', function (d) { return do_obs(d, obs, function (v) { return expect(v).toEqual(people); }); });
    it("if it's just one array then toArray() wraps it in another", function (d) { return do_obs(d, obs.toArray(), function (v) { return expect(v).toEqual([people]); }); });
    it('flatMap() flattens an array, toArray() merges it back', function (d) { return do_obs(d, flat.toArray(), function (v) { return expect(v).toEqual(people); }); });
    it('elemToArr gradually merge items', function (d) { return do_obs(d, flat.scan(rx_helpers_1.elemToArr, []).last(), function (v) { return expect(v).toEqual(people); }); });
    it('arrToArr gradually merges arrays', function (d) { return do_obs(d, flat.map(function (e) { return [e]; }).scan(rx_helpers_1.arrToArr, []).last(), function (v) { return expect(v).toEqual(people); }); });
    it('elemToSet gradually merges items into a set', function (d) { return do_obs(d, flat
        .map(function (e) { return R.keys(e); })
        .mergeMap(function (x, i) { return x; })
        .scan(rx_helpers_1.elemToSet, new Set)
        .last()
        .map(Array.from), function (v) { return expect(v).toEqual(keys); }); });
    it('arrToSet gradually merges arrays into a set', function (d) { return do_obs(d, flat
        .map(function (e) { return R.keys(e); })
        .scan(rx_helpers_1.arrToSet, new Set)
        .last()
        .map(Array.from), function (v) { return expect(v).toEqual(keys); }); });
    it('setToSet gradually merges sets into a set', function (d) { return do_obs(d, flat
        .map(function (e) { return new Set(R.keys(e)); })
        .scan(rx_helpers_1.setToSet, new Set)
        .last()
        .map(Array.from), function (v) { return expect(v).toEqual(keys); }); });
    it('combLastObs combines the latest values from multiple Observables for use in one', function (d) { return do_obs(d, rx_helpers_1.combLastObs([1, 2, 3].map(function (v) { return new rxjs_1.BehaviorSubject(v); })), function (r) { return expect(r).toEqual([1, 2, 3]); }, true); });
    it('mapComb maps the latest values of a set of Observables to a lambda', function (d) { return do_obs(d, rx_helpers_1.mapComb(['foo', 'bar'].map(function (v) { return new rxjs_1.BehaviorSubject(v); }), function (foo, bar) { return foo + bar; }), function (r) { return expect(r).toEqual('foobar'); }, true); });
    // it('emitter makes an ng2 EventEmitter (wrapped Rx Subject) with an initial value', (d) => do_obs(d,
    //   emitter('foo'),
    //   (v) => expect(v).toEqual('foo')
    // ))
    // CAN'T STRINGIFY SETS without Array.from(set)
});
