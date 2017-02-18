"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var R = require("ramda");
var core_1 = require("@angular/core");
var view_container_ref_1 = require("@angular/core/src/linker/view_container_ref");
var dom_element_schema_registry_1 = require("@angular/compiler/src/schema/dom_element_schema_registry");
var lang_1 = require("@angular/core/src/facade/lang");
var js_1 = require("./js");
var ng_for_1 = require("@angular/common/src/directives/ng_for");
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
var ObjDirective = (function () {
    function ObjDirective() {
    }
    ObjDirective.prototype._setItem = function (name, val) { };
    ;
    Object.defineProperty(ObjDirective.prototype, "attributes", {
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
        set: function (obj) {
            this._obj = obj;
            if (lang_1.isBlank(this._differ) && lang_1.isPresent(obj)) {
                this._differ = this._differs.find(obj).create(this._cdr); // <ChangeDetectorRef>null
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjDirective.prototype, "extraVars", {
        set: function (obj) {
            this._extra = obj;
        },
        enumerable: true,
        configurable: true
    });
    // ngDoCheck() {};
    ObjDirective.prototype.ngDoCheck = function () {
        var _this = this;
        var obj = this._obj;
        if (lang_1.isPresent(this._differ)) {
            var changes = this._differ.diff(obj);
            if (lang_1.isPresent(changes)) {
                changes.forEachRemovedItem(function (record) {
                    _this._setItem(record.key, null);
                });
            }
        }
        R.mapObjIndexed(function (v, k) {
            _this._setItem(k, v);
        })(obj);
    };
    return ObjDirective;
}());
exports.ObjDirective = ObjDirective;
// // mixin: http://www.2ality.com/2016/05/six-nifty-es6-tricks.html
// // export const DynamicDirective = <T extends Type<any>>(Sup: T) => BaseDirective extends Sup;
// export const DynamicDirective = <T extends Type<any>>(Sup: T) => class extends Sup {
// // export class BaseDirective {
//   _context: Object;
//   _extra: {};
//   _obj: Obj<string>;
//   _differ: KeyValueDiffer;
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
//     if (isPresent(this._differ)) {
//       var changes = this._differ.diff(obj);
//       if (isPresent(changes)) {
//         changes.forEachRemovedItem((record: KeyValueChangeRecord) => {
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
var SetAttrs = (function (_super) {
    __extends(SetAttrs, _super);
    function SetAttrs(
        // ObjDirective
        _differs, _elRef, _renderer, 
        // this
        _registry) {
        var _this = _super.call(this) || this;
        _this._elRef = _elRef;
        _this._renderer = _renderer;
        _this._registry = _registry;
        // ObjDirective
        _this._el = _elRef.nativeElement;
        // this
        _this._elName = _this._el.tagName;
        return _this;
    }
    SetAttrs.prototype._setItem = function (name, val) {
        var isProp = this._registry.hasProperty(this._elName, name, []);
        (isProp ? this._renderer.setElementProperty : this._renderer.setElementAttribute)(this._el, name, val);
    };
    SetAttrs.prototype.ngDoCheck = function () {
        if (lang_1.isPresent(this._differ)) {
            var changes = this._differ.diff(this._obj);
            if (lang_1.isPresent(changes)) {
                this._applyChanges(changes);
            }
        }
    };
    SetAttrs.prototype._applyChanges = function (changes) {
        var _this = this;
        changes.forEachAddedItem(function (record) {
            _this._setItem(record.key, record.currentValue);
        });
        changes.forEachChangedItem(function (record) {
            _this._setItem(record.key, record.currentValue);
        });
        changes.forEachRemovedItem(function (record) {
            _this._setItem(record.key, ''); // null
        });
    };
    return SetAttrs;
}(ObjDirective));
SetAttrs = __decorate([
    core_1.Directive({
        selector: '[setAttrs]',
        inputs: ['attributes: setAttrs'],
    }),
    __metadata("design:paramtypes", [core_1.KeyValueDiffers,
        core_1.ElementRef,
        core_1.Renderer,
        dom_element_schema_registry_1.DomElementSchemaRegistry])
], SetAttrs);
exports.SetAttrs = SetAttrs;
// get the context for a viewContainer -- for e.g. `_View_FieldComp5` first go up to `_View_FieldComp0`.
function getContext(view /*ViewContainerRef*/) {
    var condition = function (x) { return R.contains(x.context.constructor)([Object, ng_for_1.NgForRow]); };
    return js_1.transformWhile(condition, function (y) { return y.parentView; }, view['_element'].parentView).context;
}
// dynamically bind properties/attributes (cf. SetAttrs), using strings evaluated in the component context
// intended as a `[[prop]]="evalStr"`, if now `[dynamicAttrs]="{ prop: evalStr }"`
// hint toward original: `bindAndWriteToRenderer` @ `compiler/view_compiler/property_binder.ts`.
// alternative: `[prop]="eval(evalStr)"` for `eval = evalExpr(this)` on class.
// ^ try that for directives! but can't dynamically bind to different things like this.
// challenge: even if I extract rules from JSON, how do I generate these bindings?...
// unless I could dynamically bind to directives, which was the problem, so use this.
var DynamicAttrs = (function (_super) {
    __extends(DynamicAttrs, _super);
    function DynamicAttrs(
        // ObjDirective
        _differs, _elRef, _renderer, 
        // this
        _registry, _viewContainer) {
        var _this = _super.call(this) || this;
        _this._differs = _differs;
        _this._elRef = _elRef;
        _this._renderer = _renderer;
        _this._registry = _registry;
        // ObjDirective
        _this._el = _elRef.nativeElement;
        // DynamicDirective
        _this._extra = {};
        // this
        _this._context = getContext(_viewContainer);
        _this._elName = _this._el.tagName;
        return _this;
    }
    DynamicAttrs.prototype._setItem = function (name, evalStr) {
        var isProp = this._registry.hasProperty(this._elName, name, []);
        var val = js_1.evalExpr(this._context, this._extra)(evalStr);
        (isProp ? this._renderer.setElementProperty : this._renderer.setElementAttribute)(this._el, name, val);
    };
    return DynamicAttrs;
}(ObjDirective));
DynamicAttrs = __decorate([
    core_1.Directive({
        selector: '[dynamicAttrs]',
        inputs: ['attributes: dynamicAttrs', 'extraVars: extraVars'],
    }),
    __metadata("design:paramtypes", [core_1.KeyValueDiffers,
        core_1.ElementRef,
        core_1.Renderer,
        dom_element_schema_registry_1.DomElementSchemaRegistry,
        view_container_ref_1.ViewContainerRef_])
], DynamicAttrs);
exports.DynamicAttrs = DynamicAttrs;
var AppliesDirective = (function (_super) {
    __extends(AppliesDirective, _super);
    function AppliesDirective(
        // ObjDirective
        _differs, _elRef, _renderer, 
        // this
        _registry, _viewContainer) {
        var _this = _super.call(this) || this;
        _this._differs = _differs;
        _this._elRef = _elRef;
        _this._renderer = _renderer;
        _this._registry = _registry;
        // ObjDirective
        _this._el = _elRef.nativeElement;
        // DynamicDirective
        _this._extra = {};
        // this
        _this._context = getContext(_viewContainer);
        _this._elName = _this._el.tagName;
        return _this;
    }
    Object.defineProperty(AppliesDirective.prototype, "doesApply", {
        set: function (bool) {
            this._renderer.setElementProperty(this._el, 'hidden', !bool);
        },
        enumerable: true,
        configurable: true
    });
    return AppliesDirective;
}(ObjDirective));
AppliesDirective = __decorate([
    core_1.Directive({
        selector: '[applies]',
        inputs: ['doesApply: applies', 'extraVars: extraVars'],
    }),
    __metadata("design:paramtypes", [core_1.KeyValueDiffers,
        core_1.ElementRef,
        core_1.Renderer,
        dom_element_schema_registry_1.DomElementSchemaRegistry,
        view_container_ref_1.ViewContainerRef_])
], AppliesDirective);
exports.AppliesDirective = AppliesDirective;
var AppliesExprDirective = (function (_super) {
    __extends(AppliesExprDirective, _super);
    function AppliesExprDirective(
        // ObjDirective
        _differs, _elRef, _renderer, 
        // this
        _registry, _viewContainer) {
        var _this = _super.call(this) || this;
        _this._differs = _differs;
        _this._elRef = _elRef;
        _this._renderer = _renderer;
        _this._registry = _registry;
        // ObjDirective
        _this._el = _elRef.nativeElement;
        // DynamicDirective
        _this._extra = {};
        // this
        _this._context = getContext(_viewContainer);
        _this._elName = _this._el.tagName;
        return _this;
    }
    Object.defineProperty(AppliesExprDirective.prototype, "doesApply", {
        set: function (evalStr) {
            var val = evalStr ? js_1.evalExpr(this._context, this._extra)(evalStr) : true;
            this._renderer.setElementProperty(this._el, 'hidden', !val);
        },
        enumerable: true,
        configurable: true
    });
    return AppliesExprDirective;
}(ObjDirective));
AppliesExprDirective = __decorate([
    core_1.Directive({
        selector: '[appliesExpr]',
        inputs: ['doesApply: appliesExpr', 'extraVars: extraVars'],
    }),
    __metadata("design:paramtypes", [core_1.KeyValueDiffers,
        core_1.ElementRef,
        core_1.Renderer,
        dom_element_schema_registry_1.DomElementSchemaRegistry,
        view_container_ref_1.ViewContainerRef_])
], AppliesExprDirective);
exports.AppliesExprDirective = AppliesExprDirective;
// set styles dynamically (cf. NgStyle), using strings evaluated in the component context
var DynamicStyle = (function (_super) {
    __extends(DynamicStyle, _super);
    function DynamicStyle(
        // ObjDirective
        _differs, _elRef, _renderer, 
        // this
        _viewContainer) {
        var _this = _super.call(this) || this;
        _this._differs = _differs;
        _this._elRef = _elRef;
        _this._renderer = _renderer;
        // ObjDirective
        _this._el = _elRef.nativeElement;
        // DynamicDirective
        _this._extra = {};
        // this
        _this._context = getContext(_viewContainer);
        return _this;
    }
    DynamicStyle.prototype._setItem = function (name, evalStr) {
        var val = js_1.evalExpr(this._context, this._extra)(evalStr);
        this._renderer.setElementStyle(this._el, name, val);
    };
    return DynamicStyle;
}(ObjDirective));
DynamicStyle = __decorate([
    core_1.Directive({
        selector: '[dynamicStyle]',
        inputs: ['attributes: dynamicStyle', 'extraVars: extraVars'],
    }),
    __metadata("design:paramtypes", [core_1.KeyValueDiffers,
        core_1.ElementRef,
        core_1.Renderer,
        view_container_ref_1.ViewContainerRef_])
], DynamicStyle);
exports.DynamicStyle = DynamicStyle;
// set classes dynamically (cf. NgClass), using strings evaluated in the component context
var DynamicClass = (function (_super) {
    __extends(DynamicClass, _super);
    function DynamicClass(
        // ObjDirective
        _differs, _elRef, _renderer, 
        // this
        _viewContainer) {
        var _this = _super.call(this) || this;
        _this._differs = _differs;
        _this._elRef = _elRef;
        _this._renderer = _renderer;
        // ObjDirective
        _this._el = _elRef.nativeElement;
        // DynamicDirective
        _this._extra = {};
        // this
        _this._context = getContext(_viewContainer);
        return _this;
    }
    DynamicClass.prototype._setItem = function (name, evalStr) {
        var val = js_1.evalExpr(this._context, this._extra)(evalStr);
        this._renderer.setElementClass(this._el, name, val);
    };
    return DynamicClass;
}(ObjDirective));
DynamicClass = __decorate([
    core_1.Directive({
        selector: '[dynamicClass]',
        inputs: ['attributes: dynamicClass', 'extraVars: extraVars'],
    }),
    __metadata("design:paramtypes", [core_1.KeyValueDiffers,
        core_1.ElementRef,
        core_1.Renderer,
        view_container_ref_1.ViewContainerRef_])
], DynamicClass);
exports.DynamicClass = DynamicClass;
// set local template variables from an object.
var AssignLocal = (function () {
    function AssignLocal(_viewContainer) {
        this._context = getContext(_viewContainer);
    }
    Object.defineProperty(AssignLocal.prototype, "localVariable", {
        set: function (obj) {
            var _this = this;
            R.toPairs(obj).forEach(function (_a) {
                var k = _a[0], v = _a[1];
                _this._context[k] = v;
            })(obj);
        },
        enumerable: true,
        configurable: true
    });
    return AssignLocal;
}());
AssignLocal = __decorate([
    core_1.Directive({
        selector: '[assignLocal]',
        inputs: ['localVariable: assignLocal'],
    }),
    __metadata("design:paramtypes", [view_container_ref_1.ViewContainerRef_])
], AssignLocal);
exports.AssignLocal = AssignLocal;
// binding to [multiple events](https://github.com/angular/angular/issues/6675)
// https://developer.mozilla.org/en-US/docs/Web/Events