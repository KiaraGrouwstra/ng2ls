"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var rxjs_1 = require('rxjs');
var actions_1 = require('../actions/actions');
var R = require('ramda');
var util_1 = require('../util');
var pages_1 = require('../pages');
var Interceptor = (function () {
    function Interceptor(http) {
        this.http = http;
        this.intercept = R.cond([
            [
                util_1.typeIn([actions_1.ACTION.INIT]),
                function (state, act) { return rxjs_1.Observable.of(util_1.toAction(act.type, {
                    loginForm: { email: 'hon@hon.com', password: 'xxx' },
                    rootView: pages_1.LoginView,
                    loginSeg: 'login'
                })); }
            ],
            [
                util_1.typeIn([actions_1.ACTION.LOGIN]),
                function (state, act) { return rxjs_1.Observable.merge(rxjs_1.Observable.of(util_1.toAction(actions_1.ACTION.LOADING, { content: 'login...' })), rxjs_1.Observable.of(util_1.toAction(act.type, { user: { name: 'xon', uid: Date.now() } }), util_1.toAction(actions_1.ACTION.LOADING, false), util_1.toAction(actions_1.ACTION.SETROOT, { rootScene: HomePage })).delay(2200)); }
            ],
            [
                R.T,
                function (state, action) { return rxjs_1.Observable.of(action); }
            ]
        ]);
    }
    Interceptor = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Interceptor);
    return Interceptor;
}());
exports.Interceptor = Interceptor;
/*
Usage:
- add in module:
  import { InterceptModule } from './interceptor';
  import { Interceptor } from '...';
  InterceptModule.provideInterceptor(Interceptor),
- dispatch through interceptor in components:
  import { Interceptor } from './interceptor';
  public interceptor: Interceptor,
  this.interceptor.dispatch(toAction(ACTIONS.LOGIN, payload));
*/
