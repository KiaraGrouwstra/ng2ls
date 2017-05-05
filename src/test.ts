import * as R from 'ramda';
import { Component, ViewChild, ElementRef, DebugElement } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fakeAsync, tick, flushMicrotasks, TestBed, ComponentFixture } from '@angular/core/testing.d';
import { dispatchEvent } from '@angular/platform-browser/testing/src/browser_util.d';
import { Type } from './types';

export interface CompTestMeta<T> {
  comp: T;
  el: Element;
  fixture: ComponentFixture<T>;
  debugEl: DebugElement;
}

// create a component to test and return related stuff; must await result within an `async function` (not `fakeAsync`).
export function getComp<T>(test_class: Type<T>, props: {} = {}): Promise<CompTestMeta<T>> {
  let fixture = TestBed.createComponent(test_class);
  // await fixture.whenStable();
  return fixture.whenStable().then(() => {
    let comp = fixture.componentInstance;
    Object.assign(comp, props);
    fixture.detectChanges();
    let debugEl = fixture.debugElement;
    let el = debugEl.nativeElement;
    return { comp, el, fixture, debugEl };
  });
}

// hack to inject a tick into fakeAsync, since it appears usually needed...
export let myAsync = (fn: () => void) => fakeAsync(() => {
  fn();
  tick(1000);
});

// taken from ng2 DOM's `dispatchEvent`, cuz the DOM script errors for me with `el.dispatchEvent is not a function`.
// for convenience I could incorporate `.nativeElement` here, though that makes it incompatible with the original...
export function sendEvent(el: Element, eventType: string): void {
  let event = document.createEvent('Event');
  event.initEvent(eventType, true, true);
  el.dispatchEvent(event);  //.nativeElement
}

// set the value of an input, and trigger the corresponding event.
// The input can be obtained using `debugEl.query(By.css(css))`.
// trying to set a `select` to an unlisted option sets it to ''.
export function setInput(input: ElementRef, val: any): void {
  let el = input.nativeElement;
  el.value = val;
  // expect(el.value).toEqual(val);
  // sendEvent(el, 'input');
  dispatchEvent(el, 'input');
  dispatchEvent(el, 'change');
  // it seems <input>s want (input), <select>s want (change)
  tick(10000);
}

// a function for creating and testing a component for the given parameters.
export let asyncTest = R.curry(<T>(
  comp_cls: Type<T>,
  props: {},
  fn: (meta: CompTestMeta<T>) => void,
) => async function(done: Function | { fail: Function }) {
  try {
    let par = await getComp(comp_cls, props);
    // fn(par);
    // fakeAsync(fn)(par);
    myAsync(() => fn(par))();
    (<Function>done)();
  }
  catch(e) {
    (<{ fail: Function }> done).fail(e);
  }
});

// create a test function from component data
export let testFn = <T>(cls: Type<T>) =>
    (props: Object, fn: Function) =>
    (done: (o: CompTestMeta<T>) => void) =>
        asyncTest(cls)(props, fn)(done);
