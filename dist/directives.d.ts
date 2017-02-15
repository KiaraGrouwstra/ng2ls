import { Renderer, ElementRef, DoCheck, KeyValueDiffer, KeyValueDiffers, ChangeDetectorRef } from '@angular/core';
import { ViewContainerRef_ } from '@angular/core/src/linker/view_container_ref';
import { DomElementSchemaRegistry } from '@angular/compiler/src/schema/dom_element_schema_registry';
import { Obj } from './types';
export declare class ObjDirective implements DoCheck {
    _el: HTMLElement;
    _elName: string;
    _differs: KeyValueDiffers;
    _cdr: ChangeDetectorRef;
    _context: Object;
    _extra: {};
    _obj: Obj<string>;
    _differ: KeyValueDiffer;
    _setItem(name: string, val: string | null): void;
    attributes: {
        [key: string]: string;
    };
    extraVars: {
        [key: string]: any;
    };
    ngDoCheck(): void;
}
export declare class SetAttrs extends ObjDirective {
    _elRef: ElementRef;
    _renderer: Renderer;
    _registry: DomElementSchemaRegistry;
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry);
    _setItem(name: string, val: string): void;
    ngDoCheck(): void;
    _applyChanges(changes: any): void;
}
export declare class DynamicAttrs extends ObjDirective {
    _differs: KeyValueDiffers;
    _elRef: ElementRef;
    _renderer: Renderer;
    _registry: DomElementSchemaRegistry;
    _el: any;
    _elName: string;
    _context: Object;
    _extra: {};
    _obj: Obj<string>;
    _differ: KeyValueDiffer;
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry, _viewContainer: ViewContainerRef_);
    _setItem(name: string, evalStr: string): void;
}
export declare class AppliesDirective extends ObjDirective {
    _differs: KeyValueDiffers;
    _elRef: ElementRef;
    _renderer: Renderer;
    _registry: DomElementSchemaRegistry;
    _el: any;
    _elName: string;
    _context: Object;
    _extra: {};
    _obj: Obj<string>;
    _differ: KeyValueDiffer;
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry, _viewContainer: ViewContainerRef_);
    doesApply: boolean;
}
export declare class AppliesExprDirective extends ObjDirective {
    _differs: KeyValueDiffers;
    _elRef: ElementRef;
    _renderer: Renderer;
    _registry: DomElementSchemaRegistry;
    _el: any;
    _elName: string;
    _context: Object;
    _extra: {};
    _obj: Obj<string>;
    _differ: KeyValueDiffer;
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _registry: DomElementSchemaRegistry, _viewContainer: ViewContainerRef_);
    doesApply: string;
}
export declare class DynamicStyle extends ObjDirective {
    _differs: KeyValueDiffers;
    _elRef: ElementRef;
    _renderer: Renderer;
    _el: any;
    _context: Object;
    _extra: {};
    _obj: Obj<string>;
    _differ: KeyValueDiffer;
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _viewContainer: ViewContainerRef_);
    _setItem(name: string, evalStr: string): void;
}
export declare class DynamicClass extends ObjDirective {
    _differs: KeyValueDiffers;
    _elRef: ElementRef;
    _renderer: Renderer;
    _el: any;
    _context: Object;
    _extra: {};
    _obj: Obj<string>;
    _differ: KeyValueDiffer;
    constructor(_differs: KeyValueDiffers, _elRef: ElementRef, _renderer: Renderer, _viewContainer: ViewContainerRef_);
    _setItem(name: string, evalStr: string): void;
}
export declare class AssignLocal {
    _el: HTMLElement;
    _context: Obj<any>;
    constructor(_viewContainer: ViewContainerRef_);
    localVariable: any;
}
