import * as R from 'ramda';
import { Directive, Renderer, ElementRef, ViewContainerRef, EmbeddedViewRef, ViewRef, TemplateRef, DoCheck, KeyValueDiffer, KeyValueDiffers, KeyValueChangeRecord, ChangeDetectorRef, DebugNode } from '@angular/core';
// import { ViewContainer } from '@angular/core/src/linker/view_container';
import { DomElementSchemaRegistry } from '@angular/compiler/src/schema/dom_element_schema_registry.d';
import { Component } from '@angular/core';
import { truthy, falsy } from './js';
import { evalExpr, transformWhile, print } from './js';
import { NgForOfContext } from '@angular/common/src/directives/ng_for_of.d';
// import { ExtDir } from './annotations';
import { Obj, Type } from './types';
// export { ObjDirective };

// // [HTML attribute vs. DOM property](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#html-attribute-vs-dom-property)
// // [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)
// // [properties / IDL attributes](https://www.w3.org/TR/DOM-Level-2-HTML/idl-definitions.html)
// // PropertyBindingType: Property, Attribute, Class, Style -- https://github.com/angular/angular/blob/master/modules/angular2/src/compiler/template_ast.ts
// // [prefix definitions](https://github.com/angular/angular/blob/master/modules/angular2/src/compiler/template_parser.ts)
// // each calls a respective `setElement*` -- https://github.com/angular/angular/blob/master/modules/angular2/src/compiler/view_compiler/property_binder.ts
// const setMethod = {
//   property: 'setElementProperty',
//   attribute: 'setElementAttribute',
//   class: 'setElementClass',
//   style: 'setElementStyle',
//   // directive: 'setElementDirective',  // <-- nope, doesn't exist :(
//   // ^ compiled components instantiate directives (names numbered!), then in
//   // `detectChangesInternal` feeds the expression results into their inputs,
//   // and finally saves the result to detect changes on the next check.
// };
// // https://github.com/angular/angular/blob/master/modules/%40angular/platform-browser/src/web_workers/worker/_renderer.ts
// // setText, invokeElementMethod, listen, listenGlobal
// // this._el.style.backgroundColor = color;

// // return a string key of the method to set the given key for the element in question
// function keyMethod(registry: DomElementSchemaRegistry, elName: string, k: string): string {
//   return setMethod[registry.hasProperty(elName, k, []) ? 'property' : 'attribute'];
// }

// abstract
export class ObjDirective implements DoCheck {
  _el: HTMLElement;
  _elName: string;
  _differs: KeyValueDiffers;
  _cdr: ChangeDetectorRef;

  // DynamicDirective
  _context: Object;
  _extra: {};
  _obj: Obj<string>;
  _differ: KeyValueDiffer<string, string>;
  _setItem(name: string, val: string|null): void {};

  // constructor(
  //   // ObjDirective
  //   public _differs: KeyValueDiffers,
  //   public _elRef: ElementRef,
  //   public _renderer: Renderer,
  //   public _cdr: ChangeDetectorRef,
  // ) {
  //   // ObjDirective
  //   this._el = _elRef.nativeElement;
  // }

  set attributes(obj: {[key: string]: string}) {
    this._obj = obj;
    if (falsy(this._differ) && truthy(obj)) {
      this._differ = this._differs.find(obj).create(this._cdr); // <ChangeDetectorRef>null
    }
  }

  set extraVars(obj: {[key: string]: any}) {
    this._extra = obj;
  }

  // ngDoCheck() {};
  ngDoCheck() {
    let obj = this._obj;
    if (truthy(this._differ)) {
      var changes = this._differ.diff(obj);
      if (truthy(changes)) {
        changes.forEachRemovedItem((record: KeyValueChangeRecord<string, string>) => {
          this._setItem(record.key, null);
        });
      }
    }
    R.mapObjIndexed((v: any, k: string) => { // forEach
      this._setItem(k, v);
    })(obj);
  }

}

// // mixin: http://www.2ality.com/2016/05/six-nifty-es6-tricks.html
// // export const DynamicDirective = <T extends Type<any>>(Sup: T) => BaseDirective extends Sup;
// export const DynamicDirective = <T extends Type<any>>(Sup: T) => class extends Sup {
// // export class BaseDirective {
//   _context: Object;
//   _extra: {};
//   _obj: Obj<string>;
//   _differ: KeyValueDiffer<string, string>;
//   _setItem(name: string, val: string|null): void {};

//   // constructor() {
//   //   // DynamicDirective
//   //   this._extra = {};
//   // }

//   set extraVars(obj: {[key: string]: any}) {
//     this._extra = obj;
//   }

//   ngDoCheck() {
//     let obj = this._obj;
//     if (truthy(this._differ)) {
//       var changes = this._differ.diff(obj);
//       if (truthy(changes)) {
//         changes.forEachRemovedItem((record: KeyValueChangeRecord<string, string>) => {
//           this._setItem(record.key, null);
//         });
//       }
//     }
//     R.mapObjIndexed((v: any, k: string) => { // forEach
//       this._setItem(k, v);
//     })(obj);
//   }

// };

// set multiple properties/attributes from an object without knowing which is which.
// named after attributes rather than properties so my json-schema could go with
// that without causing confusing with its existing `properties` attribute.
@Directive({
  selector: '[setAttrs]',
  inputs: ['attributes: setAttrs'],
})
export class SetAttrs extends ObjDirective {

  constructor(
    // ObjDirective
    _differs: KeyValueDiffers,
    public _elRef: ElementRef,
    public _renderer: Renderer,
    // this
    public _registry: DomElementSchemaRegistry,
  ) {
    super();
    // ObjDirective
    this._el = _elRef.nativeElement;
    // this
    this._elName = this._el.tagName;
  }

  _setItem(name: string, val: string): void {
    let isProp = this._registry.hasProperty(this._elName, name, []);
    (isProp ? this._renderer.setElementProperty : this._renderer.setElementAttribute)(this._el, name, val);
  }

  ngDoCheck() {
    if (truthy(this._differ)) {
      var changes = this._differ.diff(this._obj);
      if (truthy(changes)) {
        this._applyChanges(changes);
      }
    }
  }

  public _applyChanges(changes: any): void {
    changes.forEachAddedItem((record: KeyValueChangeRecord<string, string>) => {
      this._setItem(record.key, <string> record.currentValue);
    });
    changes.forEachChangedItem((record: KeyValueChangeRecord<string, string>) => {
      this._setItem(record.key, <string> record.currentValue);
    });
    changes.forEachRemovedItem((record: KeyValueChangeRecord<string, string>) => {
      this._setItem(record.key, ''); // null
    });
  }

}

// get the context for a viewContainer -- for e.g. `_View_FieldComp5` first go up to `_View_FieldComp0`.
function getContext(view: ViewContainerRef /*ViewContainerRef*/): Obj<any> {
  let condition = (x: EmbeddedViewRef<any>) => R.contains(x.context.constructor)([Object, NgForOfContext]);
  return transformWhile(condition, (y: EmbeddedViewRef<any>) => y['parentView'], view.element['parentView']).context;
}

// dynamically bind properties/attributes (cf. SetAttrs), using strings evaluated in the component context
// intended as a `[[prop]]="evalStr"`, if now `[dynamicAttrs]="{ prop: evalStr }"`
// hint toward original: `bindAndWriteToRenderer` @ `compiler/view_compiler/property_binder.ts`.
// alternative: `[prop]="eval(evalStr)"` for `eval = evalExpr(this)` on class.
// ^ try that for directives! but can't dynamically bind to different things like this.
// challenge: even if I extract rules from JSON, how do I generate these bindings?...
// unless I could dynamically bind to directives, which was the problem, so use this.
@Directive({
  selector: '[dynamicAttrs]',
  inputs: ['attributes: dynamicAttrs', 'extraVars: extraVars'],
})
export class DynamicAttrs extends ObjDirective { // DynamicDirective(ObjDirective) {
  _el: any;
  _elName: string;

  // DynamicDirective
  _context: Object;
  _extra: {};
  _obj: Obj<string>;
  _differ: KeyValueDiffer<string, string>;

  constructor(
    // ObjDirective
    public _differs: KeyValueDiffers,
    public _elRef: ElementRef,
    public _renderer: Renderer,
    // this
    public _registry: DomElementSchemaRegistry,
    _viewContainer: ViewContainerRef,
  ) {
    super();
    // ObjDirective
    this._el = _elRef.nativeElement;
    // DynamicDirective
    this._extra = {};
    // this
    this._context = getContext(_viewContainer);
    this._elName = this._el.tagName;
  }

  _setItem(name: string, evalStr: string): void {
    let isProp = this._registry.hasProperty(this._elName, name, []);
    let val = evalExpr(this._context, this._extra)(evalStr);
    (isProp ? this._renderer.setElementProperty : this._renderer.setElementAttribute)(this._el, name, val);
  }

}

@Directive({
  selector: '[applies]',
  inputs: ['doesApply: applies', 'extraVars: extraVars'],
})
export class AppliesDirective extends ObjDirective { // DynamicDirective(ObjDirective) {
  _el: any;
  _elName: string;

  // DynamicDirective
  _context: Object;
  _extra: {};
  _obj: Obj<string>;
  _differ: KeyValueDiffer<string, string>;

  constructor(
    // ObjDirective
    public _differs: KeyValueDiffers,
    public _elRef: ElementRef,
    public _renderer: Renderer,
    // this
    public _registry: DomElementSchemaRegistry,
    _viewContainer: ViewContainerRef,
  ) {
    super();
    // ObjDirective
    this._el = _elRef.nativeElement;
    // DynamicDirective
    this._extra = {};
    // this
    this._context = getContext(_viewContainer);
    this._elName = this._el.tagName;
  }

  set doesApply(bool: boolean) {
    this._renderer.setElementProperty(this._el, 'hidden', !bool);
  }

}

@Directive({
  selector: '[appliesExpr]',
  inputs: ['doesApply: appliesExpr', 'extraVars: extraVars'],
})
export class AppliesExprDirective extends ObjDirective { // DynamicDirective(ObjDirective) {
  _el: any;
  _elName: string;

  // DynamicDirective
  _context: Object;
  _extra: {};
  _obj: Obj<string>;
  _differ: KeyValueDiffer<string, string>;

  constructor(
    // ObjDirective
    public _differs: KeyValueDiffers,
    public _elRef: ElementRef,
    public _renderer: Renderer,
    // this
    public _registry: DomElementSchemaRegistry,
    _viewContainer: ViewContainerRef,
  ) {
    super();
    // ObjDirective
    this._el = _elRef.nativeElement;
    // DynamicDirective
    this._extra = {};
    // this
    this._context = getContext(_viewContainer);
    this._elName = this._el.tagName;
  }

  set doesApply(evalStr: string) {
    let val = evalStr ? evalExpr(this._context, this._extra)(evalStr) : true;
    this._renderer.setElementProperty(this._el, 'hidden', !val);
  }

}

// set styles dynamically (cf. NgStyle), using strings evaluated in the component context
@Directive({
  selector: '[dynamicStyle]',
  inputs: ['attributes: dynamicStyle', 'extraVars: extraVars'],
})
export class DynamicStyle extends ObjDirective { // DynamicDirective(ObjDirective) {
  _el: any;

  // DynamicDirective
  _context: Object;
  _extra: {};
  _obj: Obj<string>;
  _differ: KeyValueDiffer<string, string>;

  constructor(
    // ObjDirective
    public _differs: KeyValueDiffers,
    public _elRef: ElementRef,
    public _renderer: Renderer,
    // this
    _viewContainer: ViewContainerRef,
  ) {
    super();
    // ObjDirective
    this._el = _elRef.nativeElement;
    // DynamicDirective
    this._extra = {};
    // this
    this._context = getContext(_viewContainer);
  }

  _setItem(name: string, evalStr: string): void {
    let val = evalExpr(this._context, this._extra)(evalStr);
    this._renderer.setElementStyle(this._el, name, val);
  }

}

// set classes dynamically (cf. NgClass), using strings evaluated in the component context
@Directive({
  selector: '[dynamicClass]',
  inputs: ['attributes: dynamicClass', 'extraVars: extraVars'],
})
export class DynamicClass extends ObjDirective { // DynamicDirective(ObjDirective) {
  _el: any;

  // DynamicDirective
  _context: Object;
  _extra: {};
  _obj: Obj<string>;
  _differ: KeyValueDiffer<string, string>;

  constructor(
    // ObjDirective
    public _differs: KeyValueDiffers,
    public _elRef: ElementRef,
    public _renderer: Renderer,
    // this
    _viewContainer: ViewContainerRef,
  ) {
    super();
    // ObjDirective
    this._el = _elRef.nativeElement;
    // DynamicDirective
    this._extra = {};
    // this
    this._context = getContext(_viewContainer);
  }

  _setItem(name: string, evalStr: string): void {
    let val = evalExpr(this._context, this._extra)(evalStr);
    this._renderer.setElementClass(this._el, name, val);
  }

}
