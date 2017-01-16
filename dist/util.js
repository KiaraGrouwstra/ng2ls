"use strict";
var R = require("ramda");
var jQuery = require("jquery");
// coerces an action label string into a string literal, enabling typechecking (TS2.0 tagged union types), and ensuring uniqueness
var typeCache = {};
function type(label) {
    if (typeCache[label]) {
        throw new Error("Action type \"" + label + "\" is not unique\"");
    }
    typeCache[label] = true;
    return label;
}
exports.type = type;
// convert an array to an object based on a lambda
exports.arr2obj = function (fn) { return R.pipe(R.map(function (k) { return [k, fn(k)]; }), R.fromPairs); };
exports.json = JSON.parse;
// convert a class instance to a pojo
exports.pojofy = R.pipe(JSON.stringify, JSON.parse);
// debug logging for FP (composition chains)
exports.trace = R.curry(function (tag, x) {
    console.log(tag, x);
    return x;
});
exports.toQuery = jQuery.param;
// create a url with query params from an object
function makeUrl(url, pars) {
    if (pars === void 0) { pars = {}; }
    return R.keys(pars).length ? url + "?" + exports.toQuery(pars) : url;
}
exports.makeUrl = makeUrl;
// convert query/hash params to an object
exports.fromParams = R.pipe(R.defaultTo(''), R.split('&'), R.map(R.pipe(R.split('='), 
// maybe it's different in variable size array and fixed size array to type inferring
function (parts) { return [parts[0], parts[1]]; })), R.fromPairs, R.map(decodeURIComponent));
