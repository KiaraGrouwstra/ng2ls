"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var R = require("ramda");
var $ = require('jquery');
var core_1 = require("@angular/core");
require('materialize-css/dist/js/materialize.min');
// let YAML = require('yamljs');
// make an object from an array with mapper function
exports.arr2obj = function (fn) { return function (arr) { return R.pipe(R.map(function (k) { return [k, fn(k)]; }), R.fromPairs); }; };
// make a Map from an array with mapper function
function arr2map(arr, fn) {
    return arr.reduce(function (map, k) { return map.set(k, fn(k)); }, new Map());
}
exports.arr2map = arr2map;
// execute a function and return the input unchanged, to allow chaining
function doReturn(fn) {
    return function (v) {
        fn(v);
        return v;
    };
}
exports.doReturn = doReturn;
// return the hash or get parts of a Location as an object
function urlBit(url, part) {
    var par_str = url[part].substring(1);
    return fromQuery(par_str);
}
// convert a GET query string (part after `?`) to an object
function fromQuery(str) {
    var params = decodeURIComponent(str).split('&');
    return R.fromPairs(params.map(function (y) { return y.split('='); }));
}
exports.fromQuery = fromQuery;
// convert an object to a GET query string (part after `?`) -- replaces jQuery's param()
function toQuery(obj) {
    var enc = R.map(decodeURIComponent)(obj);
    return R.toPairs(enc).map(R.join('=')).join('&');
}
exports.toQuery = toQuery;
// let range = (n) => Array(n).fill().map((x,i)=>i);
// let spawn_n = (fn, n = 5, interval = 1000) => range(n).forEach((x) => setTimeout(fn, x * interval));
// 'cast' a function such that in case it receives a bad (non-conformant)
// value for input, it will return a default value of its output type
// intercepts bad input values for a function so as to return a default output value
// ... this might hurt when switching to like Immutable.js though.
function typed(from, to, fn) {
    return function () {
        for (var i = 0; i < from.length; i++) {
            var frm = from[i];
            var v = arguments[i];
            if (frm && (R.isNil(v) || v.constructor != frm))
                return (new to).valueOf();
        }
        return exports.callFn(fn, this, arguments);
    };
}
exports.typed = typed;
// wrapper for setter methods, return if not all parameters are defined
function combine(fn, allow_undef) {
    if (allow_undef === void 0) { allow_undef = {}; }
    return function () {
        // let names = /([^\(]+)(?=\))'/.exec(fn.toString()).split(',').slice(1);
        var names = fn.toString().split('(')[1].split(')')[0].split(/[,\s]+/);
        for (var i = 0; i < arguments.length; i++) {
            var v = arguments[i];
            var name_1 = names[i]
                .replace(/_\d+$/, ''); // fixes SweetJS suffixing all names with like _123. this will however break functions already named .*_\d+, e.g. foo_123
            // do not minify the code while uing this function, it will break -- functions wrapped in combine will no longer trigger.
            if (R.isUndefined(v) && !allow_undef[name_1])
                return; // || R.isNil(v)
        }
        exports.callFn(fn, this, arguments); //return
    };
}
exports.combine = combine;
// simpler guard, just a try-catch wrapper with default value
function fallback(def, fn) {
    return function () {
        try {
            return exports.callFn(fn, this, arguments);
        }
        catch (e) {
            console.warn('an error occurred, falling back to default value:', e);
            return def;
        }
    };
}
exports.fallback = fallback;
// just log errors. only useful in contexts with silent crash.
function tryLog(fn) {
    return function () {
        try {
            return exports.callFn(fn, this, arguments);
        }
        catch (e) {
            console.warn('tryLog error:', e);
        }
    };
}
exports.tryLog = tryLog;
// create a Component, decorating the class with the provided metadata
// export let FooComp = ng2comp({ component: {}, parameters: [], decorators: {}, class: class FooComp {} })
function ng2comp(o) {
    var _a = o.component, component = _a === void 0 ? {} : _a, _b = o.parameters, parameters = _b === void 0 ? [] : _b, _c = o.decorators, decorators = _c === void 0 ? {} : _c, cls = o["class"];
    cls['annotations'] = [new core_1.Component(component)];
    cls['parameters'] = parameters.map(function (x) { return x._desc ? x : [x]; });
    R.keys(decorators).forEach(function (k) {
        Reflect.decorate([decorators[k]], cls.prototype, k);
    });
    // return Component(component)(cls);
    return cls;
}
exports.ng2comp = ng2comp;
;
// find the index of an item within a Set (indicating in what order the item was added).
function findIndexSet(x, set) {
    return Array.from(set).findIndex(function (y) { return y == x; });
}
exports.findIndexSet = findIndexSet;
// editVals from elins; map values of an object using a mapper
// only keep properties in original object
exports.editValsOriginal = R.curry(function (fnObj, obj) { return R.mapObjIndexed(function (v, k) {
    var fn = fnObj[k];
    return fn ? fn(v) : v;
})(obj); });
// export let editVals = (fnObj) => (obj) => R.reduce((acc, fn, k) => _.update(k, fn(acc[k]))(acc), obj)(fnObj);
// ^ no k in FP
// keep all original properties, map even over keys not in the original object
exports.editValsBoth = R.curry(function (fnObj, obj) {
    return R.keys(fnObj).reduce(function (acc, k) { return R.assoc(k, fnObj[k])(acc); }, obj);
});
// only keep properties in mapper object, map even over keys not in the original object
exports.editValsLambda = R.curry(function (fnObj, obj) { return R.mapObjIndexed(function (fn, k) {
    var v = obj[k];
    return fn ? fn(v) : v;
})(fnObj); });
// split an object into its keys and values: `let [keys, vals] = splitObj(obj);`
function splitObj(obj) {
    return [R.keys(obj), R.values(obj)];
}
exports.splitObj = splitObj;
// http://www.2ality.com/2012/04/eval-variables.html
// evaluate an expression within a context (of the component)
exports.evalExpr = function (context, vars) {
    if (vars === void 0) { vars = {}; }
    return function (expr) {
        var varArr = [context, vars];
        var propObj = Object.assign.apply(Object, [{}].concat(varArr.concat(varArr.map(function (x) { return Object.getPrototypeOf(x); })).map(function (x) { return exports.arr2obj(function (k) { return x[k]; })(Object.getOwnPropertyNames(x)); })));
        var _a = splitObj(propObj), keys = _a[0], vals = _a[1];
        var fn = Function.apply(context, keys.concat("return " + expr));
        return fn.apply(context, vals);
    };
};
// print a complex object for debugging -- regular log sucks cuz it elides values, JSON.stringify errors on cyclical structures.
function print(k, v) {
    var cname = function (v) { return v ? v.constructor.name : null; };
    console.log(k, cname(v), R.map(cname)(v));
}
exports.print = print;
;
// transform a value while the predicate holds true
function transformWhile(predicate, transformer, v) {
    while (predicate(v)) {
        v = transformer(v);
    }
    return v;
}
exports.transformWhile = transformWhile;
// intended to allow sub-classing to create custom errors
var ExtendableError = (function (_super) {
    __extends(ExtendableError, _super);
    function ExtendableError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(_this, _this.constructor);
        }
        else {
            _this.stack = (new Error(message)).stack;
        }
        return _this;
    }
    return ExtendableError;
}(Error));
exports.ExtendableError = ExtendableError;
var isObject = R.both(R.is(Object), R.complement(R.is(Array)));
// extract any iterables wrapped in functions from a json structure as a collection of <path, iterable> tuples
function extractIterables(v, path, iters) {
    if (path === void 0) { path = []; }
    if (iters === void 0) { iters = []; }
    if (R.is(Array)(v)) {
        v.map(function (x, i) { return extractIterables(x, path.concat(i), iters); });
    }
    else if (isObject(v)) {
        R.mapObjIndexed(function (x, k) { return extractIterables(x, path.concat(k), iters); })(v);
    }
    else if (R.is(Function)(v)) {
        iters.push([path, v()]);
    }
    return iters;
}
exports.extractIterables = extractIterables;
// parameterize a JSON structure with variables (slots to be iterated over) into a function
function parameterizeStructure(val, iterableColl) {
    // go over the paths so as to unset each 'gap'
    var slotted = iterableColl.reduce(function (v, _a) {
        var path = _a[0], iterable = _a[1];
        return R.assoc(path, undefined)(v);
    }, val);
    // make reducer iterating over paths to inject a value into each from a parameter
    return function () {
        var paramColl = iterableColl.map(function (_a, idx) {
            var path = _a[0], iter = _a[1];
            return [path, arguments[idx]];
        });
        return paramColl.reduce(function (v, _a) {
            var path = _a[0], param = _a[1];
            return R.assoc(path, param)(v);
        }, slotted);
    };
}
exports.parameterizeStructure = parameterizeStructure;
// encody a message by base64
exports.encode = window.btoa;
// decody a message by base64
exports.decode = window.atob;
exports.MAX_ARRAY = Math.pow(2, 32) - 1;
// generate a form based on a value to edit (including arrays) and a `ValidatorStruct`.
// Matches up validator/control numbers by array sizes in the value.
// TODO: add `AsyncValidator`s, structure-level (as opposed to item-level) validators
// potentially add { sync, async } and { item, structure } wrappers in ValidatorStruct.
function editCtrl(fb, val, vldtr) {
    return isObject(val) ? fb.group(R.mapObjIndexed(function (v, k) { return editCtrl(fb, v, vldtr[k]); })(val)) :
        R.is(Array)(val) ? fb.array(val.map(function (v, k) { return editCtrl(fb, v, vldtr); })) :
            fb.control(val, vldtr);
}
exports.editCtrl = editCtrl;
// ^ still UNUSED, but needed to load in existing values to edit!
exports.mapNestedBoth = function (f, v, path) {
    if (path === void 0) { path = []; }
    return R.is(Array)(v) ? v.map(function (x, i) { return exports.mapNestedBoth(x, path.concat(i)); }) :
        R.is(Object)(v) ? R.mapObjIndexed(function (x, k) { return exports.mapNestedBoth(x, path.concat(k)); }) :
            f(v, path);
};
exports.mapNestedArr = function (f, v, path) {
    if (path === void 0) { path = []; }
    return R.is(Array)(v) ? v.map(function (x, i) { return exports.mapNestedArr(f, x, path.concat(i)); }) :
        f(v, path);
};
exports.mapNestedObject = function (f, v, path) {
    if (path === void 0) { path = []; }
    return R.is(Object)(v) ? R.mapObjIndexed(function (x, k) { return exports.mapNestedObject(f, x, path.concat(k)); }) :
        f(v, path);
};
exports.falsy = R.either(R.isEmpty, R.isNil);
exports.truthy = R.complement(exports.falsy); // differs from JS's 'truthy': []/{} -> false.
// look up the property corresponding to a string in a lookup object
exports.lookup = R.flip(R.prop);
// lookup with fallback to key
exports.lookupOr = R.curry(function (o, k) { return exports.lookup(o, k) || k; });
// // bypass Angular security (aimed at user-supplied data) for safe hardcoded values
// const safe = R.objOf('changingThisBreaksApplicationSecurity');
exports.callFn = function (fn, thisArg, args) { return Function.call.apply(Function, [fn, thisArg].concat(Array.prototype.slice.call(args))); };
