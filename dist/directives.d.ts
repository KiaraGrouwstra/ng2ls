import { Renderer, ElementRef, ViewContainerRef, DoCheck, KeyValueDiffer, KeyValueDiffers, ChangeDetectorRef } from '@angular/core';
import { DomElementSchemaRegistry } from '@angular/compiler/src/schema/dom_element_schema_registry';
import { Obj } from './types';
export { ObjDirective };
declare abstract class ObjDirective implements DoCheck {
    _el: HTMLElement;
    _obj: Obj<string>;
    _elName: string;
    _differ: KeyValueDiffer;
    _differs: KeyValueDiffers;
    _cdr: ChangeDetectorRef;
    attributes: {
        [key: string]: string;
    };
    ngDoCheck(): void;
}
export declare class SetAttrs extends ObjDirective {
    private _elRef;
    private _renderer;
    private _registry;
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry);
    private _setItem(name, val);
    ngDoCheck(): void;
    private _applyChanges(changes);
}
export declare class DynamicAttrs extends any {
    private _differs;
    private _elRef;
    private _renderer;
    private _registry;
    _el: any;
    _elName: string;
    _context: Object;
    _extra: {};
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry, _viewContainer: ViewContainerRef);
    private _setItem(name, evalStr);
}
export declare class AppliesDirective extends any {
    private _differs;
    private _elRef;
    private _renderer;
    private _registry;
    _el: any;
    _elName: string;
    _context: Object;
    _extra: {};
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry, _viewContainer: ViewContainerRef);
    doesApply: boolean;
}
export declare class AppliesExprDirective extends any {
    private _differs;
    private _elRef;
    private _renderer;
    private _registry;
    _el: any;
    _elName: string;
    _context: Object;
    _extra: {};
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry, _viewContainer: ViewContainerRef);
    doesApply: string;
}
export declare class DynamicStyle extends any {
    private _differs;
    private _elRef;
    private _renderer;
    _el: any;
    _context: Object;
    _extra: {};
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _viewContainer: ViewContainerRef);
    private _setItem(name, evalStr);
}
export declare class DynamicClass extends any {
    private _differs;
    private _elRef;
    private _renderer;
    _el: any;
    _context: Object;
    _extra: {};
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _viewContainer: ViewContainerRef);
    private _setItem(name, evalStr);
}
export declare class AssignLocal {
    _el: HTMLElement;
    _context: Obj<any>;
    constructor(_viewContainer: ViewContainerRef);
    localVariable: any;
}
