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
var annotations_1 = require('./annotations');
var core_1 = require('@angular/core');
// import { Reflect, getMetadata } from 'reflect-metadata'; // /Reflect
var OnPush = core_1.ChangeDetectionStrategy.OnPush, Default = core_1.ChangeDetectionStrategy.Default;
var XComp = (function () {
    function XComp() {
        this.n = 1;
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], XComp.prototype, "inp", void 0);
    XComp = __decorate([
        core_1.Component({
            changeDetection: Default,
        }), 
        __metadata('design:paramtypes', [])
    ], XComp);
    return XComp;
}());
var AComp = (function (_super) {
    __extends(AComp, _super);
    function AComp() {
        _super.apply(this, arguments);
    }
    AComp = __decorate([
        annotations_1.ExtComp({
            changeDetection: Default,
        }), 
        __metadata('design:paramtypes', [])
    ], AComp);
    return AComp;
}(XComp));
var BComp = (function (_super) {
    __extends(BComp, _super);
    function BComp() {
        _super.apply(this, arguments);
    }
    BComp = __decorate([
        annotations_1.ExtComp({
            changeDetection: OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], BComp);
    return BComp;
}(AComp));
var comp_meta = function (cls) { return Reflect.getMetadata('annotations', cls)[0]; };
var meta_x = comp_meta(XComp);
var meta_a = comp_meta(AComp);
var meta_b = comp_meta(BComp);
var comp_x = new XComp;
var comp_a = new AComp;
var comp_b = new BComp;
describe('extends', function () {
    it('should inherit properties', function () {
        expect(comp_x.n).toEqual(1);
        expect(comp_a.n).toEqual(1);
        expect(comp_b.n).toEqual(1);
    });
    it('should inherit `@Input`s', function () {
        expect(Reflect.getMetadata('propMetadata', XComp)['inp'][0].constructor).toEqual(core_1.Input);
        expect(Reflect.getMetadata('propMetadata', AComp)['inp'][0].constructor).toEqual(core_1.Input);
        expect(Reflect.getMetadata('propMetadata', BComp)['inp'][0].constructor).toEqual(core_1.Input);
    });
});
describe('ExtComp', function () {
    it('should inherit values annotations', function () {
        expect(meta_x.changeDetection).toEqual(OnPush);
        expect(meta_a.changeDetection).toEqual(OnPush);
        expect(meta_b.changeDetection).toEqual(OnPush);
    });
    it('should allow extending arrays', function () {
        expect(meta_x.directives).toEqual([1]);
        expect(meta_a.directives).toEqual([1, 2]);
        expect(meta_b.directives).toEqual([1, 2, 3]);
    });
});
