"use strict";
var R = require('ramda');
var test_1 = require('./test');
var directives_1 = require('./directives');
var js_1 = require('./js');
var core_1 = require('@angular/core');
var TestComponent = (function () {
    // objExpr = {'foo': true, 'bar': false};
    // setExpr: Set<string> = new Set<string>();
    function TestComponent(cdr) {
        this.cdr = cdr;
        this.foo = 'bar';
        this.color = 'red';
        this.baz = 'color';
        this.condition = true;
        this.condExpr = 'condition';
        // items: any[];
        this.strExpr = 'foo';
        this.arrExpr = ['foo', 'bar', 'baz'];
        // this.setExpr.add('foo');
    }
    return TestComponent;
}());
describe('directives', function () {
    // let test = (props: Object, fn: Function) => (done: Function) => asyncTest(ng2comp)(props, fn)(done);
    var test = test_1.testFn(js_1.ng2comp({ class: TestComponent }));
    var component = {
        selector: 'test-cmp',
        directives: [directives_1.DynamicAttrs, directives_1.SetAttrs, directives_1.AssignLocal, directives_1.DynamicStyle, directives_1.DynamicClass, directives_1.AppliesDirective, directives_1.AppliesExprDirective],
        template: '',
    };
    var tmplt = function (str) { return ({ component: R.assoc('template', str)(component), class: TestComponent, parameters: [core_1.ChangeDetectorRef] }); };
    describe('SetAttrs', function () {
        it('sets properties', test(tmplt("<div [setAttrs]=\"{ id: strExpr }\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.id).toEqual('foo');
        }));
        // syntax the same as for properties, no `attr.` needed :)
        it('sets attributes', test(tmplt("<div [setAttrs]=\"{ 'pattern': strExpr }\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.attributes.getNamedItem('pattern').value).toEqual('foo');
        }));
    });
    describe('DynamicAttrs', function () {
        it('sets properties', test(tmplt("<div [dynamicAttrs]=\"{ id: strExpr }\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.id).toEqual('bar');
        }));
        it('sets attributes', test(tmplt("<div [dynamicAttrs]=\"{ 'pattern': strExpr }\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.attributes.getNamedItem('pattern').value).toEqual('bar');
        }));
    });
    describe('AppliesDirective', function () {
        it('sets the hidden property', test(tmplt("<div [applies]=\"true\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.hidden).toEqual(false);
        }));
        it('can deal with non-values', test(tmplt("<div [applies]=\"false\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.hidden).toEqual(true);
        }));
    });
    describe('AppliesExprDirective', function () {
        it('sets the hidden property', test(tmplt("<div [appliesExpr]=\"condExpr\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.hidden).toEqual(false);
        }));
        it('can deal with non-values', test(tmplt("<div [appliesExpr]=\"null\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.hidden).toEqual(false);
        }));
    });
    describe('DynamicStyle', function () {
        it('sets styles', test(tmplt("<div [dynamicStyle]=\"{ color: baz }\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.style.color).toEqual('red');
        }));
    });
    describe('DynamicClass', function () {
        it('sets classes', test(tmplt("<div [dynamicClass]=\"{ foo: condExpr }\"></div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.attributes.getNamedItem('class').value).toEqual('foo');
        }));
    });
    // // I don't think there is a `setElementDirective()`...
    // it('SetDirectives', test(tmplt(`<div [setAttrs]="{ ngClass: { strExpr: condition } }"></div>`), ({ comp, el, fixture }: TestPars) => {
    //   expect(el).toEqual('foo');
    // }));
    // it('DynamicDirectives', test(tmplt(`<div [dynamicAttrs]="{ ngClass: { strExpr: condition } }"></div>`), ({ comp, el, fixture }: TestPars) => {
    //   expect(el).toEqual('bar');
    // }));
    describe('AssignLocal', function () {
        it('should save a value and reuse it', test(tmplt("<div\n              [assignLocal]=\"{ hello: strExpr }\"\n              [id]=\"hello\"\n            >{{ hello }}</div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            expect(el.textContent).toEqual('foo');
        }));
        xit('should work even in loops', test(tmplt("<div\n              *ngFor=\"let item of arrExpr; let idx = index\"\n              [assignLocal]=\"{ hello: item }\"\n              [id]=\"hello\"\n            >{{ idx }}: <!-- {{ item }} -->{{ hello }}</div>"), function (_a) {
            var comp = _a.comp, el = _a.el, fixture = _a.fixture;
            console.log('TEST');
            js_1.print('comp', comp);
            js_1.print('el', el);
            js_1.print('fixture', fixture);
            js_1.print('comp.cdr', comp.cdr);
            js_1.print('comp.cdr._view', comp.cdr._view);
            js_1.print('fixture.elementRef', fixture.elementRef);
            js_1.print('fixture.componentRef', fixture.componentRef);
            js_1.print('fixture.componentRef._hostElement', fixture.componentRef._hostElement);
            js_1.print('comp.cdr._view.ref', comp.cdr._view.ref);
            js_1.print('comp.cdr._view.context', comp.cdr._view.context);
            js_1.print('comp.cdr._view._currentDebugContext', comp.cdr._view._currentDebugContext);
            js_1.print('comp.cdr._view._NgFor_0_6', comp.cdr._view._NgFor_0_6);
            js_1.print('comp.cdr._view._NgFor_0_6._ngForOf', comp.cdr._view._NgFor_0_6._ngForOf);
            expect(el.textContent).toEqual('foobarbaz');
        }));
    });
    // it('', test({ component, class: TestComponent }, ({ test_cmp: comp, el, fixture }) => {
    //   expect().toEqual();
    // }));
});
