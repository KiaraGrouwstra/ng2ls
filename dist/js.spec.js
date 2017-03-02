"use strict";
var R = require('ramda');
var js_1 = require('./js');
describe('js', function () {
    var fail = function (e) { return expect(e).toBeUndefined(); };
    var do_prom = function (done, prom, test) { return prom.then(test, fail).then(done, done); };
    it('arr2obj maps an array to an object', function () {
        expect(js_1.arr2obj(function (y) { return y * 2; })([1, 2, 3])).toEqual({ 1: 2, 2: 4, 3: 6 });
    });
    it('arr2map maps an array to a Map', function () {
        expect(R.fromPairs(js_1.arr2map([1, 2, 3], function (y) { return y * 2; }))).toEqual({ 1: 2, 2: 4, 3: 6 });
    });
    describe('typed', function () {
        // it('strLen', () => {
        //   let strLen = R.length;
        //   expect(strLen ('lol')).toEqual(3);
        //   expect(strLen (123)).toEqual(undefined);
        //   let strLen_ = typed([String], Number, strLen);
        //   expect(strLen_('lol')).toEqual(3);
        //   expect(strLen_(123)).toEqual(0);
        // })
        // it('arrObjNoop', () => {
        //   let arrObjNoop = (arr: any[], obj: Object) => 123;
        //   expect(arrObjNoop ([], {})).toEqual(undefined);
        //   // expect(arrObjNoop ('lol', 123)).toEqual(undefined); // TS: not assignable
        //   let arrObjNoop_ = typed([Array, Object], Array, arrObjNoop);
        //   expect(arrObjNoop_([], {})).toEqual(undefined);
        //   expect(arrObjNoop_('lol', 123)).toEqual([]);
        // })
    });
    // it('fallback', () => {
    //   let thrower = (v: any) => { throw new Error('boom'); };  //throw 'boom';
    //   // expect(thrower('hi')).toThrowError('boom');  // dunno why this fails :(
    //   let safe = fallback(123, thrower); // TS: not assignable
    //   expect(safe('hi')).toEqual(123);
    // })
    // it('ng2comp', () => {
    //   let cmp_cls = ng2comp({
    //     component: {
    //       selector: 'value',
    //     },
    //     decorators: {
    //       // array: ViewChild(ArrayComp),
    //     },
    //     parameters: [],
    //     class: class tmp {},
    //   });
    //   expect().toEqual();
    // })
    it('combine', function () {
        var cls = (function () {
            function tmp() {
                var _this = this;
                this.combInputs = function () { return js_1.combine(function (a, b) {
                    _this.c = a + b;
                })(_this.a, _this.b); };
            }
            Object.defineProperty(tmp.prototype, "a", {
                get: function () { return this._a; },
                set: function (x) {
                    this._a = x;
                    this.combInputs();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(tmp.prototype, "b", {
                get: function () { return this._b; },
                set: function (x) {
                    this._b = x;
                    this.combInputs();
                },
                enumerable: true,
                configurable: true
            });
            return tmp;
        }());
        var obj = new cls();
        obj.a = 1;
        obj.b = 1;
        expect(obj.c).toEqual(2);
    });
    it('combine with optional undefined values', function () {
        var cls = (function () {
            function tmp() {
                var _this = this;
                this.combInputs = function () { return js_1.combine(function (a, b) {
                    _this.c = a + b;
                }, { b: true })(_this.a, _this.b); };
            }
            Object.defineProperty(tmp.prototype, "a", {
                get: function () { return this._a; },
                set: function (x) {
                    this._a = x;
                    this.combInputs();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(tmp.prototype, "b", {
                get: function () { return this._b; },
                set: function (x) {
                    this._b = x;
                    this.combInputs();
                },
                enumerable: true,
                configurable: true
            });
            return tmp;
        }());
        var obj = new cls();
        obj.a = 1;
        expect(obj.c).toEqual(NaN);
    });
    it('findIndexSet', function () {
        expect(js_1.findIndexSet('b', new Set(['a', 'b', 'c']))).toEqual(1);
    });
    describe('editVals', function () {
        it('editValsOriginal', function () {
            expect(js_1.editValsOriginal({ a: function (y) { return y * 2; }, b: function (y) { return y * y; }, d: function (y) { return y ? y : 'nope'; } })({ a: 3, b: 5, c: 7 })).toEqual({ a: 6, b: 25, c: 7 });
        });
        it('editValsBoth', function () {
            expect(js_1.editValsBoth({ a: function (y) { return y * 2; }, b: function (y) { return y * y; }, d: function (y) { return y ? y : 'nope'; } })({ a: 3, b: 5, c: 7 })).toEqual({ a: 6, b: 25, c: 7, d: 'nope' });
        });
        it('editValsLambda', function () {
            expect(js_1.editValsLambda({ a: function (y) { return y * 2; }, b: function (y) { return y * y; }, d: function (y) { return y ? y : 'nope'; } })({ a: 3, b: 5, c: 7 })).toEqual({ a: 6, b: 25, d: 'nope' });
        });
    });
    it('evalExpr', function () {
        expect(js_1.evalExpr({ a: 1 })('a')).toEqual(1);
    });
});
