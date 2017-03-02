"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var R = require('ramda');
var testing_1 = require('@angular/core/testing');
var browser_util_1 = require('@angular/platform-browser/testing/browser_util');
// create a component to test and return related stuff; must await result within an `async function` (not `fakeAsync`).
function getComp(test_class, props) {
    if (props === void 0) { props = {}; }
    var fixture = testing_1.TestBed.createComponent(test_class);
    // await fixture.whenStable();
    return fixture.whenStable().then(function () {
        var comp = fixture.componentInstance;
        Object.assign(comp, props);
        fixture.detectChanges();
        var debugEl = fixture.debugElement;
        var el = debugEl.nativeElement;
        return { comp: comp, el: el, fixture: fixture, debugEl: debugEl };
    });
}
exports.getComp = getComp;
// hack to inject a tick into fakeAsync, since it appears usually needed...
exports.myAsync = function (fn) { return testing_1.fakeAsync(function () {
    fn();
    testing_1.tick(1000);
}); };
// taken from ng2 DOM's `dispatchEvent`, cuz the DOM script errors for me with `el.dispatchEvent is not a function`.
// for convenience I could incorporate `.nativeElement` here, though that makes it incompatible with the original...
function sendEvent(el, eventType) {
    var event = document.createEvent('Event');
    event.initEvent(eventType, true, true);
    el.dispatchEvent(event); //.nativeElement
}
exports.sendEvent = sendEvent;
// set the value of an input, and trigger the corresponding event.
// The input can be obtained using `debugEl.query(By.css(css))`.
// trying to set a `select` to an unlisted option sets it to ''.
function setInput(input, val) {
    var el = input.nativeElement;
    el.value = val;
    // expect(el.value).toEqual(val);
    // sendEvent(el, 'input');
    browser_util_1.dispatchEvent(el, 'input');
    browser_util_1.dispatchEvent(el, 'change');
    // it seems <input>s want (input), <select>s want (change)
    testing_1.tick(10000);
}
exports.setInput = setInput;
// a function for creating and testing a component for the given parameters.
exports.asyncTest = R.curry(function (comp_cls, props, fn) {
    return function (done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var par_1 = yield getComp(comp_cls, props);
                // fn(par);
                // fakeAsync(fn)(par);
                exports.myAsync(function () { return fn(par_1); })();
                done();
            }
            catch (e) {
                done.fail(e);
            }
        });
    };
});
// create a test function from component data
exports.testFn = function (cls) {
    return function (props, fn) {
        return function (done) {
            return exports.asyncTest(cls)(props, fn)(done);
        };
    };
};
