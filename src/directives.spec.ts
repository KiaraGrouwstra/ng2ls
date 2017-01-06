import * as R from 'ramda';
import { TestBed, tick } from '@angular/core/testing';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';
import { asyncTest, testFn, CompTestMeta } from './test';
import { SetAttrs, DynamicAttrs, DynamicStyle, DynamicClass, AssignLocal, AppliesDirective, AppliesExprDirective } from './directives';
import { ng2comp, print } from './js';
import { Component, Input, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

class TestComponent {
  foo: string = 'bar';
  color: string = 'red';
  baz: string = 'color';
  condition: boolean = true;
  condExpr: string = 'condition';
  // items: any[];
  strExpr = 'foo';
  arrExpr: string[] = ['foo','bar','baz'];
  // objExpr = {'foo': true, 'bar': false};
  // setExpr: Set<string> = new Set<string>();
  constructor(
    public cdr: ChangeDetectorRef,
  ) {
    // this.setExpr.add('foo');
  }
}

type TestPars = CompTestMeta<TestComponent>;

describe('directives', () => {
  // let test = (props: Object, fn: Function) => (done: Function) => asyncTest(ng2comp)(props, fn)(done);
  let test = testFn(ng2comp({ class: TestComponent }));

  let component = {
    selector: 'test-cmp',
    directives: [DynamicAttrs, SetAttrs, AssignLocal, DynamicStyle, DynamicClass, AppliesDirective, AppliesExprDirective],
    template: '',
  };

  let tmplt = (str: string) => ({ component: R.assoc('template', str)(component), class: TestComponent, parameters: [ChangeDetectorRef] });

  describe('SetAttrs', () => {

    it('sets properties', test(tmplt(`<div [setAttrs]="{ id: strExpr }"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.id).toEqual('foo');
    }));

    // syntax the same as for properties, no `attr.` needed :)
    it('sets attributes', test(tmplt(`<div [setAttrs]="{ 'pattern': strExpr }"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.attributes.getNamedItem('pattern').value).toEqual('foo');
    }));

  })

  describe('DynamicAttrs', () => {

    it('sets properties', test(tmplt(`<div [dynamicAttrs]="{ id: strExpr }"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.id).toEqual('bar');
    }));

    it('sets attributes', test(tmplt(`<div [dynamicAttrs]="{ 'pattern': strExpr }"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.attributes.getNamedItem('pattern').value).toEqual('bar');
    }));

  })

  describe('AppliesDirective', () => {

    it('sets the hidden property', test(tmplt(`<div [applies]="true"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.hidden).toEqual(false);
    }));

    it('can deal with non-values', test(tmplt(`<div [applies]="false"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.hidden).toEqual(true);
    }));

  })

  describe('AppliesExprDirective', () => {

    it('sets the hidden property', test(tmplt(`<div [appliesExpr]="condExpr"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.hidden).toEqual(false);
    }));

    it('can deal with non-values', test(tmplt(`<div [appliesExpr]="null"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.hidden).toEqual(false);
    }));

  })

  describe('DynamicStyle', () => {

    it('sets styles', test(tmplt(`<div [dynamicStyle]="{ color: baz }"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.style.color).toEqual('red');
    }));

  })

  describe('DynamicClass', () => {

    it('sets classes', test(tmplt(`<div [dynamicClass]="{ foo: condExpr }"></div>`), ({ comp, el, fixture }: TestPars) => {
      expect(el.attributes.getNamedItem('class').value).toEqual('foo');
    }));

  })

  // // I don't think there is a `setElementDirective()`...
  // it('SetDirectives', test(tmplt(`<div [setAttrs]="{ ngClass: { strExpr: condition } }"></div>`), ({ comp, el, fixture }: TestPars) => {
  //   expect(el).toEqual('foo');
  // }));
  // it('DynamicDirectives', test(tmplt(`<div [dynamicAttrs]="{ ngClass: { strExpr: condition } }"></div>`), ({ comp, el, fixture }: TestPars) => {
  //   expect(el).toEqual('bar');
  // }));

  describe('AssignLocal', () => {

    it('should save a value and reuse it', test(
      tmplt(`<div
              [assignLocal]="{ hello: strExpr }"
              [id]="hello"
            >{{ hello }}</div>`),
      ({ comp, el, fixture }: TestPars) => {
        expect(el.textContent).toEqual('foo');
    }));

    xit('should work even in loops', test(
      tmplt(`<div
              *ngFor="let item of arrExpr; let idx = index"
              [assignLocal]="{ hello: item }"
              [id]="hello"
            >{{ idx }}: <!-- {{ item }} -->{{ hello }}</div>`),
      ({ comp, el, fixture }: TestPars) => {
        console.log('TEST');
        print('comp', comp);
        print('el', el);
        print('fixture', fixture);
        print('comp.cdr', comp.cdr);
        print('comp.cdr._view', comp.cdr._view);
        print('fixture.elementRef', fixture.elementRef);
        print('fixture.componentRef', fixture.componentRef);
        print('fixture.componentRef._hostElement', fixture.componentRef._hostElement);
        print('comp.cdr._view.ref', comp.cdr._view.ref);
        print('comp.cdr._view.context', comp.cdr._view.context);
        print('comp.cdr._view._currentDebugContext', comp.cdr._view._currentDebugContext);
        print('comp.cdr._view._NgFor_0_6', comp.cdr._view._NgFor_0_6);
        print('comp.cdr._view._NgFor_0_6._ngForOf', comp.cdr._view._NgFor_0_6._ngForOf);
        expect(el.textContent).toEqual('foobarbaz');
    }));

  });

  // it('', test({ component, class: TestComponent }, ({ test_cmp: comp, el, fixture }) => {
  //   expect().toEqual();
  // }));

})
