import { ElementRef, DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { Type } from './types';
export interface CompTestMeta<T> {
    comp: T;
    el: Element;
    fixture: ComponentFixture<T>;
    debugEl: DebugElement;
}
export declare function getComp<T>(test_class: Type<T>, props?: {}): Promise<CompTestMeta<T>>;
export declare let myAsync: (fn: () => void) => (...args: any[]) => any;
export declare function sendEvent(el: Element, eventType: string): void;
export declare function setInput(input: ElementRef, val: any): void;
export declare let asyncTest: any;
export declare let testFn: <T>(cls: Type<T>) => (props: Object, fn: Function) => (done: (o: CompTestMeta<T>) => void) => any;
