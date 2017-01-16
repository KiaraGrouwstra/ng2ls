"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var R = require("ramda");
var testing_1 = require("@angular/core/testing");
var browser_util_1 = require("@angular/platform-browser/testing/browser_util");
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
exports.asyncTest = R.curry(function (comp_cls, props, fn) { return function (done) {
    return __awaiter(this, void 0, void 0, function () {
        var par_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getComp(comp_cls, props)];
                case 1:
                    par_1 = _a.sent();
                    // fn(par);
                    // fakeAsync(fn)(par);
                    exports.myAsync(function () { return fn(par_1); })();
                    done();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    done.fail(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}; });
// create a test function from component data
exports.testFn = function (cls) {
    return function (props, fn) {
        return function (done) {
            return exports.asyncTest(cls)(props, fn)(done);
        };
    };
};
