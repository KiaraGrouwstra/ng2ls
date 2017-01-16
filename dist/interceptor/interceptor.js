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
var core_1 = require("@angular/core");
var store_1 = require("@ngrx/store");
var rxjs_1 = require("rxjs");
require("rxjs/operator/withLatestFrom");
require("rxjs/operator/switchMap");
var Interceptor = (function (_super) {
    __extends(Interceptor, _super);
    function Interceptor(_store, _dispatcher, _interceptor) {
        var _this = _super.call(this) || this;
        _this._store = _store;
        _this._dispatcher = _dispatcher;
        _this._interceptor = _interceptor;
        _this.withLatestFrom(_store)
            .switchMap(function (_a) {
            var action = _a[0], store = _a[1];
            return _interceptor.intercept(store, action);
        })
            .subscribe(_dispatcher);
        return _this;
    }
    Interceptor.prototype.dispatch = function (action) {
        this.next(action);
    };
    return Interceptor;
}(rxjs_1.Subject));
exports.Interceptor = Interceptor;
function _interceptorFactory(store, dispatcher, interception) {
    return new Interceptor(store, dispatcher, interception);
}
exports._interceptorFactory = _interceptorFactory;
var InterceptModule = InterceptModule_1 = (function () {
    function InterceptModule() {
    }
    InterceptModule.provideInterceptor = function (type) {
        return {
            ngModule: InterceptModule_1,
            providers: [
                type,
                {
                    provide: Interceptor,
                    useFactory: _interceptorFactory,
                    deps: [store_1.Store, store_1.Dispatcher, type]
                }
            ]
        };
    };
    return InterceptModule;
}());
InterceptModule = InterceptModule_1 = __decorate([
    core_1.NgModule(),
    __metadata("design:paramtypes", [])
], InterceptModule);
exports.InterceptModule = InterceptModule;
var InterceptModule_1;
