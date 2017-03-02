"use strict";
var R = require('ramda');
var of_1 = require('rxjs/observable/of');
exports.unJson = function (resp) { return resp.json(); };
exports.always = R.pipe(R.always, of_1.of);
