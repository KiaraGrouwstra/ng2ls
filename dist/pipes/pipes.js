"use strict";
var R = require("ramda");
var core_1 = require("@angular/core");
/**
 * generate a pipe class for a given function and metadata
 */
function genPipe(fn, opts) {
    if (opts === void 0) { opts = { name: '' }; }
    var cls = (function () {
        function class_1() {
            this.transform = fn;
        }
        return class_1;
    }());
    Object.defineProperty(cls, 'name', { value: opts['name'] });
    return R.assoc('annotations', [
        new core_1.Pipe(opts),
        new core_1.Injectable(),
    ], cls);
}
exports.genPipe = genPipe;
/**
 * create pipes with common metadata
 */
function pipesForMeta(_a) {
    var _b = _a.meta, meta = _b === void 0 ? {} : _b, pipes = _a.pipes;
    return R.pipe(R.toPairs, R.map(function (_a) {
        var k = _a[0], v = _a[1];
        return genPipe(v, R.merge(meta, { name: k }));
    }))(pipes);
}
exports.pipesForMeta = pipesForMeta;
/**
 * make pipes in groups (by metadata) then flatten
 */
exports.makePipes = R.pipe(R.map(pipesForMeta), R.flatten);
/**
 * generate a pipe module given pipe infos and pre-existing pipes.
 * deprecated: just use pipeModule unless Angular adds new Pipe metadata.
 */
function customPipeModule(infos, readyPipes) {
    if (infos === void 0) { infos = []; }
    if (readyPipes === void 0) { readyPipes = []; }
    var pipes = readyPipes.concat(exports.makePipes(infos));
    var cls = (function () {
        function class_2() {
        }
        return class_2;
    }());
    return R.assoc('annotations', [
        new core_1.NgModule({ declarations: pipes, exports: pipes }),
    ], cls);
}
exports.customPipeModule = customPipeModule;
/**
 * generate a pipe module given pure/impure functions and premade pipes
 */
function pipeModule(_a) {
    var _b = _a.ready, ready = _b === void 0 ? [] : _b, _c = _a.pure, pure = _c === void 0 ? {} : _c, _d = _a.impure, impure = _d === void 0 ? {} : _d;
    return customPipeModule([
        { meta: {}, pipes: pure },
        { meta: { pure: false }, pipes: impure },
    ], ready);
}
exports.pipeModule = pipeModule;
// export let {a, b, c} = o;
