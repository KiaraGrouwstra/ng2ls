"use strict";
var R = require('ramda');
var js_1 = require('./js');
var decorate = R.curry(Reflect.decorate);
// decorate a class method (non get/set)
// export let try_log: MethodDecorator = decorate(decMethod());
function decMethod(k, wrapper) {
    if (k === void 0) { k = 'value'; }
    if (wrapper === void 0) { wrapper = function (fn, parameters, meta) { return js_1.callFn(fn, this, arguments); }; }
    return function (target, key, descriptor, pars) {
        var fn = R.prop('value')(descriptor); // descriptor.value
        if (typeof fn !== 'function') {
            throw new SyntaxError("can only decorate methods, while " + key + " is a " + typeof fn + "!");
        }
        return [(_a = {},
                // ...descriptor,
                // ...R.omit(['value'], descriptor),
                _a[k] = wrapper(fn, pars || [], { target: target, key: key, descriptor: descriptor }),
                _a
            )];
        var _a;
    };
}
// 'cast' a function such that in case it receives a bad (non-conformant)
// value for input, it will return a default value of its output type
// intercepts bad input values for a function so as to return a default output value
// ... this might hurt when switching to like Immutable.js though.
exports.typed = decorate(decMethod('value', function (fn, _a) {
    var from = _a[0], to = _a[1];
    return function () {
        for (var i = 0; i < from.length; i++) {
            var frm = from[i];
            var v = arguments[i];
            if (frm && (R.isNil(v) || v.constructor != frm))
                return (new to).valueOf();
        }
        return js_1.callFn(fn, this, arguments);
    };
}));
// simpler guard, just a try-catch wrapper with default value
exports.fallback = decorate(decMethod('value', function (fn, _a, meta) {
    var def = _a[0];
    return function () {
        try {
            return js_1.callFn(fn, this, arguments);
        }
        catch (e) {
            console.warn('fallback error', e.stack);
            return def;
        }
    };
}));
// try/catch to log errors. useful in contexts with silent crash, e.g. promises / async functions without try/catch.
exports.try_log = decorate(decMethod('value', function (fn, _a, meta) { return function () {
    try {
        return js_1.callFn(fn, this, arguments);
    }
    catch (e) {
        console.warn('try_log error', e.stack);
    }
}; }));
// wrapper for methods returning void, return if not all parameters are defined
// this broke with Sweet and would be fully useless with minification, so use is discouraged.
exports.combine = decorate(decMethod('value', function (fn, _a) {
    var allow_undef = _a[0];
    return function () {
        // let names = /([^\(]+)(?=\))'/.exec(fn.toString()).split(',').slice(1);
        var names = fn.toString().split('(')[1].split(')')[0].split(/[,\s]+/);
        for (var i = 0; i < arguments.length; i++) {
            var v = arguments[i];
            var name_1 = names[i]
                .replace(/_\d+$/, '');
            // fixes SweetJS suffixing names with e.g. _123. breaks functions already named .*_\d+, e.g. foo_123
            // do not minify while using this; functions wrapped in combine will no longer trigger.
            if (R.isUndefined(v) && !(allow_undef || {})[name_1])
                return; // R.isNil(v)
        }
        return js_1.callFn(fn, this, arguments); //return
    };
}));
// doesn't work with `setter`, since both would start out as identically-named regular methods
exports.getter = decorate([decMethod('get')]);
// doesn't work with `getter`, since both would start out as identically-named regular methods
exports.setter = decorate([decMethod('set')]);
