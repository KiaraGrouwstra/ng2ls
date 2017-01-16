"use strict";
var R = require("ramda");
var pipes_1 = require("./pipes");
var fn = function (s) { return s.toUpperCase(); };
var toKv = R.pipe(R.toPairs, R.map(function (_a) {
    var k = _a[0], v = _a[1];
    return ({ k: k, v: v });
}));
describe('genPipe', function () {
    it('should generate a pipe', function () {
        var cls = pipes_1.genPipe(fn, { name: 'shout' });
        var pipe = new cls();
        expect(pipe.transform("foo", [])).toEqual("FOO");
    });
});
describe('pipesForMeta', function () {
    it('should generate multiple pipes for a given metadata', function () {
        var cls = pipes_1.pipesForMeta({ meta: {}, pipes: { shout: fn } })[0];
        var pipe = new cls();
        expect(pipe.transform("foo", [])).toEqual("FOO");
    });
});
describe('makePipes', function () {
    it('should generate pipes with different metadata', function () {
        var cls = pipes_1.makePipes([{ meta: {}, pipes: { shout: fn } }])[0];
        var pipe = new cls();
        expect(pipe.transform("foo", [])).toEqual("FOO");
    });
});
describe('pipeModule', function () {
    it('should generate a pipe module given generated and pre-existing pipes', function () {
        /*export*/ var PipesModule = pipes_1.pipeModule({ pure: { shout: fn, toKv: toKv } });
        expect(typeof PipesModule).toEqual("function");
    });
});
